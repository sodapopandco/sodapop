// https://sushkelly.co.uk/blog/2024-01-15-obfuscated-email-on-netlify/

// Fetch the email address on click
document.querySelectorAll('.email-button').forEach(function(button) {
  button.addEventListener('click', function() {
    event.preventDefault();

    fetch('/.netlify/functions/email')
      .then(response => response.text())
      .then(mailtoLink => {
        window.location.href = mailtoLink;
      });
  });
});


// Fetch the phone number on click
document.querySelectorAll('.sms-button').forEach(function(button) {
  button.addEventListener('click', function() {
    event.preventDefault();

    fetch('/.netlify/functions/sms')
      .then(response => response.text())
      .then(mailtoLink => {
        window.location.href = mailtoLink;
      });
  });
});
