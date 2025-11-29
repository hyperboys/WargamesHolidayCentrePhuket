// Mobile Navigation Toggle
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

// Language Management
let currentLanguage = 'th'; // Default language

// Language Switch Handler
const langSwitch = document.getElementById('langSwitch');
if (langSwitch) {
    langSwitch.addEventListener('click', () => {
        currentLanguage = currentLanguage === 'th' ? 'en' : 'th';
        updateLanguage();
    });
}

// Update all text content based on current language
function updateLanguage() {
    const lang = currentLanguage;
    
    // Update all elements with data-th and data-en attributes
    document.querySelectorAll('[data-th][data-en]').forEach(element => {
        const text = lang === 'th' ? element.getAttribute('data-th') : element.getAttribute('data-en');
        if (text) {
            element.innerHTML = text;
        }
    });
    
    // Update form placeholders
    document.querySelectorAll('[data-placeholder-th][data-placeholder-en]').forEach(element => {
        const placeholder = lang === 'th' ? element.getAttribute('data-placeholder-th') : element.getAttribute('data-placeholder-en');
        if (placeholder) {
            element.setAttribute('placeholder', placeholder);
        }
    });
    
    // Save language preference
    localStorage.setItem('preferredLanguage', lang);
}

// Load saved language preference on page load
document.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('preferredLanguage');
    if (savedLang) {
        currentLanguage = savedLang;
        updateLanguage();
    }
});

navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    
    // Animate hamburger icon
    const spans = navToggle.querySelectorAll('span');
    if (navMenu.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
    } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
});

// Close mobile menu when clicking on a link
const navLinks = document.querySelectorAll('.nav-menu a');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        const spans = navToggle.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    });
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 70; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Navbar background on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all cards and content sections
const animatedElements = document.querySelectorAll('.event-card, .game-card, .pricing-card, .testimonial-card, .gallery-item');
animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Contact form handling
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form values
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData.entries());
        
        // Show success message (in a real application, you would send this to a server)
        alert('ขอบคุณสำหรับข้อความของคุณ! เราจะติดต่อกลับโดยเร็วที่สุด');
        
        // Reset form
        contactForm.reset();
    });
}

// Gallery lightbox effect (simple version)
const galleryItems = document.querySelectorAll('.gallery-item');
galleryItems.forEach(item => {
    item.style.cursor = 'pointer';
    item.addEventListener('click', () => {
        // In a real application, you would implement a proper lightbox here
        console.log('Gallery item clicked');
    });
});

// Animate hero content on page load
window.addEventListener('load', () => {
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.opacity = '1';
    }
});

// Add parallax effect to hero section
window.addEventListener('scroll', () => {
    const hero = document.querySelector('.hero');
    if (hero) {
        const scrolled = window.pageYOffset;
        const parallax = scrolled * 0.5;
        hero.style.transform = `translateY(${parallax}px)`;
    }
});

// Counter animation for stats (if you add stats section)
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = Math.floor(target);
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start);
        }
    }, 16);
}

// Booking button handlers
const bookingButtons = document.querySelectorAll('.btn-primary, .btn-secondary');
bookingButtons.forEach(button => {
    if (button.textContent.includes('จอง') || button.textContent.includes('เลือก')) {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            alert('ระบบการจองจะเปิดให้บริการเร็วๆ นี้!\nกรุณาติดต่อเราทางโทรศัพท์หรืออีเมลเพื่อจอง');
        });
    }
});

// Add scroll reveal animation
function revealOnScroll() {
    const reveals = document.querySelectorAll('.about-text, .about-image, .section-header');
    
    reveals.forEach(element => {
        const windowHeight = window.innerHeight;
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < windowHeight - elementVisible) {
            element.classList.add('revealed');
        }
    });
}

// Initialize reveal elements
document.addEventListener('DOMContentLoaded', () => {
    const reveals = document.querySelectorAll('.about-text, .about-image, .section-header');
    reveals.forEach(element => {
        element.classList.add('reveal-element');
    });
    
    // Initial check
    revealOnScroll();
});

window.addEventListener('scroll', revealOnScroll);

// Add active state to navigation based on scroll position
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 100) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Print welcome message to console
console.log('%c🎲 Welcome to Wargames Holiday Centre Phuket! 🎲', 
    'color: #4f772d; font-size: 16px; font-weight: bold;');
console.log('%cWebsite designed for gaming enthusiasts', 
    'color: #90a955; font-size: 12px;');
