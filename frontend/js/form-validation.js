// frontend/js/form-validation.js
$(document).ready(function() {
    $('#book-form input, #book-form textarea').on('input', function() {
      if (this.checkValidity()) {
        $(this).removeClass('is-invalid').addClass('is-valid');
      } else {
        $(this).removeClass('is-valid').addClass('is-invalid');
      }
    });
  });
  