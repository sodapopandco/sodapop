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

// Scroll navigation button
(function () {
  var sections = Array.from(document.querySelectorAll(".showcase, footer[role='contentinfo']"));
  var currentIndex = -1;

  // Create button
  var button = document.createElement("button");
  button.className = "scroll-nav-button";
  button.setAttribute("aria-label", "Scroll to next section");
  button.innerHTML =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
    '<line x1="12" y1="5" x2="12" y2="19"></line>' +
    '<polyline points="19 12 12 19 5 12"></polyline>' +
    "</svg>";
  document.body.appendChild(button);

  // Track which section is in view
  var sectionObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          currentIndex = sections.indexOf(entry.target);
        }
      });
      updateButton();
    },
    { threshold: 0.5 }
  );

  sections.forEach(function (section) {
    sectionObserver.observe(section);
  });

  // Show/hide based on scroll position
  var headerVisible = true;
  var footerVisible = false;

  function updateVisibility() {
    button.classList.toggle("visible", !headerVisible && !footerVisible);
  }

  var headerSection = document.querySelector("header[role='banner']");
  var headerObserver = new IntersectionObserver(
    function (entries) {
      headerVisible = entries[0].isIntersecting;
      updateVisibility();
    },
    { threshold: 0.5 }
  );

  var footerSection = document.querySelector("footer[role='contentinfo']");
  var footerObserver = new IntersectionObserver(
    function (entries) {
      footerVisible = entries[0].isIntersecting;
      updateVisibility();
    },
    { threshold: 0.5 }
  );

  headerObserver.observe(headerSection);
  footerObserver.observe(footerSection);

  function updateButton() {
    var atEnd = currentIndex >= sections.length - 1;
    button.classList.toggle("flipped", atEnd);
    button.setAttribute(
      "aria-label",
      atEnd ? "Scroll to top" : "Scroll to next section"
    );
  }

  button.addEventListener("click", function () {
    var atEnd = currentIndex >= sections.length - 1;

    if (atEnd) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      currentIndex = -1;
      updateButton();
    } else {
      var nextIndex = currentIndex + 1;
      sections[nextIndex].scrollIntoView({ behavior: "smooth", block: "center" });
    }
  });
})();

// Contact buttons
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
