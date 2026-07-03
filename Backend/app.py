from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3

app = Flask(__name__)
# This allows your React app (running on port 5173) to talk to Flask
CORS(app) 

# Helper function to connect to the database
def get_db_connection():
    conn = sqlite3.connect('lil_amigos.db')
    conn.row_factory = sqlite3.Row
    return conn

# 1. A simple test route to make sure the server is alive
@app.route('/api/status', methods=['GET'])
def status():
    return jsonify({"message": "Flask server is running and ready!"})

# 2. The endpoint your React Login Modal will hit
@app.route('/api/signup', methods=['POST'])
def signup():
    data = request.get_json()
    
    full_name = data.get('fullName')
    email = data.get('email')
    password = data.get('password')
    
    try:
        # Open connection to the database
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Insert the new user into the database
        cursor.execute('''
            INSERT INTO users (full_name, email, password)
            VALUES (?, ?, ?)
        ''', (full_name, email, password))
        
        # Save the changes and close
        conn.commit()
        conn.close()
        
        print(f"Success: Saved {full_name} to the database!")
        
        return jsonify({
            "status": 200,
            "message": "Account created successfully!"
        })
        
    except sqlite3.IntegrityError:
        # The UNIQUE constraint on the email column will trigger this 
        # if the email already exists in the database.
        print(f"Failed: Email {email} already exists.")
        return jsonify({
            "status": 400,
            "message": "Email already exists!"
        }), 400
        
    except Exception as e:
        print(f"Database error: {e}")
        return jsonify({
            "status": 500,
            "message": "Internal server error"
        }), 500
@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Look up the user by email
        cursor.execute('SELECT * FROM users WHERE email = ?', (email,))
        user = cursor.fetchone()
        conn.close()
        
        # Check if user exists
        if user is None:
            return jsonify({
                "status": 401,
                "message": "Email not found. Please sign up!"
            }), 401
            
        # Check if the password matches
        if user['password'] != password:
            return jsonify({
                "status": 401,
                "message": "Incorrect password!"
            }), 401
            
        # If everything matches, login is successful!
        print(f"Success: {user['full_name']} just logged in!")
        return jsonify({
            "status": 200,
            "message": f"Welcome back, {user['full_name']}!",
            "user": {
                "id": user['id'],
                "fullName": user['full_name'],
                "email": user['email']
            }
        })
        
    except Exception as e:
        print(f"Login error: {e}")
        return jsonify({
            "status": 500,
            "message": "Internal server error"
        }), 500
if __name__ == '__main__':
    # Runs the server on port 5001
    app.run(debug=True, port=5001)