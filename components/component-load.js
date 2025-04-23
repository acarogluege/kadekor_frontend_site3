// Load all components
document.addEventListener('DOMContentLoaded', function() {
  // Load navbar
  const navbarContainer = document.getElementById('navbar-container');
  if (navbarContainer) {
    navbarContainer.innerHTML = createNavbar();
    setActiveNavLink();
  }
  
  // Load footer
  const footerContainer = document.getElementById('footer-container');
  if (footerContainer) {
    footerContainer.innerHTML = createFooter();
  }
});