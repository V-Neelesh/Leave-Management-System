// Simple test script to verify authentication
const fetch = require('node-fetch');

async function testAuthentication() {
  console.log('Testing Leave Management System Authentication...\n');

  // Test 1: Login as HOD
  console.log('1. Testing HOD Login...');
  try {
    const hodResponse = await fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'hod_admin',
        password: 'hod123',
        role: 'hod'
      })
    });

    const hodData = await hodResponse.json();
    console.log('HOD Login Response:', hodData);

    if (hodData.success && hodData.token) {
      console.log('✅ HOD login successful!');
      
      // Test 2: Access protected HOD route with token
      console.log('\n2. Testing protected HOD route...');
      const protectedResponse = await fetch('http://localhost:3000/api/hod/profile', {
        headers: {
          'Authorization': `Bearer ${hodData.token}`
        }
      });
      
      const protectedData = await protectedResponse.json();
      console.log('Protected Route Response:', protectedData);
    } else {
      console.log('❌ HOD login failed!');
    }
  } catch (error) {
    console.error('❌ Error testing HOD login:', error);
  }

  // Test 3: Login as Student
  console.log('\n3. Testing Student Login...');
  try {
    const studentResponse = await fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'student_john',
        password: 'student123',
        role: 'student'
      })
    });

    const studentData = await studentResponse.json();
    console.log('Student Login Response:', studentData);

    if (studentData.success && studentData.token) {
      console.log('✅ Student login successful!');
    } else {
      console.log('❌ Student login failed!');
    }
  } catch (error) {
    console.error('❌ Error testing Student login:', error);
  }

  // Test 4: Invalid credentials
  console.log('\n4. Testing invalid credentials...');
  try {
    const invalidResponse = await fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'invalid_user',
        password: 'wrong_password',
        role: 'student'
      })
    });

    const invalidData = await invalidResponse.json();
    console.log('Invalid Login Response:', invalidData);

    if (!invalidData.success) {
      console.log('✅ Invalid credentials properly rejected!');
    } else {
      console.log('❌ Invalid credentials were accepted!');
    }
  } catch (error) {
    console.error('❌ Error testing invalid credentials:', error);
  }
}

// Run the test
testAuthentication().then(() => {
  console.log('\n🎉 Authentication testing completed!');
}).catch((error) => {
  console.error('❌ Test failed:', error);
});
