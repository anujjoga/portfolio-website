// Initialize AOS (Animate On Scroll)
AOS.init({
    duration: 800,
    easing: 'ease-in-out',
    once: true,
    offset: 100
});

// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

// Typing Effect for Hero Section
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        } else {
            // Add blinking cursor effect
            element.innerHTML += '<span class="cursor">|</span>';
        }
    }
    
    type();
}

// Initialize typing effect if on homepage
const typingElement = document.getElementById('typing-text');
if (typingElement) {
    const texts = [
        'Full Stack Developer',
        'UI/UX Designer',
        'Problem Solver',
        'Creative Thinker'
    ];
    
    let currentTextIndex = 0;
    
    function startTyping() {
        typeWriter(typingElement, texts[currentTextIndex], 100);
    }
    
    function nextText() {
        currentTextIndex = (currentTextIndex + 1) % texts.length;
        setTimeout(() => {
            typeWriter(typingElement, texts[currentTextIndex], 100);
        }, 2000);
    }
    
    // Start the typing effect
    startTyping();
    
    // Change text every 4 seconds
    setInterval(nextText, 4000);
}

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Progress bar animation for skills
function animateProgressBars() {
    const progressBars = document.querySelectorAll('.progress-fill');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target;
                const width = progressBar.getAttribute('data-width');
                progressBar.style.width = width + '%';
            }
        });
    }, { threshold: 0.5 });
    
    progressBars.forEach(bar => {
        observer.observe(bar);
    });
}

// Initialize progress bar animation if on about page
if (document.querySelector('.progress-fill')) {
    animateProgressBars();
}

// Add cursor blinking animation
const style = document.createElement('style');
style.textContent = `
    .cursor {
        animation: blink 1s infinite;
    }
    
    @keyframes blink {
        0%, 50% { opacity: 1; }
        51%, 100% { opacity: 0; }
    }
`;
document.head.appendChild(style);

// Form validation helper functions
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validateRequired(value) {
    return value.trim().length > 0;
}

function showError(element, message) {
    const errorElement = document.getElementById(element.id + '-error');
    if (errorElement) {
        errorElement.textContent = message;
        element.classList.add('error');
    }
}

function clearError(element) {
    const errorElement = document.getElementById(element.id + '-error');
    if (errorElement) {
        errorElement.textContent = '';
        element.classList.remove('error');
    }
}

// Utility function to debounce
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Add loading state to buttons
function addLoadingState(button) {
    button.classList.add('loading');
    button.disabled = true;
}

function removeLoadingState(button) {
    button.classList.remove('loading');
    button.disabled = false;
}

// Export utility functions for use in other scripts
window.portfolioUtils = {
    validateEmail,
    validateRequired,
    showError,
    clearError,
    debounce,
    addLoadingState,
    removeLoadingState
}; 