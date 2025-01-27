// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    // Throttle function for performance
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }

    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const navLinksItems = document.querySelectorAll('.nav-link');

    // Passive event listeners for better performance
    const menuToggleOptions = { passive: true };

    mobileMenuBtn.addEventListener('click', function() {
        this.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    }, menuToggleOptions);

    // Close menu when clicking a link
    navLinksItems.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuBtn.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.classList.remove('menu-open');
        }, menuToggleOptions);
    });

    // Performance-optimized outside click handler
    const handleOutsideClick = throttle(function(e) {
        if (!navLinks.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
            mobileMenuBtn.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    }, 200);

    document.addEventListener('click', handleOutsideClick, menuToggleOptions);

    // Smooth scrolling for navigation links
    const smoothScrollOptions = {
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest'
    };

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView(smoothScrollOptions);
            }
        }, { passive: false });
    });

    // Add animation to elements when they come into view
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.animate-on-scroll').forEach((element) => {
        observer.observe(element);
    });

    // Intersection Observer for lazy loading and animations
    const lazyLoadObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const lazyElement = entry.target;
                lazyElement.classList.add('animate__animated', 'animate__fadeIn');
                observer.unobserve(lazyElement);
            }
        });
    }, observerOptions);

    // Apply lazy loading to sections
    document.querySelectorAll('section').forEach(section => {
        lazyLoadObserver.observe(section);
    });
});

// Navbar scroll effect
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(17, 24, 39, 0.98)';
    } else {
        navbar.style.background = 'rgba(17, 24, 39, 0.95)';
    }
});

// Form submission
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        // Add your form submission logic here
        alert('Thank you for your message! I will get back to you soon.');
        contactForm.reset();
    });
}
