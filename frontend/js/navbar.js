$(document).ready(function() {
    const token = localStorage.getItem('token');
    
    if (token) {
      $('#add-book-nav').html('<a class="nav-link" href="add-book.html">Add Book</a>');
      $('#auth-nav').html('<a class="nav-link" id="logout" href="#">Logout</a>');
  
      $('#logout').click(function(event) {
        event.preventDefault();
        localStorage.removeItem('token');
        window.location.href = 'index.html';
      });
    } else {
      $('#auth-nav').html('<a class="nav-link" href="login.html">Login</a><a class="nav-link" href="register.html">Register</a>');
    }
  });
  