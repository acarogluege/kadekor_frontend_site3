// Main JavaScript file for KadeKor website

document.addEventListener('DOMContentLoaded', function() {
    // Initialize existing functions
    initDealerForms();
    initProductSlider();
    
    // Add navbar hide/show on scroll functionality
    initNavbarScroll();
    
    // Initialize forgot password form functionality
    initForgotPasswordForm();
});

/**
 * Hide navbar when scrolling down, show when scrolling up
 */
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    let lastScrollTop = 0;
    
    // Add necessary classes and remove fixed-top if present
    navbar.classList.remove('fixed-top');
    navbar.classList.add('navbar-scroll');
    
    window.addEventListener('scroll', function() {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Check scroll direction
        if (scrollTop > lastScrollTop) {
            // Scrolling down - hide navbar
            navbar.classList.add('navbar-hidden');
        } else {
            // Scrolling up - show navbar
            navbar.classList.remove('navbar-hidden');
        }
        
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // For mobile or negative scrolling
    });
}

/**
 * Initialize dealer login and registration form functionality
 */
function initDealerForms() {
    // Handle password visibility toggle
    document.querySelectorAll('.toggle-password').forEach(button => {
        button.addEventListener('click', function() {
            const input = this.previousElementSibling;
            const icon = this.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.replace('fa-eye', 'fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.replace('fa-eye-slash', 'fa-eye');
            }
        });
    });
    
    // Validate signup form submission
    const signupForm = document.getElementById('dealerSignupForm');
    if (signupForm) {
        // Add event listener for password confirmation field
        const passwordField = document.getElementById('signupPassword');
        const confirmField = document.getElementById('signupPasswordConfirm');
        
        // Real-time password confirmation validation
        confirmField.addEventListener('input', function() {
            if (passwordField.value !== this.value) {
                this.setCustomValidity('Passwords do not match');
            } else {
                this.setCustomValidity('');
            }
        });
        
        // Also check when password field changes
        passwordField.addEventListener('input', function() {
            if (confirmField.value && confirmField.value !== this.value) {
                confirmField.setCustomValidity('Passwords do not match');
            } else {
                confirmField.setCustomValidity('');
            }
        });

        signupForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Check if passwords match before form validation
            const password = passwordField.value;
            const confirmPassword = confirmField.value;
            
            if (password !== confirmPassword) {
                confirmField.setCustomValidity('Passwords do not match');
            } else {
                confirmField.setCustomValidity('');
            }
            
            if (!this.checkValidity()) {
                event.stopPropagation();
                this.classList.add('was-validated');
                return;
            }
            
            // Form data collection
            const formData = {
                firstName: document.getElementById('signupFirstName').value,
                lastName: document.getElementById('signupLastName').value,
                email: document.getElementById('signupEmail').value,
                phone: document.getElementById('signupPhone').value,
                company: document.getElementById('signupCompany').value,
                taxId: document.getElementById('signupTaxId').value,
                taxOffice: document.getElementById('signupTaxOffice').value,
                password: password
            };
            
            // In a real application, you would send this data to your server
            console.log('Registration data:', formData);
            
            // For demonstration, show success message
            showNotification('Registration successful! We will review your application and contact you soon.', 'success');
            
            // Close the modal and reset form
            const modal = bootstrap.Modal.getInstance(document.getElementById('dealerSignupModal'));
            modal.hide();
            this.reset();
            this.classList.remove('was-validated');
        });
    }
    
    // Handle login form submission
    const loginForm = document.getElementById('dealerLoginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Collect login data
            const loginData = {
                identifier: document.getElementById('loginIdentifier').value,
                password: document.getElementById('loginPassword').value,
                remember: document.getElementById('rememberMe').checked
            };
            
            // For demonstration, show success message
            showNotification('Login successful!', 'success');
            
            // Close the modal and reset form
            const modal = bootstrap.Modal.getInstance(document.getElementById('dealerLoginModal'));
            modal.hide();
            this.reset();
            
        });
    }
}

/**
 * Handle the forgot password form submission
 */
