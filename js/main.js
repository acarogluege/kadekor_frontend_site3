document.addEventListener('DOMContentLoaded', function() {
    initDealerForms();
    initProductSlider();
    
    initNavbarScroll();
    
    initForgotPasswordForm();

    // Initialize phone input
    const phoneInputField = document.querySelector("#signupPhone");
    if (phoneInputField) {
        phoneInputField.addEventListener('input', function(e) {
            this.value = this.value.replace(/\D/g, '');
            
            if (this.value.length > 10) {
                this.value = this.value.slice(0, 10);
            }
        });
        
        const phoneInput = window.intlTelInput(phoneInputField, {
            preferredCountries: ["tr", "us", "gb", "de"], 
            initialCountry: "tr", 
            separateDialCode: true,
            utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.13/js/utils.js",
            formatOnDisplay: false, 
            nationalMode: true, 
            autoPlaceholder: "off"
        });
        
        window.phoneInput = phoneInput;
        
        const dealerSignupForm = document.getElementById('dealerSignupForm');
        if (dealerSignupForm) {
            dealerSignupForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const digitCount = phoneInputField.value.replace(/\D/g, '').length;
                if (digitCount !== 10) {
                    phoneInputField.classList.add('is-invalid');
                    let feedbackEl = phoneInputField.nextElementSibling;
                    if (!feedbackEl || !feedbackEl.classList.contains('invalid-feedback')) {
                        feedbackEl = document.createElement('div');
                        feedbackEl.className = 'invalid-feedback';
                        phoneInputField.parentNode.appendChild(feedbackEl);
                    }
                    feedbackEl.textContent = 'Please enter exactly 10 digits.';
                    return;
                }
                
                const fullNumber = phoneInput.getNumber();
                
                phoneInputField.classList.remove('is-invalid');
                phoneInputField.classList.add('is-valid');
                
                console.log("Valid phone number:", fullNumber);

            });
        }
    }
    
    const dealerSignupModal = document.getElementById('dealerSignupModal');
    if (dealerSignupModal) {
        dealerSignupModal.addEventListener('shown.bs.modal', function() {
            if (window.phoneInput) {
                window.phoneInput.destroy();
                const phoneInputField = document.querySelector("#signupPhone");
                window.phoneInput = window.intlTelInput(phoneInputField, {
                    preferredCountries: ["tr", "us", "gb", "de"],
                    initialCountry: "tr",
                    separateDialCode: true,
                    utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.13/js/utils.js",
                    formatOnDisplay: true
                });
            }
            setupFormValidation();
        });
        
        dealerSignupModal.addEventListener('show.bs.modal', function() {
            const form = this.querySelector('#dealerSignupForm');
            if (form) {
                form.classList.remove('was-validated');
                
                const inputs = form.querySelectorAll('input, select, textarea');
                inputs.forEach(input => {
                    input.classList.remove('is-invalid', 'is-valid');
                    input.value = '';
                    
                    
                    input.setCustomValidity('');
                });
                
                const formTexts = form.querySelectorAll('.form-text');
                formTexts.forEach(text => {
                    if (text.classList.contains('text-success')) {
                        text.classList.remove('text-success');
                        text.classList.add('text-muted');
                        text.textContent = 'Password must be at least 8 characters long and include uppercase, lowercase, numbers, and special characters.';
                    }
                });
            }
        });
    }

    // Set up validation only on form submission
    const forms = document.querySelectorAll('.needs-validation');
    
    Array.prototype.slice.call(forms).forEach(function(form) {
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('invalid', function(e) {
                e.preventDefault();
            }, true);
            
            input.addEventListener('input', function() {
                if (form.classList.contains('was-validated')) {
                    this.checkValidity();
                }
            });
        });
        
        form.addEventListener('submit', function(event) {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }
            
            form.classList.add('was-validated');
            
            const password = document.getElementById('signupPassword');
            const confirmPassword = document.getElementById('signupPasswordConfirm');
            if (password && confirmPassword) {
                if (password.value !== confirmPassword.value) {
                    confirmPassword.setCustomValidity("Passwords don't match");
                } else {
                    confirmPassword.setCustomValidity('');
                }
            }
        }, false);
        
        const modal = form.closest('.modal');
        if (modal) {
            modal.addEventListener('hidden.bs.modal', function() {
                form.classList.remove('was-validated');
                form.reset();
                
                inputs.forEach(input => {
                    input.classList.remove('is-invalid', 'is-valid');
                    input.setCustomValidity('');
                });
            });
        }
    });
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

