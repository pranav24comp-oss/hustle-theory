from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import os
from datetime import datetime

app = Flask(__name__)
CORS(app)

DATABASE = 'hustle_theory.db'

def get_db():
    """Create a database connection"""
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    """Initialize the database with tables"""
    conn = get_db()
    cursor = conn.cursor()
    
    # Users table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            wallet_balance REAL DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # User progress table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS user_progress (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            module_id INTEGER NOT NULL,
            completed BOOLEAN DEFAULT 0,
            score INTEGER DEFAULT 0,
            completed_at TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id),
            UNIQUE(user_id, module_id)
        )
    ''')
    
    # Savings goals table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS savings_goals (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            item_name TEXT NOT NULL,
            target_price REAL NOT NULL,
            allowance REAL NOT NULL,
            allowance_type TEXT NOT NULL,
            time_value INTEGER NOT NULL,
            time_type TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    ''')
    
    # Badges table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS badges (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            badge_name TEXT NOT NULL,
            earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    ''')
    
    # Wallet transactions table (NEW)
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS wallet_transactions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            amount REAL NOT NULL,
            transaction_type TEXT NOT NULL,
            reason TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    ''')
    
    # Savings challenge tasks table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS challenge_tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            challenge_id INTEGER NOT NULL,
            task_type TEXT NOT NULL,
            task_description TEXT NOT NULL,
            reward_amount REAL NOT NULL,
            completed BOOLEAN DEFAULT 0,
            completed_at TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    ''')
    
    # Savings challenges (mini-games)
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS savings_challenges (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            target_amount REAL NOT NULL,
            current_amount REAL DEFAULT 0,
            challenge_name TEXT NOT NULL,
            difficulty TEXT NOT NULL,
            status TEXT DEFAULT 'active',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            completed_at TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    ''')
    
    conn.commit()
    conn.close()

# Initialize database on startup
init_db()

# ========== ROOT & INFO ROUTES ==========

@app.route('/')
def home():
    """API information page"""
    return jsonify({
        'message': 'Hustle Theory API',
        'version': '1.0',
        'status': 'running',
        'database': 'SQLite (hustle_theory.db)',
        'endpoints': {
            'auth': {
                'POST /api/register': 'Register a new user',
                'POST /api/login': 'Login user'
            },
            'progress': {
                'GET /api/progress/<user_id>': 'Get user progress',
                'POST /api/progress': 'Update module progress'
            },
            'savings': {
                'GET /api/savings/<user_id>': 'Get savings goals',
                'POST /api/savings': 'Create savings goal'
            },
            'badges': {
                'GET /api/badges/<user_id>': 'Get user badges',
                'POST /api/badges': 'Award a badge'
            }
        }
    }), 200

@app.route('/api')
def api_info():
    """API documentation"""
    return jsonify({
        'message': 'Hustle Theory API - Financial Literacy for Teens',
        'version': '1.0',
        'documentation': 'See DATABASE_README.md for full API documentation'
    }), 200

# ========== AUTH ROUTES ==========

@app.route('/api/register', methods=['POST'])
def register():
    """Register a new user"""
    data = request.json
    username = data.get('username')
    password = data.get('password')
    
    if not username or not password:
        return jsonify({'error': 'Username and password required'}), 400
    
    conn = get_db()
    cursor = conn.cursor()
    
    try:
        cursor.execute('INSERT INTO users (username, password) VALUES (?, ?)', 
                      (username, password))
        conn.commit()
        user_id = cursor.lastrowid
        conn.close()
        
        return jsonify({
            'message': 'User registered successfully',
            'user_id': user_id,
            'username': username
        }), 201
    except sqlite3.IntegrityError:
        conn.close()
        return jsonify({'error': 'Username already exists'}), 409

@app.route('/api/login', methods=['POST'])
def login():
    """Login user"""
    data = request.json
    username = data.get('username')
    password = data.get('password')
    
    conn = get_db()
    cursor = conn.cursor()
    
    cursor.execute('SELECT id, username FROM users WHERE username = ? AND password = ?', 
                  (username, password))
    user = cursor.fetchone()
    conn.close()
    
    if user:
        return jsonify({
            'message': 'Login successful',
            'user_id': user['id'],
            'username': user['username']
        }), 200
    else:
        return jsonify({'error': 'Invalid credentials'}), 401

# ========== PROGRESS ROUTES ==========

@app.route('/api/progress/<int:user_id>', methods=['GET'])
def get_progress(user_id):
    """Get user's progress across all modules"""
    conn = get_db()
    cursor = conn.cursor()
    
    cursor.execute('''
        SELECT module_id, completed, score, completed_at 
        FROM user_progress 
        WHERE user_id = ?
        ORDER BY module_id
    ''', (user_id,))
    
    progress = []
    for row in cursor.fetchall():
        row_dict = dict(row)
        # Ensure completed is stored as a proper boolean
        row_dict['completed'] = bool(row_dict['completed'])
        progress.append(row_dict)
    conn.close()
    
    return jsonify(progress), 200

