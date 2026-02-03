from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Keyword mappings for classification
PRIORITY_KEYWORDS = {
    "high": ["urgent", "asap", "immediately", "important", "deadline", "critical", "emergency"],
    "medium": ["soon", "schedule", "next", "plan", "moderate"],
    "low": ["later", "whenever", "optional", "eventual", "someday", "low priority"]
}

STATUS_KEYWORDS = {
    "done": ["completed", "finished", "done", "complete"],
    "progress": ["working", "in progress", "started", "starting", "begin"],
    "todo": []
}

def score_text(text, keyword_map):
    """Score text against keyword map and return matches"""
    text = text.lower()
    scores = {}
    matched = {}

    for label, keywords in keyword_map.items():
        count = sum(1 for k in keywords if k in text)
        scores[label] = count
        if count > 0:
            matched[label] = [k for k in keywords if k in text]

    return scores, matched

def predict_priority(text):
    """Predict priority with confidence and reasoning"""
    scores, matched = score_text(text, PRIORITY_KEYWORDS)
    
    # Get priority with highest score
    priority = max(scores, key=scores.get) if max(scores.values()) > 0 else "medium"
    
    # Calculate confidence (0.4 base + 0.2 per keyword match, max 0.9)
    confidence = min(0.9, 0.4 + scores[priority] * 0.2)
    
    # Generate reason
    if scores[priority] > 0:
        keywords_found = matched.get(priority, [])
        reason = f"Detected {priority} priority keywords: {', '.join(keywords_found)}"
    else:
        reason = "No strong priority keywords detected, defaulting to medium"
        priority = "medium"
    
    return priority, confidence, reason

def predict_status(text):
    """Predict status based on keywords"""
    text = text.lower()
    
    for status, keywords in STATUS_KEYWORDS.items():
        if any(k in text for k in keywords):
            return status
    
    return "todo"

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        if not data or 'description' not in data:
            return jsonify({'error': 'Description is required'}), 400
        
        text = data['description'].strip()
        
        # Predict priority with confidence and reasoning
        priority, confidence, reason = predict_priority(text)
        
        # Predict status
        status = predict_status(text)
        
        return jsonify({
            'priority': priority,
            'status': status,
            'confidence': round(confidence, 2),
            'reason': reason
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'healthy', 'service': 'TaskPilot AI Service'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)