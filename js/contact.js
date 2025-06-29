// Contact Form Application
class ContactForm {
    constructor() {
        this.form = document.getElementById('contact-form');
        this.submitBtn = document.querySelector('.submit-btn');
        this.successMessage = document.getElementById('form-success');
        this.init();
    }

    init() {
        if (this.form) {
            this.bindEvents();
        }
    }

    bindEvents() {
        // Form submission
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });

        // Real-time validation
        const inputs = this.form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });

            input.addEventListener('input', () => {
                this.clearFieldError(input);
            });
        });
    }

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        switch (field.type) {
            case 'email':
                if (!value) {
                    errorMessage = 'Email is required';
                    isValid = false;
                } else if (!this.isValidEmail(value)) {
                    errorMessage = 'Please enter a valid email address';
                    isValid = false;
                }
                break;

            case 'text':
                if (!value) {
                    errorMessage = `${field.name === 'name' ? 'Name' : 'Subject'} is required`;
                    isValid = false;
                } else if (value.length < 2) {
                    errorMessage = `${field.name === 'name' ? 'Name' : 'Subject'} must be at least 2 characters`;
                    isValid = false;
                }
                break;

            case 'textarea':
                if (!value) {
                    errorMessage = 'Message is required';
                    isValid = false;
                } else if (value.length < 10) {
                    errorMessage = 'Message must be at least 10 characters';
                    isValid = false;
                }
                break;
        }

        if (!isValid) {
            this.showFieldError(field, errorMessage);
        } else {
            this.clearFieldError(field);
        }

        return isValid;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    showFieldError(field, message) {
        const errorElement = document.getElementById(field.id + '-error');
        if (errorElement) {
            errorElement.textContent = message;
            field.classList.add('error');
        }
    }

    clearFieldError(field) {
        const errorElement = document.getElementById(field.id + '-error');
        if (errorElement) {
            errorElement.textContent = '';
            field.classList.remove('error');
        }
    }

    validateForm() {
        const inputs = this.form.querySelectorAll('input[required], textarea[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });

        return isValid;
    }

    async handleSubmit() {
        if (!this.validateForm()) {
            this.showNotification('Please fix the errors in the form', 'error');
            return;
        }

        // Add loading state
        this.addLoadingState();

        try {
            // Simulate form submission (replace with actual form submission)
            await this.simulateSubmission();

            // Show success message
            this.showSuccessMessage();
            this.resetForm();

        } catch (error) {
            this.showNotification('Failed to send message. Please try again.', 'error');
        } finally {
            this.removeLoadingState();
        }
    }

    async simulateSubmission() {
        // Simulate API call delay
        return new Promise((resolve) => {
            setTimeout(resolve, 2000);
        });
    }

    addLoadingState() {
        if (this.submitBtn) {
            this.submitBtn.classList.add('loading');
            this.submitBtn.disabled = true;
        }
    }

    removeLoadingState() {
        if (this.submitBtn) {
            this.submitBtn.classList.remove('loading');
            this.submitBtn.disabled = false;
        }
    }

    showSuccessMessage() {
        if (this.form && this.successMessage) {
            this.form.style.display = 'none';
            this.successMessage.style.display = 'block';
        }
    }

    resetForm() {
        this.form.reset();
        
        // Clear all error states
        const inputs = this.form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            this.clearFieldError(input);
        });
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;

        // Add styles if not already added
        if (!document.getElementById('notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                .notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    padding: 1rem 1.5rem;
                    border-radius: 8px;
                    color: white;
                    font-weight: 500;
                    z-index: 10000;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    animation: slideInRight 0.3s ease;
                    max-width: 300px;
                }
                
                .notification-success {
                    background: #28a745;
                }
                
                .notification-error {
                    background: #dc3545;
                }
                
                .notification-info {
                    background: #17a2b8;
                }
                
                @keyframes slideInRight {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                
                .notification.fade-out {
                    animation: slideOutRight 0.3s ease forwards;
                }
                
                @keyframes slideOutRight {
                    from {
                        transform: translateX(0);
                        opacity: 1;
                    }
                    to {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(notification);

        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// Initialize Contact Form when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('contact-form')) {
        new ContactForm();
    }
});

// Optional: Integration with Formspree
// To use Formspree, replace the handleSubmit method with:
/*
async handleSubmit() {
    if (!this.validateForm()) {
        this.showNotification('Please fix the errors in the form', 'error');
        return;
    }

    this.addLoadingState();

    try {
        const formData = new FormData(this.form);
        const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });

        if (response.ok) {
            this.showSuccessMessage();
            this.resetForm();
        } else {
            throw new Error('Form submission failed');
        }
    } catch (error) {
        this.showNotification('Failed to send message. Please try again.', 'error');
    } finally {
        this.removeLoadingState();
    }
}
*/

// Optional: Integration with EmailJS
// To use EmailJS, add this to the head section:
// <script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>
// And replace the handleSubmit method with:
/*
async handleSubmit() {
    if (!this.validateForm()) {
        this.showNotification('Please fix the errors in the form', 'error');
        return;
    }

    this.addLoadingState();

    try {
        const formData = {
            name: this.form.querySelector('#name').value,
            email: this.form.querySelector('#email').value,
            subject: this.form.querySelector('#subject').value,
            message: this.form.querySelector('#message').value
        };

        await emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', formData, 'YOUR_USER_ID');
        
        this.showSuccessMessage();
        this.resetForm();
    } catch (error) {
        this.showNotification('Failed to send message. Please try again.', 'error');
    } finally {
        this.removeLoadingState();
    }
}
*/ 