@app.route('/api/progress', methods=['POST'])
def update_progress():
    """Update or create user progress for a module"""
    data = request.json
    user_id = data.get('user_id')
    module_id = data.get('module_id')
    # Ensure completed is stored as an integer (1 or 0) for SQLite
    completed = 1 if data.get('completed', False) else 0
    score = data.get('score', 0)
    
    if not user_id or not module_id:
        return jsonify({'error': 'user_id and module_id are required'}), 400
    
    conn = get_db()
    cursor = conn.cursor()
    
    try:
        cursor.execute('''
            INSERT INTO user_progress (user_id, module_id, completed, score, completed_at)
            VALUES (?, ?, ?, ?, ?)
            ON CONFLICT(user_id, module_id) 
            DO UPDATE SET completed = ?, score = ?, completed_at = ?
        ''', (user_id, module_id, completed, score, 
              datetime.now() if completed else None,
              completed, score, datetime.now() if completed else None))
        
        conn.commit()
        conn.close()
        return jsonify({'message': 'Progress updated successfully'}), 200
    except Exception as e:
        conn.close()
        return jsonify({'error': str(e)}), 500

# ========== SAVINGS GOALS ROUTES ==========

@app.route('/api/savings/<int:user_id>', methods=['GET'])
def get_savings_goals(user_id):
    """Get all savings goals for a user"""
    conn = get_db()
    cursor = conn.cursor()
    
    cursor.execute('''
        SELECT * FROM savings_goals 
        WHERE user_id = ?
        ORDER BY created_at DESC
    ''', (user_id,))
    
    goals = [dict(row) for row in cursor.fetchall()]
    conn.close()
    
    return jsonify(goals), 200

@app.route('/api/savings', methods=['POST'])
def create_savings_goal():
    """Create a new savings goal"""
    data = request.json
    
    conn = get_db()
    cursor = conn.cursor()
    
    cursor.execute('''
        INSERT INTO savings_goals 
        (user_id, item_name, target_price, allowance, allowance_type, time_value, time_type)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    ''', (data['user_id'], data['item_name'], data['target_price'], 
          data['allowance'], data['allowance_type'], data['time_value'], data['time_type']))
    
    conn.commit()
    goal_id = cursor.lastrowid
    conn.close()
    
    return jsonify({'message': 'Savings goal created', 'goal_id': goal_id}), 201

# ========== BADGES ROUTES ==========

@app.route('/api/badges/<int:user_id>', methods=['GET'])
def get_badges(user_id):
    """Get all badges earned by a user"""
    conn = get_db()
    cursor = conn.cursor()
    
    cursor.execute('''
        SELECT badge_name, earned_at 
        FROM badges 
        WHERE user_id = ?
        ORDER BY earned_at DESC
    ''', (user_id,))
    
    badges = [dict(row) for row in cursor.fetchall()]
    conn.close()
    
    return jsonify(badges), 200

@app.route('/api/badges', methods=['POST'])
def award_badge():
    """Award a badge to a user"""
    data = request.json
    
    conn = get_db()
    cursor = conn.cursor()
    
    cursor.execute('''
        INSERT INTO badges (user_id, badge_name)
        VALUES (?, ?)
    ''', (data['user_id'], data['badge_name']))
    
    conn.commit()
    conn.close()
    
    return jsonify({'message': 'Badge awarded successfully'}), 201

# ========== E-WALLET ROUTES ==========

@app.route('/api/wallet/<int:user_id>', methods=['GET'])
def get_wallet(user_id):
    """Get user's wallet balance and transactions"""
    conn = get_db()
    cursor = conn.cursor()
    
    # Get wallet balance
    cursor.execute('SELECT wallet_balance FROM users WHERE id = ?', (user_id,))
    user = cursor.fetchone()
    balance = user['wallet_balance'] if user else 0
    
    # Get all transactions
    cursor.execute('''
        SELECT id, amount, transaction_type, reason, created_at 
        FROM wallet_transactions 
        WHERE user_id = ? 
        ORDER BY created_at DESC
    ''', (user_id,))
    
    transactions = [dict(row) for row in cursor.fetchall()]
    conn.close()
    
    return jsonify({'balance': balance, 'transactions': transactions}), 200

