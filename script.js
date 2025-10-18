document.addEventListener('DOMContentLoaded', function() {

    // --- Core Element Cache ---
    const header = document.getElementById('main-header');
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.getElementById('mobile-nav');
    const mobileLinks = mobileMenu ? mobileMenu.querySelectorAll('a') : [];

    // --- 1. Navigation and Header Logic ---

    // Mobile Menu Toggle
    const toggleMenu = () => {
        const isExpanded = hamburger.getAttribute('aria-expanded') === 'true' || false;
        hamburger.setAttribute('aria-expanded', !isExpanded);
        mobileMenu.classList.toggle('open');
        document.body.classList.toggle('no-scroll', !isExpanded);
    };

    if (hamburger) {
        hamburger.addEventListener('click', toggleMenu);
        mobileLinks.forEach(link => link.addEventListener('click', () => {
            if (mobileMenu.classList.contains('open')) toggleMenu();
        }));
    }

    // --- 2. On-Scroll Reveal Animation ---
    const initializeScrollReveal = () => {
        const sectionRevealElements = document.querySelectorAll('.section-reveal');

        if (sectionRevealElements.length === 0) return;

        const observerOptions = { root: null, rootMargin: '0px', threshold: 0.1 };

        const observerCallback = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        };

        const revealObserver = new IntersectionObserver(observerCallback, observerOptions);

        sectionRevealElements.forEach(el => revealObserver.observe(el));
    };

    // --- 3. Testimonial Carousel (Used only on index.html) ---
    const initializeCarousel = () => {
        const carousel = document.querySelector('.testimonial-carousel');
        if (!carousel) return; // Only run if element exists

        const slides = document.querySelectorAll('.testimonial-slide');
        const dots = document.querySelectorAll('.dot');
        let currentSlide = 0;
        const slideInterval = 5000;

        const showSlide = (index) => {
            slides.forEach(slide => slide.classList.remove('active'));
            dots.forEach(dot => dot.classList.remove('active'));

            slides[index].classList.add('active');
            dots[index].classList.add('active');
            currentSlide = index;
        };

        const nextSlide = () => {
            let newIndex = (currentSlide + 1) % slides.length;
            showSlide(newIndex);
        };

        let carouselTimer = setInterval(nextSlide, slideInterval);

        dots.forEach(dot => {
            dot.addEventListener('click', (e) => {
                clearInterval(carouselTimer);
                const index = parseInt(e.target.dataset.slideIndex);
                showSlide(index);
                carouselTimer = setInterval(nextSlide, slideInterval);
            });
        });

        showSlide(currentSlide);
    };

    // --- 4. Initialization ---
    document.getElementById('current-year').textContent = new Date().getFullYear();
    initializeScrollReveal();
    initializeCarousel();
});