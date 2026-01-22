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
  if (!user || user.role !== 'hod') {
    window.location.href = 'login.html';
    return;
  }

  function computeDays(startDate, endDate) {
    if (!startDate || !endDate) return '';
    var start = new Date(startDate);
    var end = new Date(endDate);
    if (isNaN(start.getTime()) || isNaN(end.getTime()) || end < start) return '';
    return String(Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1);
  }

  function attachActions() {
    Array.prototype.forEach.call(document.querySelectorAll('.approve-btn'), function (btn) {
      btn.addEventListener('click', function (e) {
        var id = e.target.getAttribute('data-id');
        if (id) updateStatus('approve', id);
      });
    });
    Array.prototype.forEach.call(document.querySelectorAll('.reject-btn'), function (btn) {
      btn.addEventListener('click', function (e) {
        var id = e.target.getAttribute('data-id');
        if (id) updateStatus('reject', id);
      });
    });
  }

  function updateStatus(action, id) {
    var token = localStorage.getItem('authToken');
    var endpoint = action === 'approve' ? '/leaves/approve/' + id : '/leaves/reject/' + id;
    fetch(endpoint, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? ('Bearer ' + token) : ''
      }
    })
      .then(function (res) { return res.json(); })
      .then(function () { loadRequests(); })
      .catch(function () {});
  }

  function loadRequests() {
    var token = localStorage.getItem('authToken');
    fetch('/leaves/all', {
      method: 'GET',
      headers: {
        'Authorization': token ? ('Bearer ' + token) : ''
      }
    })
      .then(function (res) { return res.json(); })
      .then(function (data) {
        var tbody = document.getElementById('hodRequestBody');
        if (!tbody) return;
        tbody.innerHTML = '';
        var list = (data && data.data) || [];
        list.forEach(function (req) {
          var tr = document.createElement('tr');
          var days = computeDays(req.startDate, req.endDate);
          tr.innerHTML =
            '<td>' + (req.studentId || '') + '</td>' +
            '<td>' + ((req.student && req.student.name) || '') + '</td>' +
            '<td>' + (req.leaveType || '') + '</td>' +
            '<td>' + (req.startDate || '') + '</td>' +
            '<td>' + (req.endDate || '') + '</td>' +
            '<td>' + (days || '') + '</td>' +
            '<td>' + (req.reason || '') + '</td>' +
            '<td>' + (req.status || 'pending') + '</td>' +
            '<td>' + (req.status === 'pending'
              ? '<button class="approve-btn" data-id="' + req.id + '">Approve</button>' +
                '<button class="reject-btn" data-id="' + req.id + '">Reject</button>'
              : '') + '</td>';
          tbody.appendChild(tr);
        });
        attachActions();
      })
      .catch(function () {});
  }

  loadRequests();
});
