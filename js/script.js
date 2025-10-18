/**
 * Quantumcom Digital Website JavaScript - main.js
 * Combines core functionality (Mobile Nav, Smooth Scroll) from script.js
 * with enhanced features (Animations, Counters, Carousel) from enhanced-features.js.
 */

// ===== DOM CONTENT LOADED EVENT =====
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all features for the professional site
    initMobileNavigation();
    initTestimonialCarousel();
    initScrollAnimations();
    initFormHandling();
    initSmoothScrolling();
    initHeaderScrollEffect();
    initCounterAnimations(); // New/Enhanced feature

    console.log('🚀 Quantumcom Digital website initialized successfully!');
});

// ===================================
// ===== CORE FUNCTIONALITY
// ===================================

// ===== MOBILE NAVIGATION (From script.js) =====
function initMobileNavigation() {
    // Use button class name for general selection
    const navToggle = document.querySelector('.nav-toggle');
    const navContentWrapper = document.querySelector('.nav-content-wrapper');
    const navLinks = document.querySelectorAll('.nav-link');

    if (!navToggle || !navContentWrapper) return;

    // Toggle mobile menu
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

    // Helper functions
    function openMobileMenu() {
        navToggle.classList.add('active');
        navContentWrapper.classList.add('active');
        navToggle.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden'; // Prevent body scroll
    }

    function closeMobileMenu() {
        navToggle.classList.remove('active');
        navContentWrapper.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = ''; // Restore body scroll
    }
}

// ===== SMOOTH SCROLLING (Enhanced for modern navigation) =====
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            // Check if the link is a navigation link to an internal section
            if (this.getAttribute('href').length > 1) {
                e.preventDefault();
                document.querySelector(this.getAttribute('href')).scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===== HEADER SCROLL EFFECT (From script.js) =====
function initHeaderScrollEffect() {
    const header = document.querySelector('.header');
    if (!header) return;

    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// ===================================
// ===== ENHANCED INTERACTIVITY
// ===================================

// ===== SCROLL ANIMATIONS (From enhanced-features.js) =====
function initScrollAnimations() {
    // Fallback for browsers without IntersectionObserver
    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.querySelectorAll('[data-animation]').forEach(element => {
            element.classList.add('visible');
        });
        return;
    }

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add visible class to trigger CSS animation
                entry.target.classList.add('visible');
                // Stop observing once visible
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('[data-animation]').forEach(element => {
        observer.observe(element);
    });
}

// ===== TESTIMONIAL CAROUSEL (From enhanced-features.js) =====
function initTestimonialCarousel() {
    const carousel = document.getElementById('testimonial-carousel');
    const prevBtn = document.querySelector('.carousel-btn.prev-btn');
    const nextBtn = document.querySelector('.carousel-btn.next-btn');
    const dotsContainer = document.getElementById('dots-container');

    if (!carousel || !prevBtn || !nextBtn || !dotsContainer) return;

    const cards = carousel.querySelectorAll('.testimonial-card');
    let currentIndex = 0;
    const totalCards = cards.length;

    // Create dots
    cards.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => moveToSlide(index));
        dotsContainer.appendChild(dot);
    });
    const dots = dotsContainer.querySelectorAll('.dot');

    function updateCarousel() {
        const offset = -currentIndex * 100;
        carousel.style.transform = `translateX(${offset}%)`;

        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }

    function moveToSlide(index) {
        currentIndex = (index + totalCards) % totalCards;
        updateCarousel();
    }

    prevBtn.addEventListener('click', () => moveToSlide(currentIndex - 1));
    nextBtn.addEventListener('click', () => moveToSlide(currentIndex + 1));
}


// ===== COUNTER ANIMATIONS (From enhanced-features.js) =====
function initCounterAnimations() {
    const counterElements = document.querySelectorAll('.counter');
    if (counterElements.length === 0) return;

    // Intersection Observer to trigger counter when visible
    const observer = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 }); // Trigger when 50% of element is visible

    counterElements.forEach(counter => {
        observer.observe(counter);
    });

    function animateCounter(element) {
        const target = parseInt(element.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        let start = 0;
        const startTime = performance.now();

        function updateCount(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const value = Math.floor(progress * target);

            element.textContent = value;

            if (progress < 1) {
                requestAnimationFrame(updateCount);
            } else {
                element.textContent = target; // Ensure final target is met
            }
        }
        requestAnimationFrame(updateCount);
    }
}


// ===== FORM HANDLING (From enhanced-features.js) =====
function initFormHandling() {
    const form = document.getElementById('contact-form');
    const messageDisplay = document.getElementById('form-message');

    if (!form || !messageDisplay) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Simulate form submission success/failure
        const isSuccess = Math.random() > 0.1; // 90% chance of success for demo

        messageDisplay.textContent = 'Sending...';
        messageDisplay.style.color = '#0066ff'; // Blue for pending

        setTimeout(() => {
            if (isSuccess) {
                messageDisplay.textContent = 'Thank you! Your inquiry has been successfully sent. We will be in touch within 24 hours.';
                messageDisplay.style.color = '#00d4aa'; // Neon green for success
                form.reset();
            } else {
                messageDisplay.textContent = 'Oops! Something went wrong on our server. Please try again or contact us via phone.';
                messageDisplay.style.color = '#ff6666'; // Red for error
            }
        }, 1500); // 1.5 second delay to simulate network latency
    });
}