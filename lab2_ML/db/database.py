import sqlite3


def get_connection():
    try:
        conn = sqlite3.connect('db/lab2.db')
        print("Database connection established.")
        return conn
    except sqlite3.Error as e:
        print(f"Error connecting to the database: {e}")
        raise
