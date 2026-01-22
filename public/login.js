document.addEventListener('DOMContentLoaded', function () {
  var form = document.getElementById('loginForm');
  if (!form) return;
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    var role = document.getElementById('role').value;
    fetch('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: username, password: password, role: role })
    })
      .then(function (res) { return res.json(); })
      .then(function (data) {
        if (data && data.success && data.token) {
          localStorage.setItem('authToken', data.token);
          localStorage.setItem('userRole', role);
          if (data.user) localStorage.setItem('user', JSON.stringify(data.user));
          if (role === 'student') {
            window.location.href = 'student.html';
          } else if (role === 'hod') {
            window.location.href = 'hod.html';
          }
        } else {
          alert((data && data.message) || 'Invalid credentials');
        }
      })
      .catch(function () {
        alert('Network error. Please try again later.');
      });
  });
});
