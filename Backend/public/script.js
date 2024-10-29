const navLinks = document.querySelectorAll('nav a');

navLinks.forEach(link => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    const targetId = link.getAttribute('href');
    const targetElement = document.querySelector(targetId);
    const targetPosition = targetElement.offsetTop;

    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth' 
    });
  });
});

// 2. Form validation for the newsletter signup
const newsletterForm = document.querySelector('footer form');

newsletterForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const emailInput = document.querySelector('footer input[type="email"]');
  const emailValue = emailInput.value;

  if (validateEmail(emailValue)) {
    // Submit the form (e.g., send data to server)
    console.log('Email submitted:', emailValue);
  } else {
    // Display an error message
    alert('Please enter a valid email address.');
  }
});

function validateEmail(email) {
  // You can use a regular expression for more robust validation
  return email.includes('@') && email.includes('.');
}