/**
 * Enhanced Features for QuantumCom Digital
 * Features: Mobile Navigation, Testimonial Carousel, Scroll Animations, Counter Animations, Form Handling, Smooth Scrolling
 */

// ===== DOM CONTENT LOADED EVENT =====
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all enhanced features
    initMobileNavigation();
    initScrollAnimations();
    initTestimonialCarousel();
    initFormHandling();
    initSmoothScrolling();
    initCounterAnimations();

    console.log('🚀 QuantumCom Digital - Enhanced features loaded successfully!');
});

// ===== MOBILE NAVIGATION =====
function initMobileNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navWrapper = document.querySelector('.nav-content-wrapper');
    const navLinks = document.querySelectorAll('.nav-list a');

    if (!navToggle || !navWrapper) return;

    function openMobileMenu() {
        navToggle.classList.add('active');
        navWrapper.classList.add('active');
        navToggle.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden'; // Prevent scrolling background
    }

    function closeMobileMenu() {
        navToggle.classList.remove('active');
        navWrapper.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }

    navToggle.addEventListener('click', function() {
        const isOpen = navToggle.classList.contains('active');
        if (isOpen) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    });

    // Close menu when clicking on nav links
    navLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    // Close menu when clicking outside (on overlay, if implemented) or pressing Escape
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && navToggle.classList.contains('active')) {
            closeMobileMenu();
        }
    });
}

// ===== SCROLL ANIMATIONS (Intersection Observer) =====
function initScrollAnimations() {
    if (!('IntersectionObserver' in window)) {
        console.warn('IntersectionObserver not supported. Using fallback.');
        document.querySelectorAll('.fade-in').forEach(element => {
            element.classList.add('visible');
        });
        return;
    }

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px' // Trigger slightly before it hits the bottom
    };

    const observer = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');

                // Special handling for the stats counter and staggered service cards
                if (entry.target.classList.contains('case-study-stats')) {
                    const stats = entry.target.querySelectorAll('.stat');
                    stats.forEach((stat, index) => {
                        setTimeout(() => {
                            animateCounter(stat.querySelector('.stat-number'));
                        }, index * 200);
                    });
                } else if (entry.target.classList.contains('services-grid')) {
                    const cards = entry.target.querySelectorAll('.service-card');
                    cards.forEach((card, index) => {
                        // Apply staggered animation for cards after the grid is visible
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, index * 150);
                    });
                }

                // Stop observing once visible
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Elements to be observed for scroll animation
    const elementsToAnimate = document.querySelectorAll([
        '.hero-content',
        '.hero-visual',
        '.section-header',
        '.services-grid', // Observe the container for staggered animation
        '.case-study-featured',
        '.case-study-stats', // Observe the container for counter animation
        '.testimonial-carousel',
        '.contact-content',
        '.contact-form'
    ].join(','));

    elementsToAnimate.forEach(element => {
        // Initialize state for elements not using the staggered method
        if (!element.classList.contains('services-grid')) {
            element.classList.add('fade-in');
        }
        observer.observe(element);
    });

    // Initialize service cards with hidden state for staggered animation (overrides initial .fade-in on card level)
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
}

// ===== COUNTER ANIMATION =====
function animateCounter(element) {
    if (!element || element.dataset.animated === 'true') return;

    const target = element.textContent;
    const isPercentage = target.includes('%');
    const isCurrency = target.includes('$');
    const numericValue = parseInt(target.replace(/[^\d]/g, ''));

    if (isNaN(numericValue)) return;

    element.dataset.animated = 'true';
    let current = 0;
    const duration = 1500; // 1.5 seconds
    const stepTime = 15; // ms
    const totalSteps = duration / stepTime;
    const increment = numericValue / totalSteps;

    const timer = setInterval(() => {
        current += increment;

        if (current >= numericValue) {
            current = numericValue;
            clearInterval(timer);
        }

        let displayValue = Math.floor(current);

        // Formatting logic
        if (isCurrency) {
            if (displayValue >= 1000000) {
                displayValue = '$' + (displayValue / 1000000).toFixed(1) + 'M';
            } else if (displayValue >= 1000) {
                displayValue = '$' + (displayValue / 1000).toFixed(0) + 'K';
            } else {
                displayValue = '$' + displayValue;
            }
        } else if (isPercentage) {
            displayValue = displayValue + '%';
        }

        element.textContent = displayValue;
    }, stepTime);
}

