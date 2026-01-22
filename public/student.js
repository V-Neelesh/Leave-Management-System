document.addEventListener('DOMContentLoaded', function () {
  var logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function () {
      try {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userRole');
        localStorage.removeItem('user');
      } catch (e) {}
      window.location.href = 'login.html';
    });
  }

  var userRaw = localStorage.getItem('user');
  var user = userRaw ? JSON.parse(userRaw) : null;
  if (!user || user.role !== 'student') {
    window.location.href = 'login.html';
    return;
  }

  var startDateInput = document.getElementById('start_date');
  var endDateInput = document.getElementById('end_date');
  var totalDaysInput = document.getElementById('Total_Days');

  // Set min date to today for both date pickers
  var today = new Date();
  var yyyy = today.getFullYear();
  var mm = String(today.getMonth() + 1).padStart(2, '0');
  var dd = String(today.getDate()).padStart(2, '0');
  var todayStr = yyyy + '-' + mm + '-' + dd;
  if (startDateInput) startDateInput.setAttribute('min', todayStr);
  if (endDateInput) endDateInput.setAttribute('min', todayStr);

  function updateTotalDays() {
    if (startDateInput.value && endDateInput.value) {
      var start = new Date(startDateInput.value);
      var end = new Date(endDateInput.value);
      if (!isNaN(start.getTime()) && !isNaN(end.getTime()) && end >= start) {
        var diff = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
        totalDaysInput.value = String(diff);
      } else {
        totalDaysInput.value = '';
      }
    } else {
      totalDaysInput.value = '';
    }
  }

  ['change', 'input'].forEach(function (evt) {
    startDateInput.addEventListener(evt, updateTotalDays);
    endDateInput.addEventListener(evt, updateTotalDays);
  });
  updateTotalDays();

  var form = document.getElementById('leaveForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var token = localStorage.getItem('authToken');
      var leaveType = document.getElementById('leave_type').value;
      var startDate = startDateInput.value;
      var endDate = endDateInput.value;
      var reason = document.getElementById('reason').value;

      fetch('/leaves/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? ('Bearer ' + token) : ''
        },
        body: JSON.stringify({ leaveType: leaveType, startDate: startDate, endDate: endDate, reason: reason })
      })
        .then(function (res) { return res.json(); })
        .then(function (data) {
          if (data && data.success) {
            alert('Leave request submitted successfully!');
            form.reset();
            updateTotalDays();
            loadAppliedRequests();
          } else {
            alert((data && data.message) || 'Submission failed');
          }
        })
        .catch(function () {
          alert('Network error. Please try again later.');
        });
    });
  }

  function loadAppliedRequests() {
    var token = localStorage.getItem('authToken');
    fetch('/leaves/student', {
      method: 'GET',
      headers: {
        'Authorization': token ? ('Bearer ' + token) : ''
      }
    })
      .then(function (res) { return res.json(); })
      .then(function (data) {
        var pendingBody = document.getElementById('pendingBody');
        var reactedBody = document.getElementById('reactedBody');
        var historyBody = document.getElementById('historyBody');
        if (!pendingBody || !reactedBody || !historyBody) return;
        pendingBody.innerHTML = '';
        reactedBody.innerHTML = '';
        historyBody.innerHTML = '';
        var list = (data && data.data) || [];
        list.forEach(function (req) {
          var tr = document.createElement('tr');
          tr.innerHTML = '\n            <td>' + (req.studentId || '') + '</td>\n            <td>' + (req.leaveType || '') + '</td>\n            <td>' + (req.startDate || '') + '</td>\n            <td>' + (req.endDate || '') + '</td>\n            <td>' + (req.status || 'pending') + '</td>\n          ';
          // Pending tab: only pending requests
          if (req.status === 'pending') {
            pendingBody.appendChild(tr.cloneNode(true));
          }
          // Reacted tab: only approved or rejected requests
          if (req.status === 'approved' || req.status === 'rejected') {
            reactedBody.appendChild(tr.cloneNode(true));
          }
          // History tab: all requests
          historyBody.appendChild(tr);
        });
      })
      .catch(function () {
        // ignore for now
      });
  }

  loadAppliedRequests();
});
