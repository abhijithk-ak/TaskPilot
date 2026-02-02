import requests
import json

# Test AI Service
def test_ai_service():
    url = "http://localhost:8000"
    
    # Test health endpoint
    try:
        response = requests.get(f"{url}/health")
        print(f"✅ AI Health: {response.json()}")
    except Exception as e:
        print(f"❌ AI Health failed: {e}")
    
    # Test predict endpoint
    try:
        response = requests.post(f"{url}/predict", json={
            "description": "Finish this urgently"
        })
        print(f"✅ AI Predict: {response.json()}")
    except Exception as e:
        print(f"❌ AI Predict failed: {e}")

# Test Backend Service  
def test_backend():
    url = "http://localhost:5000"
    
    # Test health endpoint
    try:
        response = requests.get(f"{url}/health")
        print(f"✅ Backend Health: {response.json()}")
    except Exception as e:
        print(f"❌ Backend Health failed: {e}")
    
    # Test task classification
    try:
        response = requests.post(f"{url}/tasks/classify", json={
            "description": "Complete this project immediately"
        })
        print(f"✅ Task Classify: {response.json()}")
    except Exception as e:
        print(f"❌ Task Classify failed: {e}")

if __name__ == "__main__":
    print("🧪 Testing TaskPilot Services...\n")
    
    print("Testing AI Service:")
    test_ai_service()
    
    print("\nTesting Backend:")
    test_backend()
    
    print("\n✅ Tests completed!")