function createNavbar() {
  return `
    <!-- Navigation -->
    <nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
        <div class="container">
            <a class="navbar-brand" href="index.html">
                <img src="./img/KaDekor_Logo.png" alt="KaDekor Logo" class="logo" height="40">
            </a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse justify-content-end" id="navbarNav">
                <ul class="navbar-nav align-items-center">
                    <li class="nav-item">
                        <a class="nav-link" href="index.html">Home</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="about.html">About Us</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="products.html">Products</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="technical.html">Technical</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="contact.html">Contact</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="news.html">News</a>
                    </li>
                    <li class="nav-item">
                        <div class="btn-group language-switcher mx-2">
                            <button type="button" class="btn btn-outline-primary btn-sm active" data-lang="en">EN</button>
                            <button type="button" class="btn btn-outline-primary btn-sm" data-lang="tr">TR</button>
                        </div>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link btn btn-outline-primary btn-sm px-3" href="#" data-bs-toggle="modal"
                            data-bs-target="#dealerLoginModal">
                            <i class="fas fa-user-lock me-1"></i> Dealer Login
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
  `;
}

// Set active link based on current page
function setActiveNavLink() {
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
  
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === currentPage) {
      link.classList.add('active');
    }
  });
}