/**
 * Sets up form validation for the dealer signup form
 */
function setupFormValidation() {
    const signupForm = document.getElementById('dealerSignupForm');
    if (!signupForm) return;
    
    const formInputs = signupForm.querySelectorAll('input, select, textarea');
    
    formInputs.forEach(input => {
        input.addEventListener('blur', function() {
            this.classList.remove('is-invalid', 'is-valid');
            
            if (!this.validity.valid) {
                this.classList.add('is-invalid');
            } else if (this.value) {
                this.classList.add('is-valid');
            }
        });
        
        input.addEventListener('input', function() {
            if (this.classList.contains('is-invalid') && this.validity.valid) {
                this.classList.remove('is-invalid');
                this.classList.add('is-valid');
            }
        });
    });
    
    // Add password validation checking
    const passwordField = document.getElementById('signupPassword');
    if (passwordField) {
        passwordField.addEventListener('input', function() {
            const password = this.value;
            const regex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$");
            
            const helpText = this.parentNode.parentNode.querySelector('.form-text');
            
            if (regex.test(password)) {
                this.setCustomValidity(''); 
                this.classList.remove('is-invalid');
                this.classList.add('is-valid');
                
                if (helpText) {
                    helpText.textContent = 'Password meets all requirements.';
                    helpText.classList.add('text-success');
                    helpText.classList.remove('text-muted');
                }
            } else {
                if (password.length > 0) {
                    this.setCustomValidity('Password must meet all requirements');
                    this.classList.add('is-invalid');
                    this.classList.remove('is-valid');
                } else {
                    this.setCustomValidity('');
                    this.classList.remove('is-invalid');
                    this.classList.remove('is-valid');
                }
                
                if (helpText) {
                    helpText.textContent = 'Password must be at least 8 characters long and include uppercase, lowercase, numbers, and special characters.';
                    helpText.classList.remove('text-success');
                    helpText.classList.add('text-muted');
                }
            }
        });
        
        passwordField.addEventListener('blur', function() {
            if (this.value.length > 0) {
                const regex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$");
                if (!regex.test(this.value)) {
                    this.classList.add('is-invalid');
                    this.setCustomValidity('Password must meet all requirements');
                }
            }
        });
    }
    
    const password = document.getElementById('signupPassword');
    const confirmPassword = document.getElementById('signupPasswordConfirm');
    
    if (password && confirmPassword) {
        confirmPassword.addEventListener('blur', function() {
            if (this.value && password.value !== this.value) {
                this.classList.add('is-invalid');
                this.classList.remove('is-valid');
            } else if (this.value) {
                this.classList.add('is-valid');
                this.classList.remove('is-invalid');
            }
        });
    }

    // Handle Tax ID / TC Kimlik Number field validation
    const taxIdTypeSelect = document.getElementById('signupTaxIdType');
    const taxIdField = document.getElementById('signupTaxId');
    const taxIdHelpText = document.getElementById('taxIdHelpText');

    if (taxIdTypeSelect && taxIdField) {
        // Set initial state
        taxIdField.setAttribute('disabled', true);
        
        // When user selects ID type
        taxIdTypeSelect.addEventListener('change', function() {
            const selectedType = this.value;
            
            // Enable field and set appropriate validation
            taxIdField.removeAttribute('disabled');
            taxIdField.value = '';
            
            if (selectedType === 'tc') {
                taxIdField.setAttribute('maxlength', '11');
                taxIdField.setAttribute('minlength', '11');
                taxIdField.setAttribute('pattern', '[0-9]{11}');
                taxIdHelpText.textContent = 'TC Kimlik No must be exactly 11 digits.';
            } else if (selectedType === 'taxid') {
                taxIdField.setAttribute('maxlength', '10');
                taxIdField.setAttribute('minlength', '10');
                taxIdField.setAttribute('pattern', '[0-9]{10}');
                taxIdHelpText.textContent = 'Tax ID must be exactly 10 digits.';
            }
        });
        
        // Restrict input to numbers only
        taxIdField.addEventListener('input', function(e) {
            // Remove any non-digit characters
            this.value = this.value.replace(/\D/g, '');
            
            // Check if valid based on selected type
            const selectedType = taxIdTypeSelect.value;
            
            if (selectedType === 'tc' && this.value.length === 11) {
                this.classList.remove('is-invalid');
                this.classList.add('is-valid');
            } else if (selectedType === 'taxid' && this.value.length === 10) {
                this.classList.remove('is-invalid');
                this.classList.add('is-valid');
            } else if (this.value.length > 0) {
                this.classList.add('is-invalid');
                this.classList.remove('is-valid');
            }
        });
        
        // Additional validation on form submit
        const form = document.getElementById('dealerSignupForm');
        if (form) {
            form.addEventListener('submit', function(e) {
                const selectedType = taxIdTypeSelect.value;
                const taxIdValue = taxIdField.value;
                
                if (!selectedType) {
                    taxIdTypeSelect.classList.add('is-invalid');
                    e.preventDefault();
                    return;
                }
                
                if (selectedType === 'tc' && taxIdValue.length !== 11) {
                    taxIdField.classList.add('is-invalid');
                    e.preventDefault();
                    return;
                }
                
                if (selectedType === 'taxid' && taxIdValue.length !== 10) {
                    taxIdField.classList.add('is-invalid');
                    e.preventDefault();
                    return;
                }
            });
        }
    }

    // Handle Tax ID Type button selection
    const tcOption = document.getElementById('tcOption');
    const taxIdOption = document.getElementById('taxIdOption');
    const signupTaxId = document.getElementById('signupTaxId');
    const idTypePrefix = document.querySelector('.id-type-prefix');

    if (tcOption && taxIdOption && signupTaxId) {
        var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.forEach(function(tooltipTriggerEl) {
            new bootstrap.Tooltip(tooltipTriggerEl);
        });
        
        // TC Kimlik No selected
        tcOption.addEventListener('change', function() {
            if (this.checked) {
                signupTaxId.setAttribute('maxlength', '11');
                signupTaxId.setAttribute('minlength', '11');
                signupTaxId.setAttribute('pattern', '[0-9]{11}');
                signupTaxId.value = '';
                signupTaxId.placeholder = 'Enter 11-digit TC Kimlik No';
                taxIdHelpText.textContent = 'TC Kimlik No must be exactly 11 digits.';
                idTypePrefix.textContent = 'TC:';
                idTypePrefix.classList.add('bg-primary', 'text-white');
                idTypePrefix.classList.remove('bg-success');
            }
        });
        
        // Tax ID selected
        taxIdOption.addEventListener('change', function() {
            if (this.checked) {
                signupTaxId.setAttribute('maxlength', '10');
                signupTaxId.setAttribute('minlength', '10');
                signupTaxId.setAttribute('pattern', '[0-9]{10}');
                signupTaxId.value = '';
                signupTaxId.placeholder = 'Enter 10-digit Tax ID';
                taxIdHelpText.textContent = 'Tax ID must be exactly 10 digits.';
                idTypePrefix.textContent = 'TAX:';
                idTypePrefix.classList.add('bg-success', 'text-white');
                idTypePrefix.classList.remove('bg-primary');
            }
        });
        
        // Restrict input to digits only and validate length
        signupTaxId.addEventListener('input', function() {
            this.value = this.value.replace(/\D/g, '');
            

            const isTc = tcOption.checked;
            const isTaxId = taxIdOption.checked;
            
            if (!isTc && !isTaxId) {
                document.getElementById('taxIdTypeError').style.display = 'block !important';
                return;
            } else {
                document.getElementById('taxIdTypeError').style.display = 'none !important';
            }
            
            const requiredLength = isTc ? 11 : 10;
            

            if (this.value.length === requiredLength) {
                this.classList.remove('is-invalid');
                this.classList.add('is-valid');
                document.getElementById('taxIdError').textContent = '';
            } else if (this.value.length > 0) {
                this.classList.add('is-invalid');
                this.classList.remove('is-valid');
                document.getElementById('taxIdError').textContent = 
                    `Please enter exactly ${requiredLength} digits.`;
            } else {
                this.classList.remove('is-invalid', 'is-valid');
            }
        });
    }
}