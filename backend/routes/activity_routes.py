from flask import Blueprint, request, jsonify
from database.db import save_record, get_records
from datetime import datetime

activity_bp = Blueprint('activity', __name__)

@activity_bp.route('/activities', methods=['GET'])
def get_activities():
    # Return placeholder activities or combine with DB records
    activities = [
        {"id": 1, "title": "Bubble Pop", "description": "Pop colorful bubbles to improve focus and finger dexterity.", "category": "logic"},
        {"id": 2, "title": "Sound Match", "description": "Match rhythmic patterns to soothe the senses.", "category": "auditory"},
        {"id": 3, "title": "Color Sorting", "description": "Organize blocks by hue in a calm, timed session.", "category": "visual"},
        {"id": 4, "title": "Feeling Journal", "description": "Record your daily emotions with tactile emoji interactions.", "category": "emotional"}
    ]
    db_activities = get_records('activities')
    return jsonify({"activities": activities, "saved_results": db_activities})

@activity_bp.route('/save', methods=['POST'])
def save_activity():
    data = request.json
    if not data:
         return jsonify({"status": "error", "message": "No data provided"}), 400
    
    data['timestamp'] = datetime.now().isoformat()
    save_record('activities', data)
    return jsonify({"status": "success"})
