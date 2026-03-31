from flask import Blueprint, request, jsonify

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    if data and data.get('username') == 'admin' and data.get('password') == 'password':
        return jsonify({"status": "success", "token": "mock-jwt-token"})
    return jsonify({"status": "error", "message": "Invalid credentials"}), 401
