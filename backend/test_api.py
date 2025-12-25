"""
Simple test script to verify the API is working.
Run this after starting the backend server.
"""
import requests
import json

BASE_URL = "http://localhost:8000"

def test_api():
    print("Testing Todo API...")
    
    # Test 1: Check if server is running
    print("\n1. Testing root endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/")
        print(f"   Status: {response.status_code}")
        print(f"   Response: {response.json()}")
    except Exception as e:
        print(f"   ERROR: {e}")
        print("   Make sure the backend server is running!")
        return
    
    # Test 2: Get todos
    print("\n2. Testing GET /api/todos...")
    try:
        response = requests.get(f"{BASE_URL}/api/todos")
        print(f"   Status: {response.status_code}")
        print(f"   Todos: {response.json()}")
    except Exception as e:
        print(f"   ERROR: {e}")
    
    # Test 3: Create a todo
    print("\n3. Testing POST /api/todos...")
    try:
        todo_data = {
            "title": "Test Todo",
            "description": "This is a test"
        }
        response = requests.post(
            f"{BASE_URL}/api/todos",
            json=todo_data,
            headers={"Content-Type": "application/json"}
        )
        print(f"   Status: {response.status_code}")
        if response.status_code == 201:
            print(f"   Created: {response.json()}")
        else:
            print(f"   ERROR: {response.text}")
    except Exception as e:
        print(f"   ERROR: {e}")

if __name__ == "__main__":
    test_api()

