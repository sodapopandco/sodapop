document.querySelectorAll(".email-button").forEach(function (button) {
  button.addEventListener("click", function (event) {
    event.preventDefault();

    fetch("/.netlify/functions/email")
      .then((response) => response.text())
      .then((mailtoLink) => {
        window.location.href = mailtoLink;
      });
  });
});

document.querySelectorAll(".sms-button").forEach(function (button) {
  button.addEventListener("click", function (event) {
    event.preventDefault();

    fetch("/.netlify/functions/sms")
      .then((response) => response.text())
      .then((smsLink) => {
        window.location.href = smsLink;
      });
  });
});
