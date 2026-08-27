from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os
import json
import re
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

OPENROUTER_API_KEY = os.getenv('OPENROUTER_API_KEY', '')
OPENROUTER_MODEL   = os.getenv('OPENROUTER_MODEL', 'meta-llama/llama-3.2-3b-instruct')
OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions'


def call_openrouter(prompt: str) -> dict | None:
    """Call OpenRouter API and return the raw JSON response."""
    if not OPENROUTER_API_KEY:
        return None
    try:
        headers = {
            'Authorization': f'Bearer {OPENROUTER_API_KEY}',
            'Content-Type':  'application/json',
            'HTTP-Referer':  'https://taskpilot.app',
            'X-Title':       'TaskPilot',
        }
        payload = {
            'model': OPENROUTER_MODEL,
            'messages': [{'role': 'user', 'content': prompt}],
            'max_tokens': 400,
            'temperature': 0.2,
        }
        resp = requests.post(OPENROUTER_API_URL, json=payload, headers=headers, timeout=12)
        resp.raise_for_status()
        return resp.json()
    except Exception as e:
        print(f'[OpenRouter] error: {e}')
        return None


def extract_json(text: str) -> dict | None:
    """Extract the first JSON object from a string (handles markdown fences)."""
    # Strip markdown code fences
    text = re.sub(r'```(?:json)?', '', text).strip()
    # Find the first {...} block
    match = re.search(r'\{.*\}', text, re.DOTALL)
    if match:
        try:
            return json.loads(match.group())
        except json.JSONDecodeError:
            pass
    return None


def classify_with_ai(text: str) -> dict:
    """Use OpenRouter LLM to classify a task description into structured metadata."""
    prompt = f"""You are a task management AI assistant. Analyze this task description and classify it.

Task: "{text}"

Respond with ONLY a JSON object (no markdown, no explanation):
{{
  "priority": "low" | "medium" | "high",
  "status": "todo" | "progress" | "done",
  "category": "work" | "personal" | "health" | "learning" | "finance" | "urgent" | "other",
  "confidence": 0.0–1.0,
  "reason": "one sentence explaining your classification",
  "tags": ["tag1", "tag2"]
}}

Rules:
- priority=high if the task is urgent, deadline-critical, or has major consequences
- priority=low if optional, someday, or low stakes
- status=progress if the task description implies it's already started
- status=done if the task is described as completed
- category=urgent overrides others if there are strong urgency signals
- tags: 2–3 short keywords from the task content"""

    result = call_openrouter(prompt)
    if result and 'choices' in result and result['choices']:
        content = result['choices'][0]['message']['content']
        parsed  = extract_json(content)
        if parsed:
            return {
                'priority':   parsed.get('priority',  'medium'),
                'status':     parsed.get('status',    'todo'),
                'category':   parsed.get('category',  'other'),
                'confidence': float(parsed.get('confidence', 0.8)),
                'reason':     parsed.get('reason',    'AI classification'),
                'tags':       parsed.get('tags',      []),
                'model':      OPENROUTER_MODEL,
                'ai_powered': True,
            }

    # Fallback to keyword-based
    return classify_with_keywords(text)


def classify_with_keywords(text: str) -> dict:
    """Keyword-based fallback classification."""
    t = text.lower()

    PRIORITY_KW = {
        'high':   ['urgent', 'asap', 'immediately', 'critical', 'deadline', 'emergency', 'must', 'important', 'overdue'],
        'medium': ['soon', 'schedule', 'next', 'plan', 'moderate', 'should', 'need'],
        'low':    ['later', 'whenever', 'optional', 'someday', 'maybe', 'eventually', 'when possible'],
    }
    STATUS_KW = {
        'done':     ['completed', 'finished', 'done', 'complete', 'resolved', 'closed'],
        'progress': ['working', 'in progress', 'started', 'started', 'begin', 'ongoing', 'current'],
        'todo':     [],
    }
    CATEGORY_KW = {
        'work':     ['meeting', 'project', 'report', 'client', 'office', 'work', 'team', 'sprint', 'deploy', 'code', 'review', 'pr', 'email'],
        'health':   ['workout', 'gym', 'exercise', 'run', 'diet', 'doctor', 'medicine', 'sleep', 'fitness', 'health'],
        'learning': ['study', 'course', 'learn', 'read', 'book', 'tutorial', 'practice', 'research'],
        'finance':  ['pay', 'bill', 'invoice', 'budget', 'tax', 'money', 'bank', 'expense'],
        'personal': ['home', 'family', 'friend', 'grocery', 'clean', 'cook', 'shop', 'personal'],
        'urgent':   ['urgent', 'asap', 'emergency', 'immediately', 'critical'],
    }

    # Priority scoring
    scores = {p: sum(1 for k in kws if k in t) for p, kws in PRIORITY_KW.items()}
    priority = max(scores, key=scores.get) if max(scores.values()) > 0 else 'medium'
    confidence = min(0.75, 0.38 + scores[priority] * 0.18)

    # Status
    status = 'todo'
    for s, kws in STATUS_KW.items():
        if any(k in t for k in kws):
            status = s
            break

    # Category
    cat_scores = {c: sum(1 for k in kws if k in t) for c, kws in CATEGORY_KW.items()}
    category = max(cat_scores, key=cat_scores.get) if max(cat_scores.values()) > 0 else 'other'

    # Simple tag extraction (first 2 non-stopword words)
    stopwords = {'a','an','the','and','or','but','in','on','at','to','for','of','with','is','are','was','were','be','been','have','has','had','do','does','did','will','would','could','should','may','might'}
    words = [w for w in re.findall(r'\b[a-z]+\b', t) if w not in stopwords and len(w) > 3]
    tags = list(dict.fromkeys(words))[:2]

    return {
        'priority':   priority,
        'status':     status,
        'category':   category,
        'confidence': round(confidence, 2),
        'reason':     'Keyword-based classification (AI service unavailable)',
        'tags':       tags,
        'model':      'keyword-fallback',
        'ai_powered': False,
    }


@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json(silent=True)
    if not data or 'description' not in data:
        return jsonify({'error': 'description is required'}), 400
    text = data['description'].strip()
    if not text:
        return jsonify({'error': 'description cannot be empty'}), 400
    return jsonify(classify_with_ai(text))


@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        'status':    'healthy',
        'service':   'TaskPilot AI Service v2',
        'provider':  'OpenRouter',
        'model':     OPENROUTER_MODEL,
        'ai_ready':  bool(OPENROUTER_API_KEY),
    })


if __name__ == '__main__':
    print('TaskPilot AI Service v2 starting...')
    print(f'Model: {OPENROUTER_MODEL}')
    print(f'API Key: {"SET" if OPENROUTER_API_KEY else "MISSING"}')
    print('Listening on http://0.0.0.0:8000')
    app.run(host='0.0.0.0', port=8000, debug=True)