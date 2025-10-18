document.addEventListener('DOMContentLoaded', function() {

    // Cache DOM elements
    const header = document.getElementById('main-header');
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.getElementById('mobile-nav');
    const mobileLinks = mobileMenu.querySelectorAll('a');

    // --- 1. Hamburger Menu and Mobile Navigation Toggle ---
    const toggleMenu = () => {
        const isExpanded = hamburger.getAttribute('aria-expanded') === 'true' || false;
        hamburger.setAttribute('aria-expanded', !isExpanded);

        mobileMenu.classList.toggle('open');
        // Optional: Add/remove a class to body to prevent scrolling on mobile
        document.body.classList.toggle('no-scroll', !isExpanded);
    };

    hamburger.addEventListener('click', toggleMenu);

    // Close menu when a link is clicked (useful for smooth scroll navigation)
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileMenu.classList.contains('open')) {
                toggleMenu();
            }
        });
    });

    // --- 2. On-Scroll Reveal Animation (Intersection Observer) ---
    const sectionRevealElements = document.querySelectorAll('.section-reveal');

    const observerOptions = {
        root: null, // viewport
        rootMargin: '0px',
        threshold: 0.1 // Trigger when 10% of the element is visible
    };

    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Stop observing once animated
            }
        });
    };

    const revealObserver = new IntersectionObserver(observerCallback, observerOptions);

    sectionRevealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // --- 3. Testimonial Carousel ---
    const slides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.dot');
    let currentSlide = 0;
    const slideInterval = 6000; // 6 seconds

    const showSlide = (index) => {
        // Reset all slides and dots
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));

        // Set the new active slide and dot
        slides[index].classList.add('active');
        dots[index].classList.add('active');
        currentSlide = index;
    };

    const nextSlide = () => {
        let newIndex = (currentSlide + 1) % slides.length;
        showSlide(newIndex);
    };

    // Start automatic rotation
    let carouselTimer = setInterval(nextSlide, slideInterval);

    // Event listeners for dots (manual navigation)
    dots.forEach(dot => {
        dot.addEventListener('click', (e) => {
            // Clear auto-rotation on manual interaction
            clearInterval(carouselTimer);

            const index = parseInt(e.target.dataset.slideIndex);
            showSlide(index);

            // Restart auto-rotation after a delay
            carouselTimer = setInterval(nextSlide, slideInterval);
        });
    });

    // Initialize the first slide
    showSlide(currentSlide);

    // --- 4. Dynamic Copyright Year ---
    document.getElementById('current-year').textContent = new Date().getFullYear();
});