function initForgotPasswordForm() {
    const forgotPasswordForm = document.getElementById('forgotPasswordForm');
    
    if (forgotPasswordForm) {
        forgotPasswordForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            if (!forgotPasswordForm.checkValidity()) {
                event.stopPropagation();
                forgotPasswordForm.classList.add('was-validated');
                return;
            }
            
            // Get the email
            const email = document.getElementById('resetEmail').value;
            
            //API call here
            console.log('Password reset requested for email:', email);
            
            // Show success message - using alert if SweetAlert is not available
            if (typeof Swal !== 'undefined') {
                Swal.fire({
                    title: 'Password Reset Email Sent',
                    text: 'Check your email for instructions to reset your password.',
                    icon: 'success',
                    confirmButtonColor: '#259229'
                });
            } else {
                alert('Password reset link sent to your email. Please check your inbox.');
            }
            
            // Close the modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('forgotPasswordModal'));
            if (modal) {
                modal.hide();
            }
            
            // Reset the form
            forgotPasswordForm.classList.remove('was-validated');
            forgotPasswordForm.reset();
        });
    }
}

/**
 * Display a notification to the user
 * @param {string} message - The message to display
 * @param {string} type - The type of notification (success, error, warning, info)
 */
function showNotification(message, type = 'info') {
    // Check if notification container exists, if not create it
    let container = document.getElementById('notification-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'notification-container';
        container.style.position = 'fixed';
        container.style.top = '20px';
        container.style.right = '20px';
        container.style.zIndex = '1060';
        document.body.appendChild(container);
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `toast align-items-center border-0 bg-${type}`;
    notification.setAttribute('role', 'alert');
    notification.setAttribute('aria-live', 'assertive');
    notification.setAttribute('aria-atomic', 'true');
    
    // Create notification content
    notification.innerHTML = `
        <div class="d-flex">
            <div class="toast-body text-white">
                ${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
    `;
    
    // Add to container
    container.appendChild(notification);
    
    // Initialize toast
    const toast = new bootstrap.Toast(notification, {
        autohide: true,
        delay: 5000
    });
    
    // Show notification
    toast.show();
    
    // Remove from DOM after hidden
    notification.addEventListener('hidden.bs.toast', function() {
        notification.remove();
    });
}

/**
 * Sends registration data to the server
 * In a real application, this would make an API call
 * @param {Object} formData - The registration form data
 */
function sendRegistrationData(formData) {
    
    console.log('Registration data:', formData);
    
    return { success: true };
}

/**
 * Authenticates a user with the server
 * In a real application, this would make an API call
 * @param {Object} loginData - The login form data
 */
function authenticateUser(loginData) {
    
    console.log('Login data:', loginData);

    return { success: true };
}

// Product sorting functionality
const sortSelect = document.getElementById('productSortSelect');
if (sortSelect) {
    sortSelect.addEventListener('change', function() {
        const sortValue = this.value;
        const productGrids = document.querySelectorAll('.product-grid');
        
        productGrids.forEach(grid => {
            const products = Array.from(grid.querySelectorAll('.col-md-6, .col-lg-4, .col-sm-6'));
            
            
            products.sort((a, b) => {
                
            });
            
            
            products.forEach(product => {
                grid.appendChild(product);
            });
        });
    });
}

/**
 * Initialize the product slider functionality
 */
function initProductSlider() {
    // Check if the product slider exists
    if (document.querySelector('.productSwiper')) {
        // Initialize the Swiper slider
        const productSwiper = new Swiper(".productSwiper", {
            effect: "fade",
            loop: true,
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
            },
            pagination: {
                el: ".swiper-pagination",
                clickable: true,
                direction: 'vertical',
                renderBullet: function (index, className) {
                    // Define icons and names for slides
                    const slideIcons = [
                        { icon: 'fa-home', name: 'Interior Films' },
                        { icon: 'fa-paint-roller', name: 'Exterior Films' },
                        { icon: 'fa-building', name: 'Doors By AdoKapı' },
                        { icon: 'fa-layer-group', name: 'Vinylbond' }
                    ];
                    
                    if (slideIcons[index]) {
                        return `<span class="${className}">
                                  <div class="bubble-icon">
                                    <i class="fas ${slideIcons[index].icon}"></i>
                                    <span class="bubble-label">${slideIcons[index].name}</span>
                                  </div>
                                </span>`;
                    }
                    return "";
                }
            },
        });
    }
}