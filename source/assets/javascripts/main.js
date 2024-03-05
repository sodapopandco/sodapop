// https://sushkelly.co.uk/blog/2024-01-15-obfuscated-email-on-netlify/

// Fetch the email address on click
document.getElementById('email-button').addEventListener('click', function() {
  fetch('/.netlify/functions/email')
    .then(response => response.text())
    .then(mailtoLink => {
      window.location.href = mailtoLink;
    });
});

// Fetch the phone number on click
document.getElementById('sms-button').addEventListener('click', function() {
  fetch('/.netlify/functions/phone')
    .then(response => response.text())
    .then(smsLink => {
      window.location.href = smsLink;
    });
});
