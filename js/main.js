document.addEventListener('DOMContentLoaded', function () {
    // Existing initialization
    initDealerForms();
    initProductSlider();
    initNavbarScroll();
    initForgotPasswordForm();

    initDealerModals();

    setupAutocompleteAttributes();

    const forms = document.querySelectorAll('.needs-validation');

    Array.prototype.slice.call(forms).forEach(function (form) {
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('invalid', function (e) {
                e.preventDefault();
            }, true);

            input.addEventListener('input', function () {
                if (form.classList.contains('was-validated')) {
                    this.checkValidity();
                }
            });
        });

        form.addEventListener('submit', function (event) {
            event.preventDefault();
            event.stopPropagation();

            console.log('--- Submit Handler Start ---'); // DEBUG

            let isFormValid = true;

            const emailField = document.getElementById('signupEmail');
            const passwordField = document.getElementById('signupPassword');
            const confirmField = document.getElementById('signupPasswordConfirm');



            // --- Password Regex Check ---
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s])\S{8,16}$/;
            const isPasswordRegexValid = passwordRegex.test(passwordField.value);
            if (!isPasswordRegexValid) {
                console.log('Password Regex FAILED'); // DEBUG
                passwordField.setCustomValidity('Password must meet all requirements');
                passwordField.classList.add('is-invalid');
                passwordField.classList.remove('is-valid');
                isFormValid = false;
            } else {
                passwordField.setCustomValidity('');
                passwordField.classList.remove('is-invalid');
                if (passwordField.value) passwordField.classList.add('is-valid');
            }

            // --- Password Match Check ---
            const doPasswordsMatch = passwordField.value === confirmField.value;
            if (!doPasswordsMatch) {
                confirmField.setCustomValidity('Passwords do not match');
                confirmField.classList.add('is-invalid');
                confirmField.classList.remove('is-valid');
                isFormValid = false;
            } else {
                confirmField.setCustomValidity('');
                confirmField.classList.remove('is-invalid');
                if (confirmField.value) confirmField.classList.add('is-valid');
            }

            // --- Email Check ---
            const isEmailCheckValid = emailField.checkValidity();
            if (!isEmailCheckValid) {
                emailField.classList.add('is-invalid');
                emailField.classList.remove('is-valid');
                isFormValid = false;
            } else {
                emailField.classList.remove('is-invalid');
                if (emailField.value) emailField.classList.add('is-valid');
            }

            if (!isFormValid) {
                return;
            }


            const firstNameEl = document.getElementById('signupFirstName');
            const lastNameEl = document.getElementById('signupLastName');
            const phoneEl = document.getElementById('signupPhone');
            const companyEl = document.getElementById('signupCompany');
            const taxIdEl = document.getElementById('signupTaxId');
            const taxOfficeEl = document.getElementById('signupTaxOffice'); // The problematic one

            if (!taxOfficeEl) {
                console.warn('Form element with ID "signupTaxOffice" not found!'); // Warn if missing
            }

            const formData = {
                firstName: firstNameEl ? firstNameEl.value : '',
                lastName: lastNameEl ? lastNameEl.value : '',
                email: emailField.value, // Already checked
                phone: phoneEl ? phoneEl.value : '',
                company: companyEl ? companyEl.value : '',
                taxId: taxIdEl ? taxIdEl.value : '',
                taxOffice: taxOfficeEl ? taxOfficeEl.value : '', // Use ternary check
                password: passwordField.value // Already checked
            };


            //API call here
            showNotification('Registration successful! We will review your application and contact you soon.', 'success');

            const modal = bootstrap.Modal.getInstance(document.getElementById('dealerSignupModal'));
            modal.hide();
            this.reset();

        }, false);

        const modal = form.closest('.modal');
        if (modal) {
            modal.addEventListener('hidden.bs.modal', function () {
                form.classList.remove('was-validated');
                form.reset();

                inputs.forEach(input => {
                    input.classList.remove('is-invalid', 'is-valid');
                    input.setCustomValidity('');
                });
            });
        }
    });

    const languageButtons = document.querySelectorAll('.language-switcher .btn');

    const currentLang = localStorage.getItem('selectedLanguage') || 'en';
    setActiveLanguage(currentLang);

    languageButtons.forEach(button => {
        button.addEventListener('click', function () {
            const lang = this.getAttribute('data-lang');

            // Save selected language
            localStorage.setItem('selectedLanguage', lang);

            // Update active state
            setActiveLanguage(lang);

            // Redirect to language version
            if (lang === 'tr') {
                window.location.href = window.location.pathname.replace('/en/', '/tr/');
            } else {
                window.location.href = window.location.pathname.replace('/tr/', '/en/');
            }
        });
    });

    function setActiveLanguage(lang) {
        languageButtons.forEach(btn => {
            if (btn.getAttribute('data-lang') === lang) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    const loginIdentifier = document.getElementById('loginIdentifier');
    if (loginIdentifier) {
        loginIdentifier.addEventListener('input', function (e) {
            // Remove any non-digit characters
            this.value = this.value.replace(/\D/g, '');

            const length = this.value.length;

            // Validate length (10 for Tax ID or 11 for TC Kimlik No)
            if (length === 10 || length === 11) {
                this.classList.remove('is-invalid');
                this.classList.add('is-valid');
            } else if (length > 0) {
                this.classList.add('is-invalid');
                this.classList.remove('is-valid');
            } else {
                this.classList.remove('is-invalid', 'is-valid');
            }
        });

        // Prevent non-numeric input
        loginIdentifier.addEventListener('keypress', function (e) {
            if (!/^\d*$/.test(e.key)) {
                e.preventDefault();
            }
        });
    }
});


function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    let lastScrollTop = 0;

    navbar.classList.remove('fixed-top');
    navbar.classList.add('navbar-scroll');

    window.addEventListener('scroll', function () {
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
        button.addEventListener('click', function () {
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

        confirmField.addEventListener('input', function () {
            if (passwordField.value !== this.value) {
                this.setCustomValidity('Passwords do not match');
            } else {
                this.setCustomValidity('');
            }
        });

        passwordField.addEventListener('input', function () {
            if (confirmField.value && confirmField.value !== this.value) {
                confirmField.setCustomValidity('Passwords do not match');
            } else {
                confirmField.setCustomValidity('');
            }
        });

        signupForm.addEventListener('submit', function (event) {
            event.preventDefault();

            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s])\S{8,16}$/;
            if (!passwordRegex.test(passwordField.value)) {
                passwordField.setCustomValidity('Password must meet all requirements');
            } else {
                passwordField.setCustomValidity('');
            }

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
        loginForm.addEventListener('submit', function (event) {
            event.preventDefault();

            const identifier = document.getElementById('loginIdentifier');
            const password = document.getElementById('loginPassword');

            // Check identifier length
            const idLength = identifier.value.length;
            if (idLength !== 10 && idLength !== 11) {
                showNotification('Please enter valid TC Kimlik No (11 digits) or Tax ID (10 digits)', 'danger');
                identifier.classList.add('is-invalid');
                return;
            }

            // Check if password is empty
            if (!password.value) {
                showNotification('Please enter your password', 'danger');
                password.classList.add('is-invalid');
                return;
            }

            // If validation passes, proceed with login
            const loginData = {
                identifier: identifier.value,
                password: password.value,
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
        forgotPasswordForm.addEventListener('submit', function (event) {
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

    notification.addEventListener('hidden.bs.toast', function () {
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
    sortSelect.addEventListener('change', function () {
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
        // Skip generic listeners for the password field, as it has specific handling
        if (input.id === 'signupPassword') {
            return;
        }

        input.addEventListener('blur', function () {
            this.classList.remove('is-invalid', 'is-valid');

            if (!this.validity.valid) {
                this.classList.add('is-invalid');
            } else if (this.value) {
                this.classList.add('is-valid');
            }
        });

        input.addEventListener('input', function () {
            if (this.classList.contains('is-invalid') && this.validity.valid) {
                this.classList.remove('is-invalid');
                this.classList.add('is-valid');
            }
        });
    });

    // Password validation
    const passwordField = document.getElementById('signupPassword');
    if (passwordField) {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s])\S{8,16}$/;
        const helpText = passwordField.parentNode.querySelector('.form-text');

        passwordField.addEventListener('input', function () {
            const password = this.value;

            // Clear previous validation state
            this.setCustomValidity('');

            if (password.length === 0) {
                // Empty password field
                this.classList.remove('is-invalid', 'is-valid');
                if (helpText) {
                    helpText.classList.remove('text-success');
                    helpText.classList.add('text-muted');
                    helpText.textContent = 'Password must be at least 8 characters long and include uppercase, lowercase, numbers, and special characters.';
                }
            } else if (regex.test(password)) {
                // Valid password
                this.classList.remove('is-invalid');
                this.classList.add('is-valid');
                if (helpText) {
                    helpText.classList.add('text-success');
                    helpText.classList.remove('text-muted');
                    helpText.textContent = 'Password meets all requirements.';
                }
            } else {
                // Invalid password
                this.setCustomValidity('Password must meet all requirements');
                this.classList.add('is-invalid');
                this.classList.remove('is-valid');
                if (helpText) {
                    helpText.classList.remove('text-success');
                    helpText.classList.add('text-muted');
                    helpText.textContent = 'Password must be at least 8 characters long and include uppercase, lowercase, numbers, and special characters.';
                }
            }

            // Update confirm password validation if it exists
            const confirmField = document.getElementById('signupPasswordConfirm');
            if (confirmField && confirmField.value) {
                if (confirmField.value === password) {
                    confirmField.setCustomValidity('');
                    confirmField.classList.add('is-valid');
                    confirmField.classList.remove('is-invalid');
                } else {
                    confirmField.setCustomValidity('Passwords do not match');
                    confirmField.classList.add('is-invalid');
                    confirmField.classList.remove('is-valid');
                }
            }
        });

        // Add blur event for final validation
        passwordField.addEventListener('blur', function () {
            if (this.value.length > 0 && !regex.test(this.value)) {
                this.classList.add('is-invalid');
                this.setCustomValidity('Password must meet all requirements');
            }
        });
    }

    const password = document.getElementById('signupPassword');
    const confirmPassword = document.getElementById('signupPasswordConfirm');

    if (password && confirmPassword) {
        confirmPassword.addEventListener('blur', function () {
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
        taxIdTypeSelect.addEventListener('change', function () {
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
        taxIdField.addEventListener('input', function (e) {
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
            } else {
                this.classList.remove('is-invalid', 'is-valid');
            }
        });

        // Additional validation on form submit
        const form = document.getElementById('dealerSignupForm');
        if (form) {
            form.addEventListener('submit', function (e) {
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
        tooltipTriggerList.forEach(function (tooltipTriggerEl) {
            new bootstrap.Tooltip(tooltipTriggerEl);
        });

        // TC Kimlik No selected
        tcOption.addEventListener('change', function () {
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
        taxIdOption.addEventListener('change', function () {
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
        signupTaxId.addEventListener('input', function () {
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

    // Text-only input validation for name fields
    const textOnlyInputs = ['signupFirstName', 'signupLastName', 'signupCompany'];
    textOnlyInputs.forEach(inputId => {
        const input = document.getElementById(inputId);
        if (input) {
            input.addEventListener('input', function (e) {
                // For company name, allow numbers and some special characters
                if (this.id === 'signupCompany') {
                    // Allow letters, numbers, spaces, hyphen, dot, ampersand, and comma for company names
                    const cleanedValue = this.value.replace(/[^a-zA-Z0-9ğüşıöçĞÜŞİÖÇ\s\-\.\&\,]/g, '');

                    // Only update if different to avoid cursor jumping
                    if (this.value !== cleanedValue) {
                        const cursorPos = this.selectionStart;
                        const lengthDiff = cleanedValue.length - this.value.length;
                        this.value = cleanedValue;
                        this.setSelectionRange(cursorPos + lengthDiff, cursorPos + lengthDiff);
                    }
                } else {
                    // For names, only allow letters and spaces
                    const cleanedValue = this.value.replace(/[^a-zA-ZğüşıöçĞÜŞİÖÇ\s]/g, '');

                    // Don't use automatic case conversion - it breaks Turkish characters
                    // Instead, only capitalize the first letter of each word without affecting the rest
                    const words = cleanedValue.split(' ');
                    const properlyCapitalized = words.map(word => {
                        if (!word) return '';

                        // Handle special case for Turkish dotless i - "ı" and "i"
                        if (word.charAt(0).toLowerCase() === 'i') {
                            return 'İ' + word.substring(1);
                        } else if (word.charAt(0).toLowerCase() === 'ı') {
                            return 'I' + word.substring(1);
                        } else {
                            // For other characters, use the normal approach
                            return word.charAt(0).toLocaleUpperCase('tr-TR') + word.substring(1);
                        }
                    }).join(' ');

                    // Only update if the value would change to avoid cursor jumping
                    if (this.value !== properlyCapitalized) {
                        const cursorPos = this.selectionStart;
                        const lengthDiff = properlyCapitalized.length - this.value.length;
                        this.value = properlyCapitalized;
                        this.setSelectionRange(cursorPos + lengthDiff, cursorPos + lengthDiff);
                    }
                }

                // Validate on input
                if (this.value.trim().length > 0) {
                    this.classList.remove('is-invalid');
                    this.classList.add('is-valid');
                } else {
                    this.classList.remove('is-valid');
                    this.classList.add('is-invalid');
                }
            });

            input.addEventListener('blur', function () {
                // Trim extra spaces on blur
                this.value = this.value.trim().replace(/\s+/g, ' ');
            });

            // Add explicit text-transform override
            input.style.textTransform = 'none';
        }
    });
}

/**
 * Set autocomplete attributes on password fields
 * Fixes browser warnings and improves security
 */
function setupAutocompleteAttributes() {
    // Fix login password field
    const loginPassword = document.getElementById('loginPassword');
    if (loginPassword) {
        loginPassword.setAttribute('autocomplete', 'current-password');
    }

    // Fix signup password field
    const signupPassword = document.getElementById('signupPassword');
    if (signupPassword) {
        signupPassword.setAttribute('autocomplete', 'new-password');
    }

    // Fix confirm password field
    const confirmPassword = document.getElementById('signupPasswordConfirm');
    if (confirmPassword) {
        confirmPassword.setAttribute('autocomplete', 'new-password');
    }
}

// Add CSS for improved notification styling
const style = document.createElement('style');
style.textContent = `
    .toast.bg-danger {
        background-color: #dc3545 !important;
        color: white;
    }
    
    .toast {
        min-width: 300px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
    
    .toast-body {
        padding: 12px 16px;
        font-size: 14px;
        font-weight: 500;
    }
`;
document.head.appendChild(style);

/**
 * Initialize or reset the international telephone input
 * @param {boolean} keepFormat - Whether to keep formatting
 */
window.initPhoneInput = function (keepFormat = false) {
    const phoneInputField = document.querySelector("#signupPhone");
    if (!phoneInputField || typeof intlTelInput === 'undefined') return;

    // Destroy previous instance if it exists
    if (window.phoneInput && window.phoneInput.destroy) {
        try {
            window.phoneInput.destroy();
        } catch (e) {
            console.log('No previous phone input instance to destroy');
        }
    }

    // Create new instance
    window.phoneInput = intlTelInput(phoneInputField, {
        preferredCountries: ["tr", "us", "gb", "de"],
        initialCountry: "tr",
        separateDialCode: true,
        utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.13/js/utils.js",
        formatOnDisplay: keepFormat,
        nationalMode: true,
        autoPlaceholder: "aggressive"
    });

    // Clear the input value and reset placeholder
    phoneInputField.value = '';

    // Add input validation for country-specific phone number length
    phoneInputField.addEventListener('input', function () {
        // Allow only digits
        this.value = this.value.replace(/\D/g, '');

        if (window.phoneInput) {
            const countryData = window.phoneInput.getSelectedCountryData();
            const countryCode = countryData.iso2;

            // Get expected length for the selected country
            const phoneLengths = {
                'tr': 10, 'us': 10, 'gb': 10, 'de': 11,
                'fr': 9, 'it': 10, 'es': 9, 'nl': 9
            };

            const expectedLength = phoneLengths[countryCode] || 10;
            const currentLength = this.value.length;

            if (currentLength === expectedLength) {
                // Valid length for country
                this.classList.add('is-valid');
                this.classList.remove('is-invalid');
            } else if (currentLength > 0) {
                // Invalid length
                this.classList.add('is-invalid');
                this.classList.remove('is-valid');
            } else {
                // Empty field
                this.classList.remove('is-valid', 'is-invalid');
            }
        }
    });

    // Update validation when country changes
    phoneInputField.addEventListener('countrychange', function () {
        // Reset validation classes
        this.classList.remove('is-valid', 'is-invalid');

        // Clear value when country changes
        this.value = '';
    });
};


/**
 * Initialize dealers modals globally
 * This ensures modals work on all pages
 */
function initDealerModals() {
    // Listen for modal shown events
    document.addEventListener('shown.bs.modal', function (event) {
        const modal = event.target;

        // Check if this is the dealer signup modal
        if (modal.id === 'dealerSignupModal') {
            // Initialize phone input
            if (typeof window.initPhoneInput === 'function') {
                window.initPhoneInput(true);
            }

            // Setup form validation if available
            if (typeof setupFormValidation === 'function') {
                setupFormValidation();
            }
        }
    });

    // Add global reset handler for all modals
    document.addEventListener('hidden.bs.modal', function (event) {
        const modal = event.target;

        if (modal.id === 'dealerSignupModal') {
            const form = modal.querySelector('#dealerSignupForm');
            if (form) {
                form.reset();
                form.classList.remove('was-validated');

                // Reset all inputs
                const inputs = form.querySelectorAll('input, select, textarea');
                inputs.forEach(input => {
                    input.classList.remove('is-invalid', 'is-valid');
                    input.setCustomValidity('');
                });
            }
        }
    });
}

// Add to your existing CSS at the end of the file

// Add CSS fixes for international telephone input
const itiStyle = document.createElement('style');
itiStyle.textContent = `
    .iti {
        width: 100%;
        display: block;
    }
    
    .iti__flag-container {
        z-index: 1050; /* Make sure dropdown appears above modal */
    }
    
    #signupPhone {
        padding-left: 90px !important;
    }
`;
document.head.appendChild(itiStyle);

// Initialize the news slider Swiper
document.addEventListener('DOMContentLoaded', function () {
    // Load news data
    fetchNewsItems().then(() => {
        // After news items are loaded, initialize Swiper
        initNewsSwiper();
    });
});

function initNewsSwiper() {
    // Check if the slider already exists and destroy it
    if (window.newsSwiper && window.newsSwiper.destroy) {
        window.newsSwiper.destroy(true, true);
    }

    // Initialize news slider with Swiper
    window.newsSwiper = new Swiper('.newsSwiper', {
        slidesPerView: 1,
        spaceBetween: 20,
        loop: true,
        speed: 600,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.newsSwiper .swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.newsSwiper .swiper-button-next',
            prevEl: '.newsSwiper .swiper-button-prev',
        },
        breakpoints: {
            // when window width is >= 576px
            576: {
                slidesPerView: 2,
                spaceBetween: 20
            },
            // when window width is >= 992px
            992: {
                slidesPerView: 3,
                spaceBetween: 30
            }
        },
        // Prevent slider from breaking layout during initialization
        on: {
            init: function () {
                const swiperEl = document.querySelector('.newsSwiper');
                if (swiperEl) {
                    swiperEl.classList.add('swiper-initialized');
                }
            }
        }
    });
}

// Mock function to fetch news items
function fetchNewsItems() {
    return new Promise((resolve) => {
        // Sample news data
        const newsItems = [
            {
                id: 1,
                image: './img/kadekor_company.png',
                title: 'New Product Launch: VinylBond Series',
                date: 'April 18, 2025',
                category: 'Product News',
                excerpt: 'Introducing our latest innovation in decorative films with enhanced durability and stunning finishes.'
            },
            {
                id: 2,
                image: './img/kadekor_company.png',
                title: 'KadeKor Expands to European Markets',
                date: 'April 5, 2025',
                category: 'Company News',
                excerpt: 'We\'re excited to announce our expansion into key European markets with new distribution partnerships.'
            },
            {
                id: 3,
                image: './img/kadekor_company.png',
                title: 'Sustainable Manufacturing Initiative',
                date: 'March 22, 2025',
                category: 'Sustainability',
                excerpt: 'Our commitment to environmental responsibility with new eco-friendly manufacturing processes.'
            },
            {
                id: 4,
                image: './img/kadekor_company.png',
                title: 'Industry Award for Design Excellence',
                date: 'March 15, 2025',
                category: 'Awards',
                excerpt: 'KadeKor receives prestigious industry recognition for innovative design and quality.'
            }
        ];

        // Get the news slider wrapper
        const newsWrapper = document.querySelector('.newsSwiper .swiper-wrapper');

        if (newsWrapper) {
            // Clear existing content
            newsWrapper.innerHTML = '';

            // Populate with news items
            newsItems.forEach(item => {
                const slide = document.createElement('div');
                slide.className = 'swiper-slide';

                // Default placeholder if image can't be loaded
                const placeholderImage = './img/placeholder.jpg';

                slide.innerHTML = `
                                <div class="card h-100 shadow-sm border-0">
                                    <div class="card-img-container">
                                            <img src="${placeholderImage}" data-src="${item.image}" class="card-img-top lazy-load" alt="${item.title}">
                                    </div>
                                    <div class="card-body">
                                        <div class="d-flex align-items-center justify-content-between mb-2">
                                            <small class="text-muted">${item.date}</small>
                                            <span class="badge bg-primary">${item.category}</span>
                                    </div>
                                        <h5 class="card-title">${item.title}</h5>
                                        <p class="card-text">${item.excerpt}</p>
                                    </div>
                                    <div class="card-footer bg-white border-0">
                                        <a href="news.html?id=${item.id}" 
                                        class="btn btn-link text-primary px-0 d-flex align-items-center" 
                                        aria-label="Read more about ${item.title}">
                                        <span class="me-1">Read more</span>
                                        <i class="fas fa-arrow-right" aria-hidden="true"></i>
                                        </a>
                                    </div>
                            </div>
`;


                newsWrapper.appendChild(slide);
            });

            // Initialize lazy loading after all slides are created
            setTimeout(() => {
                const lazyImages = document.querySelectorAll('.lazy-load');
                lazyImages.forEach(img => {
                    // Pre-load the image
                    const tempImg = new Image();
                    tempImg.onload = function () {
                        img.src = img.dataset.src;
                        img.classList.remove('lazy-load');
                    };
                    tempImg.onerror = function () {
                        // Keep the placeholder if the intended image fails to load
                        console.log('Failed to load: ' + img.dataset.src);
                    };
                    tempImg.src = img.dataset.src;
                });
            }, 100);
        }

        resolve();
    });
}