function initCounterAnimations() {
    document.querySelectorAll('.stat-number').forEach(stat => {
        stat.dataset.animated = 'false'; // Reset animation state
    });
}


// ===== TESTIMONIAL CAROUSEL =====
function initTestimonialCarousel() {
    const carousel = document.getElementById('testimonial-carousel');
    if (!carousel) return;

    const testimonials = carousel.querySelectorAll('.testimonial-card');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const dotsContainer = carousel.querySelector('.carousel-dots');
    const dots = dotsContainer ? dotsContainer.querySelectorAll('.dot') : [];

    if (testimonials.length === 0) return;

    let currentSlide = 0;
    const totalSlides = testimonials.length;
    let autoSlideInterval;
    const slideDuration = 5000; // 5 seconds

    // Core function to show the slide
    function showSlide(index) {
        // Handle wrap around
        if (index >= totalSlides) {
            index = 0;
        } else if (index < 0) {
            index = totalSlides - 1;
        }

        // Hide all and show current
        testimonials.forEach((testimonial, i) => {
            testimonial.classList.remove('active');
            testimonial.setAttribute('aria-hidden', i !== index);
        });
        testimonials[index].classList.add('active');

        // Update dots
        dots.forEach((dot, i) => {
            dot.classList.remove('active');
            dot.setAttribute('aria-current', i === index ? 'true' : 'false');
        });
        if (dots[index]) {
            dots[index].classList.add('active');
        }

        currentSlide = index;
    }

    function nextSlide() {
        showSlide(currentSlide + 1);
        announceToScreenReader(`Showing testimonial ${currentSlide + 1} of ${totalSlides}`);
    }

    function previousSlide() {
        showSlide(currentSlide - 1);
        announceToScreenReader(`Showing testimonial ${currentSlide + 1} of ${totalSlides}`);
    }

    function goToSlide(index) {
        showSlide(index);
        announceToScreenReader(`Showing testimonial ${index + 1} of ${totalSlides}`);
    }

    function startAutoSlide() {
        stopAutoSlide(); // Clear any existing interval
        autoSlideInterval = setInterval(nextSlide, slideDuration);
    }

    function stopAutoSlide() {
        clearInterval(autoSlideInterval);
    }

    // Initial setup
    showSlide(currentSlide);
    startAutoSlide();

    // Event Listeners
    if (prevBtn) prevBtn.addEventListener('click', () => { stopAutoSlide(); previousSlide(); startAutoSlide(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { stopAutoSlide(); nextSlide(); startAutoSlide(); });

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            stopAutoSlide();
            goToSlide(index);
            startAutoSlide();
        });
    });

    // Accessibility & Hover Pause
    carousel.addEventListener('mouseenter', stopAutoSlide);
    carousel.addEventListener('mouseleave', startAutoSlide);
    carousel.addEventListener('focusin', stopAutoSlide);
    carousel.addEventListener('focusout', startAutoSlide);

    // Keyboard navigation (optional, but good practice)
    carousel.addEventListener('keydown', function(event) {
        if (event.key === 'ArrowLeft') {
            event.preventDefault();
            stopAutoSlide();
            previousSlide();
            startAutoSlide();
        } else if (event.key === 'ArrowRight') {
            event.preventDefault();
            stopAutoSlide();
            nextSlide();
            startAutoSlide();
        }
    });
}

// ===== FORM HANDLING (Client-side validation & simulated submission) =====
function initFormHandling() {
    const contactForm = document.querySelector('.contact-form');
    const newsletterForm = document.querySelector('.newsletter-form');

    // Add event listeners for forms
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', handleNewsletterForm);
    }

    // Add validation listeners for all inputs in the contact form
    const inputs = document.querySelectorAll('.contact-form input, .contact-form textarea, .contact-form select');
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearErrors);
    });
}

