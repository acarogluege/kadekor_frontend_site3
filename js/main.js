document.addEventListener('DOMContentLoaded', function() {
    initDealerForms();
    initProductSlider();
    
    initNavbarScroll();
    
    initForgotPasswordForm();
});


function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    let lastScrollTop = 0;
    
    navbar.classList.remove('fixed-top');
    navbar.classList.add('navbar-scroll');
    
    window.addEventListener('scroll', function() {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        

        if (scrollTop > lastScrollTop) {
            navbar.classList.add('navbar-hidden');
        } else {
            navbar.classList.remove('navbar-hidden');
        }
        
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    });
}


function initDealerForms() {
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
    
    const signupForm = document.getElementById('dealerSignupForm');
    if (signupForm) {
        const passwordField = document.getElementById('signupPassword');
        const confirmField = document.getElementById('signupPasswordConfirm');
        
        confirmField.addEventListener('input', function() {
            if (passwordField.value !== this.value) {
                this.setCustomValidity('Passwords do not match');
            } else {
                this.setCustomValidity('');
            }
        });
        
        passwordField.addEventListener('input', function() {
            if (confirmField.value && confirmField.value !== this.value) {
                confirmField.setCustomValidity('Passwords do not match');
            } else {
                confirmField.setCustomValidity('');
            }
        });

        signupForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
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
            
            //API call here
            showNotification('Registration successful! We will review your application and contact you soon.', 'success');
            
            const modal = bootstrap.Modal.getInstance(document.getElementById('dealerSignupModal'));
            modal.hide();
            this.reset();
            this.classList.remove('was-validated');
        });
    }
    
    const loginForm = document.getElementById('dealerLoginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const loginData = {
                identifier: document.getElementById('loginIdentifier').value,
                password: document.getElementById('loginPassword').value,
                remember: document.getElementById('rememberMe').checked
            };
            
            showNotification('Login successful!', 'success');
            
            const modal = bootstrap.Modal.getInstance(document.getElementById('dealerLoginModal'));
            modal.hide();
            this.reset();
            
        });
    }
}


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
            
            const email = document.getElementById('resetEmail').value;
            
            //API call here
            console.log('Password reset requested for email:', email);
            
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
            
            const modal = bootstrap.Modal.getInstance(document.getElementById('forgotPasswordModal'));
            if (modal) {
                modal.hide();
            }
            
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
    
    const notification = document.createElement('div');
    notification.className = `toast align-items-center border-0 bg-${type}`;
    notification.setAttribute('role', 'alert');
    notification.setAttribute('aria-live', 'assertive');
    notification.setAttribute('aria-atomic', 'true');
    
    notification.innerHTML = `
        <div class="d-flex">
            <div class="toast-body text-white">
                ${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
    `;
    
    container.appendChild(notification);
    
    const toast = new bootstrap.Toast(notification, {
        autohide: true,
        delay: 5000
    });
    
    toast.show();
    
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


function initProductSlider() {
    if (document.querySelector('.productSwiper')) {
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