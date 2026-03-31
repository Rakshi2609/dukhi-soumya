from flask import Blueprint, request, jsonify
from database.db import get_db, save_record, get_records
import hashlib
import uuid

auth_bp = Blueprint('auth', __name__)

def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

def generate_token(email):
    return hashlib.sha256(f"{email}-{uuid.uuid4()}".encode()).hexdigest()

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.json
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({"status": "error", "message": "Email and password are required"}), 400

    db = get_db()
    token = generate_token(data['email'])

    if db is not None:
        user_exists = db.users.find_one({"email": data['email']})
        if user_exists:
            return jsonify({"status": "error", "message": "User already exists"}), 400

        user_doc = {
            "name": data.get('name', 'Explorer'),
            "email": data['email'],
            "password": hash_password(data['password']),
            "role": data.get('role', 'student'),
            "token": token,
            "progress": {
                "activities_completed": 0,
                "focus_score": 0,
                "rank": "Lvl 1 (Newcomer)"
            }
        }
        db.users.insert_one(user_doc)
        user_doc.pop('_id', None)
        user_doc.pop('password', None)
        return jsonify({
            "status": "success",
            "message": "User registered successfully",
            "token": token,
            "user": {
                "name": user_doc['name'],
                "email": user_doc['email'],
                "role": user_doc['role'],
                "progress": user_doc['progress']
            }
        }), 201
    else:
        # Local fallback — store in local JSON and return token
        user_record = {
            "name": data.get('name', 'Explorer'),
            "email": data['email'],
            "password": hash_password(data['password']),
            "role": data.get('role', 'student'),
            "token": token,
            "progress": {
                "activities_completed": 0,
                "focus_score": 0,
                "rank": "Lvl 1 (Newcomer)"
            }
        }
        save_record('users', user_record)
        return jsonify({
            "status": "success",
            "message": "Registered successfully",
            "token": token,
            "user": {
                "name": user_record['name'],
                "email": user_record['email'],
                "role": user_record['role'],
                "progress": user_record['progress']
            }
        }), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({"status": "error", "message": "Email and password are required"}), 400

    db = get_db()
    hashed = hash_password(data['password'])

    if db is not None:
        user = db.users.find_one({"email": data['email']})
        if user and user.get('password') == hashed:
            token = generate_token(data['email'])
            db.users.update_one({"email": data['email']}, {"$set": {"token": token}})
            return jsonify({
                "status": "success",
                "token": token,
                "user": {
                    "name": user.get('name'),
                    "email": user.get('email'),
                    "role": user.get('role', 'student'),
                    "progress": user.get('progress', {})
                }
            }), 200
        return jsonify({"status": "error", "message": "Invalid email or password"}), 401
    else:
        # Local fallback — check local JSON store
        users = get_records('users')
        for user in users:
            if user.get('email') == data['email'] and user.get('password') == hashed:
                token = generate_token(data['email'])
                return jsonify({
                    "status": "success",
                    "token": token,
                    "user": {
                        "name": user.get('name'),
                        "email": user.get('email'),
                        "role": user.get('role', 'student'),
                        "progress": user.get('progress', {})
                    }
                }), 200
        return jsonify({"status": "error", "message": "Invalid email or password"}), 401

@auth_bp.route('/me', methods=['GET'])
def get_me():
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({"status": "error", "message": "No token provided"}), 401

    # Strip "Bearer " prefix
    if token.startswith('Bearer '):
        token = token[7:]

    db = get_db()
    if db is not None:
        user = db.users.find_one({"token": token})
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
    else:
        # Local fallback
        users = get_records('users')
        for user in users:
            if user.get('token') == token:
                return jsonify({
                    "status": "success",
                    "user": {
                        "name": user.get('name'),
                        "email": user.get('email'),
                        "role": user.get('role', 'student'),
                        "progress": user.get('progress', {})
                    }
                })

    return jsonify({"status": "error", "message": "User not found or invalid token"}), 401
