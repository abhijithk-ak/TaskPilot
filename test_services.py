import requests

def test_ai_service():
    """Test AI Service"""
    # Health check
    try:
        response = requests.get("http://localhost:8000/health")
        print(f"✅ AI Health: {response.json()}")
    except Exception as e:
        print(f"❌ AI Health failed: {e}")
        return
    
    # Predict endpoint
    try:
        response = requests.post(
            "http://localhost:8000/predict",
            json={"title": "Complete urgent report", "description": "This needs to be done ASAP"}
        )
        result = response.json()
        print(f"✅ AI Predict: Priority={result.get('priority')}, Confidence={result.get('confidence', 0):.2f}")
    except Exception as e:
        print(f"❌ AI Predict failed: {e}")

def test_backend():
    """Test Backend"""
    # Health check
    try:
        response = requests.get("http://localhost:5000/health")
        print(f"✅ Backend Health: {response.json()}")
    except Exception as e:
        print(f"❌ Backend Health failed: {e}")
        return
    
    # Classify endpoint
    try:
        response = requests.post(
            "http://localhost:5000/classify",
            json={"title": "Review code", "description": "Please review the pull request"}
        )
        result = response.json()
        print(f"✅ Backend Classify: Priority={result.get('priority')}")
    except Exception as e:
        print(f"❌ Backend Classify failed: {e}")

def test_frontend():
    """Test Frontend"""
    try:
        response = requests.get("http://localhost:3000")
        if response.status_code == 200:
            print(f"✅ Frontend running: Status {response.status_code}, Size {len(response.content)} bytes")
        else:
            print(f"⚠️ Frontend status: {response.status_code}")
    except Exception as e:
        print(f"❌ Frontend failed: {e}")

if __name__ == "__main__":
    print("🧪 Testing TaskPilot Services...\n")
    
    print("Testing AI Service:")
    test_ai_service()
    
    print("\nTesting Backend:")
    test_backend()
    
    print("\nTesting Frontend:")
    test_frontend()
    
    print("\n✅ All tests completed!")
