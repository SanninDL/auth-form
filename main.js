

(function handleAuthPage() {
    const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const PASSWORD_MIN_LENGTH = 6;
    const REQUIRED_MESSAGE = "This field is required!";
    const EMAIL_ERROR_MESSAGE = "Email must be a valid email address!";
    const PASSWORD_LENGTH_ERROR_MESSAGE = `Your password must be at least ${PASSWORD_MIN_LENGTH} characters long!`;
    const CONFIRM_PASSWORD_MESSAGE = "Confirm password and Password do not match!";

    // ==========
    function initForm() {
        const form = document.querySelector('.d-auth-wrap .auth.active .form');
        const inputList = form.querySelectorAll('.form-input');
        const togglePasswordList = form.querySelectorAll('.d-auth-wrap .toggle-view-password');


        function validate(input) {
            const type = input.name;
            const value = input.value;
            const isRequire = input.required;


            if (isRequire && !input.value) {
                return REQUIRED_MESSAGE;
            }

            switch (type) {
                case 'email':
                    const isValid = EMAIL_REGEX.test(value.toLowerCase());
                    if (!isValid) {
                        return EMAIL_ERROR_MESSAGE;
                    }
                    break;
                case 'password':
                    if (value.length < PASSWORD_MIN_LENGTH) {
                        return PASSWORD_LENGTH_ERROR_MESSAGE;
                    }
                    break;
                case 'confirm-password':
                    const password = form.querySelector('.form-input[name="password"]').value;
                    if (value !== password) {
                        return CONFIRM_PASSWORD_MESSAGE;
                    }
                    break;
                default:
                    return null;
            }
        }

        function showErrorMessage(input, message) {
            const parent = input.closest('.form-group');
            const messageEle = parent.querySelector('.form-message');
            parent.classList.add('error');
            messageEle.textContent = message;

        }

        // Show or Hide password
        togglePasswordList.forEach((togglePasswordBtn) => {
            const showPasswordIcon = togglePasswordBtn.querySelector('.show-pass');
            const hidePasswordIcon = togglePasswordBtn.querySelector('.hide-pass');

            showPasswordIcon.onclick = function () {
                this.style.display = 'none';
                hidePasswordIcon.style.display = 'flex';

                const passwordInput = this.closest('.form-item').querySelector('.form-input');
                passwordInput.setAttribute('type', 'password');
            };

            hidePasswordIcon.onclick = function () {
                this.style.display = 'none';
                showPasswordIcon.style.display = 'flex';

                const passwordInput = this.closest('.form-item').querySelector('.form-input');
                passwordInput.setAttribute('type', 'text');
            };
        });

        // Handle input change
        inputList.forEach((input) => {
            const parent = input.closest('.form-group');

            input.onfocus = function () {
                parent.classList.remove('error');
                parent.classList.add('focus');
            };

            input.onblur = function () {
                if (!input.value) {
                    parent.classList.remove('focus');
                }
                const errorMessage = validate(input);
                if (errorMessage) {
                    showErrorMessage(input, errorMessage);
                }
            };
        });

        // Handle submit form
        function getFormValues(e) {
            let isValid = true;

            inputList.forEach((input) => {
                const errorMessage = validate(input);
                if (errorMessage) {
                    showErrorMessage(input, errorMessage);
                    isValid = false;
                }

            });

            if (isValid) {
                const formData = new FormData(e.target);
                const formValues = Object.fromEntries(formData);
                return formValues;
            }
        }

        function handleSubmit(e) {
            e.preventDefault();
            const formValues = getFormValues(e);

            // All field is valid
            if (formValues) {
                // put your custom handle code before submit here ...

                e.target.submit();
            }
        }

        form.onsubmit = handleSubmit;
    }

    function handleSwitchForm() {
        const formContainerList = document.querySelectorAll('.d-auth-wrap .auth');
        const switchBtns = document.querySelectorAll('.d-auth-wrap .switch-form-btn');

        switchBtns.forEach((btn) => {
            btn.onclick = function () {
                const formSelector = btn.getAttribute('data-selector');

                formContainerList.forEach((form) => {
                    form.classList.remove('active');
                });
                document.querySelector(formSelector).classList.add('active');
                initForm();
            };
        });

    }


    initForm();
    handleSwitchForm();
})();


