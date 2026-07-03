import sqlite3

def create_tables():
    # This will automatically create a file named 'lil_amigos.db' in your folder
    conn = sqlite3.connect('lil_amigos.db')
    cursor = conn.cursor()

    # Create the users table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            full_name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
        )
    ''')

    conn.commit()
    conn.close()
    print("Database and users table created successfully!")

if __name__ == '__main__':
    create_tables()