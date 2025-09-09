// Simple test to verify frontend-backend connection
const testConnection = async () => {
  try {
    console.log("🔗 Testing Frontend-Backend Connection...");

    // Test 1: Backend Health Check
    const healthResponse = await fetch("http://localhost:5000");
    const healthData = await healthResponse.json();
    console.log("✅ Backend Health:", healthData);

    // Test 2: Test Registration API
    const registerResponse = await fetch(
      "http://localhost:5000/api/auth/register",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          name: "Test User",
          email: "test@example.com",
          password: "password123",
        }),
      }
    );

    const registerData = await registerResponse.json();
    console.log("📝 Registration Test:", registerData);

    console.log("🎉 Connection test completed!");
  } catch (error) {
    console.error("❌ Connection test failed:", error);
  }
};

// Run the test
testConnection();
