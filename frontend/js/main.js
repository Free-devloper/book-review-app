$(document).ready(function() {
  const API_URL = '/api/books';
  let token = localStorage.getItem('token');

  // Fetch and display books
  function loadBooks() {
    $.get(API_URL, function(data) {
      $('#book-list').empty();
      data.forEach(function(book) {
        let imagesHtml = '';
        if (book.images && book.images.length > 0) {
          book.images.forEach(image => {
            imagesHtml += `<img src="/uploads/${image}" class="img-thumbnail" style="max-width: 150px; margin-right: 10px;">`;
          });
        }
        let deleteButton = '';
        if (token) {
          deleteButton = `<button class="btn btn-danger delete-book" data-id="${book._id}">Delete</button>`;
        }
        $('#book-list').append(`
          <div class="card mb-3">
            <div class="card-body">
              <h5 class="card-title">${book.title}</h5>
              <h6 class="card-subtitle mb-2 text-muted">${book.author}</h6>
              <p class="card-text">${book.review}</p>
              <p class="card-text">Rating: ${book.rating}</p>
              <div>${imagesHtml}</div>
              ${deleteButton}
            </div>
          </div>
        `);
      });
    }).fail(function() {
      $('#book-list').append('<p class="text-danger">An error occurred while fetching books.</p>');
    });
  }

  function refreshToken() {
    return $.ajax({
      url: '/api/users/token',
      type: 'POST',
      xhrFields: {
        withCredentials: true
      }
    }).then(response => {
      localStorage.setItem('token', response.accessToken);
      token = response.accessToken;
    }).fail(() => {
      alert('Session expired. Please log in again.');
      localStorage.removeItem('token');
      window.location.href = 'login.html';
    });
  }

  // Add a new book
  $('#book-form').submit(function(event) {
    event.preventDefault();

    const formData = new FormData();
    formData.append('title', $('#title').val());
    formData.append('author', $('#author').val());
    formData.append('review', $('#review').val());
    formData.append('rating', $('#rating').val());

    const files = $('#images')[0].files;
    for (let i = 0; i < files.length; i++) {
      formData.append('images', files[i]);
    }

    $.ajax({
      url: API_URL,
      type: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      data: formData,
      processData: false,
      contentType: false
    }).done(() => {
      loadBooks();
      $('#book-form')[0].reset();
      $('#error-messages').empty(); // Clear any previous error messages
    }).fail(async (response) => {
      if (response.status === 401) {
        await refreshToken();
        $('#book-form').submit(); // Retry the request
      } else {
        $('#error-messages').empty(); // Clear any previous error messages
        if (response.responseJSON && response.responseJSON.errors) {
          response.responseJSON.errors.forEach(function(error) {
            $('#error-messages').append(`<p class="text-danger">${error}</p>`);
          });
        } else {
          $('#error-messages').append('<p class="text-danger">An error occurred while adding the book.</p>');
        }
      }
    });
  });

  // Delete a book
  $(document).on('click', '.delete-book', function() {
    const bookId = $(this).data('id');

    $.ajax({
      url: `${API_URL}/${bookId}`,
      type: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    }).done(() => {
      loadBooks();
    }).fail(async (response) => {
      if (response.status === 401) {
        await refreshToken();
        $(`.delete-book[data-id=${bookId}]`).click(); // Retry the request
      } else {
        alert('An error occurred while deleting the book.');
      }
    });
  });

  // Initial load
  if ($('#book-list').length) {
    loadBooks();
  }
});