function isValidEmail(email) {
    // Basic regex for email validation
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function clearFieldError(field) {
    field.classList.remove('error');
    field.setAttribute('aria-invalid', 'false');
    const errorDiv = field.parentNode.querySelector('.error-message');
    if (errorDiv) errorDiv.remove();
}

function validateField(event) {
    const field = event.target;
    const value = field.value.trim();
    const name = field.name;
    let error = null;

    clearFieldError(field);

    if (field.required && !value) {
        error = `${name.charAt(0).toUpperCase() + name.slice(1)} is required.`;
    } else if (name === 'email' && value && !isValidEmail(value)) {
        error = 'Please enter a valid email address.';
    } else if (name === 'name' && value.length < 2) {
        error = 'Name must be at least 2 characters.';
    } else if (name === 'message' && value.length < 10) {
        error = 'Message must be at least 10 characters long.';
    }

    if (error) {
        displayFormError(field, error);
        return false;
    }
    return true;
}

function displayFormError(field, message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.setAttribute('role', 'alert');
    field.parentNode.appendChild(errorDiv);
    field.classList.add('error');
    field.setAttribute('aria-invalid', 'true');
}

function handleContactForm(event) {
    event.preventDefault();
    const form = event.target;
    const inputs = form.querySelectorAll('input, textarea, select');
    let formIsValid = true;

    // Run full validation on all fields
    inputs.forEach(input => {
        if (!validateField({ target: input })) {
            formIsValid = false;
        }
    });

    if (!formIsValid) {
        showNotification('Please correct the errors in the form.', 'error');
        return;
    }

    // Show loading state
    const submitBtn = form.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    // Simulate form submission (replace with actual endpoint)
    setTimeout(() => {
        form.reset();
        showNotification('Thank you! Your message has been sent successfully. We will be in touch soon.', 'success');

        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        announceToScreenReader('Contact form submitted successfully');
    }, 2000);
}

function handleNewsletterForm(event) {
    event.preventDefault();
    const form = event.target;
    const emailInput = form.querySelector('input[type="email"]');
    const email = emailInput.value.trim();

    if (!email || !isValidEmail(email)) {
        showNotification('Please enter a valid email address to subscribe.', 'error');
        emailInput.focus();
        return;
    }

    // Show loading state
    const submitBtn = form.querySelector('button');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Subscribing...';
    submitBtn.disabled = true;

    // Simulate subscription (replace with actual endpoint)
    setTimeout(() => {
        emailInput.value = '';
        showNotification('Successfully subscribed to our newsletter!', 'success');

        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        announceToScreenReader('Successfully subscribed to newsletter');
    }, 1500);
}

// ===== UTILITY FUNCTIONS =====

// Function to display temporary notification messages
function showNotification(message, type = 'info') {
    const notificationContainer = document.getElementById('form-notification') || document.createElement('div');
    if (!document.getElementById('form-notification')) {
        notificationContainer.id = 'form-notification';
        document.body.appendChild(notificationContainer);
    }

    notificationContainer.textContent = message;
    notificationContainer.className = `notification ${type}`;

    // Simple styling for demonstration (ideally done in CSS)
    notificationContainer.style.position = 'fixed';
    notificationContainer.style.bottom = '20px';
    notificationContainer.style.right = '20px';
    notificationContainer.style.padding = '15px 25px';
    notificationContainer.style.borderRadius = '8px';
    notificationContainer.style.zIndex = '1000';
    notificationContainer.style.color = 'var(--primary-dark)';
    notificationContainer.style.transition = 'opacity 0.5s ease';
    notificationContainer.style.opacity = '1';

    if (type === 'success') {
        notificationContainer.style.backgroundColor = 'var(--accent-neon)';
    } else if (type === 'error') {
        notificationContainer.style.backgroundColor = '#ff5555';
    } else {
        notificationContainer.style.backgroundColor = 'var(--text-secondary)';
    }

    setTimeout(() => {
        notificationContainer.style.opacity = '0';
        setTimeout(() => notificationContainer.remove(), 500);
    }, 3000);
}

// Simple smooth scrolling for internal links
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId && targetId !== '#') {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

// Utility for screen reader announcements
function announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.style.cssText = `
        position: absolute;
        width: 1px;
        height: 1px;
        margin: -1px;
        padding: 0;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
    `;

    document.body.appendChild(announcement);
    announcement.textContent = message;

    // Clean up after announcement is made
    setTimeout(() => {
        document.body.removeChild(announcement);
    }, 1000);
}