@app.route('/api/wallet/add', methods=['POST'])
def add_money():
    """Add money to wallet"""
    data = request.json
    user_id = data.get('user_id')
    amount = float(data.get('amount', 0))
    reason = data.get('reason')
    
    if amount <= 0:
        return jsonify({'error': 'Amount must be greater than 0'}), 400
    
    conn = get_db()
    cursor = conn.cursor()
    
    # Add transaction
    cursor.execute('''
        INSERT INTO wallet_transactions (user_id, amount, transaction_type, reason)
        VALUES (?, ?, ?, ?)
    ''', (user_id, amount, 'added', reason))
    
    # Update balance
    cursor.execute('''
        UPDATE users SET wallet_balance = wallet_balance + ? WHERE id = ?
    ''', (amount, user_id))
    
    conn.commit()
    
    # Get updated balance
    cursor.execute('SELECT wallet_balance FROM users WHERE id = ?', (user_id,))
    new_balance = cursor.fetchone()['wallet_balance']
    
    conn.close()
    
    return jsonify({
        'message': 'Money added successfully!',
        'balance': new_balance,
        'amount': amount
    }), 200

@app.route('/api/wallet/spend', methods=['POST'])
def spend_money():
    """Spend money from wallet"""
    data = request.json
    user_id = data.get('user_id')
    amount = float(data.get('amount', 0))
    reason = data.get('reason')
    
    if amount <= 0:
        return jsonify({'error': 'Amount must be greater than 0'}), 400
    
    conn = get_db()
    cursor = conn.cursor()
    
    # Check balance
    cursor.execute('SELECT wallet_balance FROM users WHERE id = ?', (user_id,))
    user = cursor.fetchone()
    
    if user['wallet_balance'] < amount:
        conn.close()
        return jsonify({'error': 'Insufficient balance'}), 400
    
    # Add transaction
    cursor.execute('''
        INSERT INTO wallet_transactions (user_id, amount, transaction_type, reason)
        VALUES (?, ?, ?, ?)
    ''', (user_id, amount, 'spent', reason))
    
    # Update balance
    cursor.execute('''
        UPDATE users SET wallet_balance = wallet_balance - ? WHERE id = ?
    ''', (amount, user_id))
    
    conn.commit()
    
    # Get updated balance
    cursor.execute('SELECT wallet_balance FROM users WHERE id = ?', (user_id,))
    new_balance = cursor.fetchone()['wallet_balance']
    
    conn.close()
    
    return jsonify({
        'message': 'Money spent successfully!',
        'balance': new_balance,
        'amount': amount
    }), 200

# ========== SAVINGS CHALLENGE MINIGAME ROUTES ==========

@app.route('/api/challenge/create', methods=['POST'])
def create_challenge():
    """Create a new savings challenge"""
    data = request.json
    user_id = data.get('user_id')
    target_amount = float(data.get('target_amount', 100))
    challenge_name = data.get('challenge_name', 'New Challenge')
    difficulty = data.get('difficulty', 'easy')  # easy, medium, hard
    
    conn = get_db()
    cursor = conn.cursor()
    
    cursor.execute('''
        INSERT INTO savings_challenges (user_id, target_amount, challenge_name, difficulty)
        VALUES (?, ?, ?, ?)
    ''', (user_id, target_amount, challenge_name, difficulty))
    
    conn.commit()
    challenge_id = cursor.lastrowid
    
    # Generate tasks based on difficulty
    tasks = generate_challenge_tasks(challenge_id, user_id, difficulty)
    
    conn.close()
    
    return jsonify({
        'message': 'Challenge created successfully',
        'challenge_id': challenge_id,
        'target_amount': target_amount,
        'tasks': tasks
    }), 201

@app.route('/api/challenge/<int:challenge_id>', methods=['GET'])
def get_challenge(challenge_id):
    """Get challenge details and tasks"""
    conn = get_db()
    cursor = conn.cursor()
    
    cursor.execute('''
        SELECT * FROM savings_challenges WHERE id = ?
    ''', (challenge_id,))
    challenge = dict(cursor.fetchone() or {})
    
    cursor.execute('''
        SELECT id, task_type, task_description, reward_amount, completed, completed_at
        FROM challenge_tasks WHERE challenge_id = ?
    ''', (challenge_id,))
    
    tasks = [dict(row) for row in cursor.fetchall()]
    conn.close()
    
    return jsonify({'challenge': challenge, 'tasks': tasks}), 200

