from flask import Flask, request, jsonify
from flask_cors import CORS
import re

app = Flask(__name__)
CORS(app)

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        if not data or 'description' not in data:
            return jsonify({'error': 'Description is required'}), 400
        
        text = data['description'].lower().strip()
        
        # Priority classification
        priority = 'medium'  # default
        if any(word in text for word in ['urgent', 'asap', 'immediately', 'critical', 'emergency']):
            priority = 'high'
        elif any(word in text for word in ['later', 'sometime', 'eventually', 'when possible', 'low']):
            priority = 'low'
        
        # Status classification
        status = 'todo'  # default
        if any(word in text for word in ['done', 'completed', 'finished', 'complete']):
            status = 'done'
        elif any(word in text for word in ['start', 'starting', 'begin', 'working', 'in progress']):
            status = 'progress'
        
        return jsonify({
            'priority': priority,
            'status': status,
            'confidence': 0.85  # Mock confidence score
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'healthy', 'service': 'TaskPilot AI Service'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)