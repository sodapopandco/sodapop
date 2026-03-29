// Fan out screenshots when they scroll into view
var observer = new IntersectionObserver(
  function (entries) {
    entries.forEach(function (entry) {
      entry.target.classList.toggle("in-view", entry.isIntersecting);
    });
  },
  { threshold: 0.75 }
);

document.querySelectorAll(".showcase-gallery").forEach(function (gallery) {
  observer.observe(gallery);
});

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
