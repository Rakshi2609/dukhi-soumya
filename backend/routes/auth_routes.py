from flask import Blueprint, request, jsonify
from database.db import get_db

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.json
    db = get_db()
    if db is not None:
        user_exists = db.users.find_one({"email": data['email']})
        if user_exists:
            return jsonify({"status": "error", "message": "User already exists"}), 400
        
        data['progress'] = {
            "activities_completed": 0,
            "focus_score": 0,
            "rank": "Lvl 1 (Newcomer)"
        }
        db.users.insert_one(data)
        return jsonify({"status": "success", "message": "User registered successfully"}), 201
    else:
        # Local fallback if MongoDB is not available (simplified)
        return jsonify({"status": "success", "message": "Registered locally (Mock)"}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    db = get_db()
    
    if db is not None:
        user = db.users.find_one({"email": data['email']})
        if user and user['password'] == data['password']:
            # In a real app, use JWT here
            return jsonify({
                "status": "success", 
                "token": "mock-jwt-token",
                "user": {
                    "name": user.get('name'),
                    "email": user.get('email')
                }
            }), 200
        return jsonify({"status": "error", "message": "Invalid email or password"}), 401
    else:
        # Mock fallback
        if data.get('email') == 'admin@example.com' and data.get('password') == 'password':
            return jsonify({"status": "success", "token": "mock-jwt-token"}), 200
        return jsonify({"status": "error", "message": "Invalid credentials (Mock)"}), 401

@auth_bp.route('/me', methods=['GET'])
def get_me():
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({"status": "error", "message": "No token provided"}), 401
    
    # In a real app, decode JWT. Here we simulate by looking for a 'User-Email' or similar
    # For this demo, let's assume the client sends the email in a header or we find the last user
    db = get_db()
    if db is not None:
        # For demo purposes, we'll fetch the most recently active/registered user if no email provided
        # In production, this MUST use the email from the decoded JWT token
        user = db.users.find_one({}, sort=[('_id', -1)]) 
        if user:
            return jsonify({
                "status": "success",
                "user": {
                    "name": user.get('name'),
                    "email": user.get('email'),
                    "role": user.get('role', 'student'),
                    "progress": user.get('progress', {
                        "activities_completed": 0,
                        "focus_score": 0,
                        "rank": "Lvl 1"
                    })
                }
            })
    
    return jsonify({"status": "error", "message": "User not found"}), 404