@app.route('/api/challenge/complete-task', methods=['POST'])
def complete_task():
    """Mark a challenge task as completed and award money"""
    data = request.json
    task_id = data.get('task_id')
    user_id = data.get('user_id')
    
    conn = get_db()
    cursor = conn.cursor()
    
    cursor.execute('''
        SELECT challenge_id, reward_amount, completed FROM challenge_tasks WHERE id = ?
    ''', (task_id,))
    task = cursor.fetchone()
    
    if not task or task['completed']:
        conn.close()
        return jsonify({'error': 'Task already completed or not found'}), 400
    
    challenge_id = task['challenge_id']
    reward_amount = task['reward_amount']
    
    # Mark task as complete
    cursor.execute('''
        UPDATE challenge_tasks 
        SET completed = 1, completed_at = ? 
        WHERE id = ?
    ''', (datetime.now(), task_id))
    
    # Add money to wallet
    cursor.execute('''
        UPDATE users SET wallet_balance = wallet_balance + ? WHERE id = ?
    ''', (reward_amount, user_id))
    
    # Update challenge progress
    cursor.execute('''
        UPDATE savings_challenges 
        SET current_amount = current_amount + ? 
        WHERE id = ?
    ''', (reward_amount, challenge_id))
    
    # Record transaction
    cursor.execute('''
        INSERT INTO wallet_transactions (user_id, amount, transaction_type, reason)
        VALUES (?, ?, ?, ?)
    ''', (user_id, reward_amount, 'earned', f'Completed savings challenge task: {data.get("task_description", "")}'))
    
    conn.commit()
    
    # Get updated balance and challenge
    cursor.execute('SELECT wallet_balance FROM users WHERE id = ?', (user_id,))
    new_balance = cursor.fetchone()['wallet_balance']
    
    cursor.execute('''
        SELECT current_amount, target_amount, status FROM savings_challenges WHERE id = ?
    ''', (challenge_id,))
    challenge_update = dict(cursor.fetchone())
    
    # Check if challenge completed
    is_completed = challenge_update['current_amount'] >= challenge_update['target_amount']
    if is_completed and challenge_update['status'] == 'active':
        cursor.execute('''
            UPDATE savings_challenges SET status = 'completed', completed_at = ? WHERE id = ?
        ''', (datetime.now(), challenge_id))
        conn.commit()
    
    conn.close()
    
    return jsonify({
        'message': 'Task completed!',
        'reward': reward_amount,
        'wallet_balance': new_balance,
        'challenge_progress': challenge_update['current_amount'],
        'challenge_target': challenge_update['target_amount'],
        'challenge_completed': is_completed
    }), 200

@app.route('/api/challenge/user/<int:user_id>', methods=['GET'])
def get_user_challenges(user_id):
    """Get all challenges for a user"""
    conn = get_db()
    cursor = conn.cursor()
    
    cursor.execute('''
        SELECT id, challenge_name, target_amount, current_amount, difficulty, status, created_at
        FROM savings_challenges 
        WHERE user_id = ? 
        ORDER BY created_at DESC
    ''', (user_id,))
    
    challenges = [dict(row) for row in cursor.fetchall()]
    conn.close()
    
    return jsonify(challenges), 200

def generate_challenge_tasks(challenge_id, user_id, difficulty):
    """Generate tasks based on difficulty level"""
    tasks_config = {
        'easy': [
            {'type': 'chore', 'description': 'Complete morning chores (make bed, brush teeth, etc.)', 'reward': 10},
            {'type': 'learning', 'description': 'Read a financial article for 10 minutes', 'reward': 15},
            {'type': 'exercise', 'description': 'Do 20 minutes of exercise or walk', 'reward': 12},
            {'type': 'cleanup', 'description': 'Clean your room', 'reward': 20},
            {'type': 'help', 'description': 'Help a family member with a task', 'reward': 15},
        ],
        'medium': [
            {'type': 'project', 'description': 'Complete a small side project (design, code, etc.)', 'reward': 30},
            {'type': 'study', 'description': 'Study for 1 hour on a financial topic', 'reward': 35},
            {'type': 'cooking', 'description': 'Prepare a meal for family', 'reward': 25},
            {'type': 'learn_skill', 'description': 'Learn and practice a new financial skill', 'reward': 40},
            {'type': 'community', 'description': 'Volunteer or help in community', 'reward': 30},
        ],
        'hard': [
            {'type': 'entrepreneurship', 'description': 'Start a small business/freelance gig', 'reward': 100},
            {'type': 'advanced_learning', 'description': 'Complete an online financial course module', 'reward': 80},
            {'type': 'research', 'description': 'Research and report on investment opportunities', 'reward': 75},
            {'type': 'mentoring', 'description': 'Mentor someone about financial literacy', 'reward': 60},
            {'type': 'project_launch', 'description': 'Launch a personal project or side hustle', 'reward': 90},
        ]
    }
    
    task_list = tasks_config.get(difficulty, tasks_config['easy'])
    conn = get_db()
    cursor = conn.cursor()
    
    tasks = []
    for task in task_list:
        cursor.execute('''
            INSERT INTO challenge_tasks (user_id, challenge_id, task_type, task_description, reward_amount)
            VALUES (?, ?, ?, ?, ?)
        ''', (user_id, challenge_id, task['type'], task['description'], task['reward']))
        tasks.append({
            'task_type': task['type'],
            'description': task['description'],
            'reward': task['reward']
        })
    
    conn.commit()
    conn.close()
    
    return tasks

if __name__ == '__main__':
    app.run(debug=True, port=5000)
