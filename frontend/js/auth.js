$(document).ready(function() {
  const API_URL = '/api/users';

  // Handle user registration
  $('#register-form').submit(function(event) {
    event.preventDefault();

    const user = {
      username: $('#username').val(),
      password: $('#password').val(),
    };

    $.ajax({
      url: `${API_URL}/register`,
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(user),
      success: function(response) {
        alert('User registered successfully');
        window.location.href = 'login.html';
      },
      error: function(response) {
        $('#error-messages').empty();
        $('#error-messages').append(`<p class="text-danger">${response.responseJSON.error}</p>`);
      }
    });
  });

  // Handle user login
  $('#login-form').submit(function(event) {
    event.preventDefault();

    const user = {
      username: $('#username').val(),
      password: $('#password').val(),
    };

    $.ajax({
      url: `${API_URL}/login`,
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(user),
      xhrFields: {
        withCredentials: true
      },
      success: function(response) {
        localStorage.setItem('token', response.accessToken);
        window.location.href = 'index.html';
      },
      error: function(response) {
        $('#error-messages').empty();
        $('#error-messages').append(`<p class="text-danger">${response.responseJSON.error}</p>`);
      }
    });
  });
});
