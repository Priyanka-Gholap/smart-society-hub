from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
import joblib
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

# Initialize models (in production, these would be trained separately)
complaint_categories = [
    'electrical', 'plumbing', 'security', 'maintenance',
    'flooding', 'fire', 'gas_leak', 'other'
]

priority_levels = ['low', 'medium', 'high', 'critical']

# Load or create vectorizer and models
vectorizer = TfidfVectorizer(max_features=100)
category_model = MultinomialNB()
priority_model = MultinomialNB()

# Training data samples
training_texts = [
    "electrical wire fire danger",
    "water leak plumbing burst",
    "theft robbery security breach",
    "broken wall repair maintenance",
    "flood water overflow drainage",
    "fire alarm smoke emergency",
    "gas smell leak danger",
    "noise disturbance complaint"
]

training_categories = [0, 1, 2, 3, 4, 5, 6, 7]  # Indices of categories

try:
    # Initialize models with training data
    X = vectorizer.fit_transform(training_texts)
    category_model.fit(X, training_categories)
except Exception as e:
    print(f"Warning: Could not train models: {e}")

@app.route('/api/classify-complaint', methods=['POST'])
def classify_complaint():
    """Classify complaint into a category"""
    try:
        data = request.json
        text = data.get('text', '')

        if not text:
            return jsonify({
                'success': False,
                'message': 'Text is required'
            }), 400

        # Transform text and predict
        try:
            X = vectorizer.transform([text])
            prediction = category_model.predict(X)[0]
            confidence = max(category_model.predict_proba(X)[0])
            
            predicted_category = complaint_categories[prediction]
        except:
            # Fallback to keyword matching
            text_lower = text.lower()
            if 'fire' in text_lower or 'smoke' in text_lower:
                predicted_category = 'fire'
                confidence = 0.85
            elif 'water' in text_lower or 'leak' in text_lower:
                predicted_category = 'plumbing'
                confidence = 0.8
            elif 'security' in text_lower or 'theft' in text_lower:
                predicted_category = 'security'
                confidence = 0.82
            elif 'gas' in text_lower:
                predicted_category = 'gas_leak'
                confidence = 0.88
            elif 'flood' in text_lower:
                predicted_category = 'flooding'
                confidence = 0.87
            else:
                predicted_category = 'maintenance'
                confidence = 0.6

        return jsonify({
            'success': True,
            'predictedCategory': predicted_category,
            'confidence': float(confidence),
            'timestamp': datetime.now().isoformat()
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

@app.route('/api/predict-priority', methods=['POST'])
def predict_priority():
    """Predict priority level of complaint"""
    try:
        data = request.json
        text = data.get('text', '')
        category = data.get('category', '')

        if not text or not category:
            return jsonify({
                'success': False,
                'message': 'Text and category are required'
            }), 400

        # Priority rules based on category
        priority_rules = {
            'fire': 'critical',
            'gas_leak': 'critical',
            'flooding': 'high',
            'security': 'high',
            'electrical': 'high',
            'plumbing': 'medium',
            'maintenance': 'low',
            'other': 'medium'
        }

        # Check for urgency keywords
        urgent_keywords = ['urgent', 'emergency', 'danger', 'critical', 'severe', 'immediate']
        text_lower = text.lower()
        
        base_priority = priority_rules.get(category, 'medium')
        
        if any(keyword in text_lower for keyword in urgent_keywords):
            if base_priority == 'low':
                predicted_level = 'medium'
            elif base_priority == 'medium':
                predicted_level = 'high'
            else:
                predicted_level = 'critical'
        else:
            predicted_level = base_priority

        confidence = 0.85 if any(keyword in text_lower for keyword in urgent_keywords) else 0.75

        return jsonify({
            'success': True,
            'predictedLevel': predicted_level,
            'confidence': confidence,
            'timestamp': datetime.now().isoformat()
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

@app.route('/api/calculate-risk', methods=['POST'])
def calculate_risk():
    """Calculate emergency risk score"""
    try:
        data = request.json
        sos_type = data.get('type', '')
        severity = data.get('severity', 'moderate')

        risk_scores = {
            'medical': {'minor': 3, 'moderate': 7, 'severe': 10},
            'fire': {'minor': 6, 'moderate': 9, 'severe': 10},
            'security': {'minor': 4, 'moderate': 7, 'severe': 9},
            'rescue': {'minor': 5, 'moderate': 8, 'severe': 10},
            'flood': {'minor': 5, 'moderate': 8, 'severe': 10},
            'gas_leak': {'minor': 7, 'moderate': 9, 'severe': 10},
            'other': {'minor': 3, 'moderate': 5, 'severe': 8}
        }

        base_risk = risk_scores.get(sos_type, risk_scores['other']).get(severity, 5)
        
        # Risk level determination
        if base_risk >= 8:
            risk_level = 'critical'
        elif base_risk >= 6:
            risk_level = 'warning'
        elif base_risk >= 4:
            risk_level = 'watch'
        else:
            risk_level = 'safe'

        return jsonify({
            'success': True,
            'riskScore': base_risk,
            'riskLevel': risk_level,
            'timestamp': datetime.now().isoformat()
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

@app.route('/api/chatbot', methods=['POST'])
def chatbot():
    """AI Smart Assistant"""
    try:
        data = request.json
        query = data.get('query', '').lower()

        responses = {
            'evacuation': 'Follow the assembly points marked on the map. Do not use elevators. Use stairs and move to the nearest safe zone.',
            'emergency': 'Call 911 immediately. Use the SOS button in the app. Alert neighbors.',
            'shelter': 'Shelters are located at: Main Hall (Ground Floor), Parking Area B (Level 2). Check the map for locations.',
            'volunteer': 'You can register as a volunteer in the Disaster menu. Select your specialization and availability.',
            'resources': 'Resources are managed by the society admin. Check the Resources section for availability.',
            'flood': 'Move to higher floors. Do not go out. Wait for the all-clear signal from administration.',
            'fire': 'Evacuate immediately using the nearest exit. Do not use elevators. Report to assembly points.',
            'medical': 'Use the SOS button for medical emergencies. Volunteers with medical training will be notified.',
        }

        matched_response = 'I can help you with emergency procedures. Try asking about evacuation, shelters, volunteers, or specific emergencies.'
        
        for key, response in responses.items():
            if key in query:
                matched_response = response
                break

        return jsonify({
            'success': True,
            'response': matched_response,
            'timestamp': datetime.now().isoformat()
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({
        'success': True,
        'message': 'ML Service is running',
        'timestamp': datetime.now().isoformat()
    })

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5001))
    app.run(debug=True, host='0.0.0.0', port=port)
