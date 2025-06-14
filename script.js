// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    // Mobile detection
    const isMobile = window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
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

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            this.classList.toggle('active');
            navLinks.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        }, menuToggleOptions);
    }

    // Close menu when clicking a link
    navLinksItems.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileMenuBtn) {
                mobileMenuBtn.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        }, menuToggleOptions);
    });

    // Performance-optimized outside click handler
    const handleOutsideClick = throttle(function(e) {
        if (navLinks && mobileMenuBtn && !navLinks.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
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
        threshold: isMobile ? 0.05 : 0.1 // Lower threshold for mobile
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
                // Keep animations on all devices, just lighter on mobile
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

// Navbar scroll effect - throttled for better performance
const handleScroll = throttle(function() {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(11, 11, 15, 0.98)';
        } else {
            navbar.style.background = 'rgba(11, 11, 15, 0.95)';
        }
    }
}, 16); // ~60fps

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

window.addEventListener('scroll', handleScroll, { passive: true });
