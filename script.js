// Mobile Navigation Toggle
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

// View All Events Toggle
const viewAllEventsBtn = document.getElementById('viewAllEventsBtn');
let eventsExpanded = false;

if (viewAllEventsBtn) {
    viewAllEventsBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const hiddenEvent = document.getElementById('event-4');
        
        if (!eventsExpanded) {
            hiddenEvent.classList.remove('hidden');
            viewAllEventsBtn.setAttribute('data-en', 'Show Less');
            viewAllEventsBtn.setAttribute('data-th', 'แสดงน้อยลง');
            viewAllEventsBtn.textContent = currentLanguage === 'th' ? 'แสดงน้อยลง' : 'Show Less';
            eventsExpanded = true;
        } else {
            hiddenEvent.classList.add('hidden');
            viewAllEventsBtn.setAttribute('data-en', 'View All Events');
            viewAllEventsBtn.setAttribute('data-th', 'ดูกิจกรรมทั้งหมด');
            viewAllEventsBtn.textContent = currentLanguage === 'th' ? 'ดูกิจกรรมทั้งหมด' : 'View All Events';
            eventsExpanded = false;
        }
    });
}

// Language Management
let currentLanguage = 'en'; // Default language

// Language Dropdown Handler
const languageBtn = document.getElementById('languageBtn');
const languageMenu = document.getElementById('languageMenu');
const currentFlagImg = document.getElementById('currentFlag');
const languageOptions = document.querySelectorAll('.language-option');

if (languageBtn && languageMenu) {
    // Toggle dropdown menu
    languageBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        languageBtn.classList.toggle('active');
        languageMenu.classList.toggle('active');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', () => {
        languageBtn.classList.remove('active');
        languageMenu.classList.remove('active');
    });

    // Language option click handlers
    languageOptions.forEach(option => {
        option.addEventListener('click', (e) => {
            e.stopPropagation();
            const lang = option.getAttribute('data-lang');
            if (currentLanguage !== lang) {
                currentLanguage = lang;
                updateLanguage();
            }
            languageBtn.classList.remove('active');
            languageMenu.classList.remove('active');
        });
    });
}

// Update all text content based on current language
function updateLanguage() {
    const lang = currentLanguage;
    
    // Update current flag icon
    if (currentFlagImg) {
        const flagSrc = lang === 'en' ? 'image/icon/united-kingdom.png' : 'image/icon/thailand-flag.png';
        currentFlagImg.src = flagSrc;
        currentFlagImg.alt = lang === 'en' ? 'English' : 'ไทย';
    }

    // Update active state for language options
    languageOptions.forEach(option => {
        option.classList.toggle('active', option.getAttribute('data-lang') === lang);
    });
    
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
    } else {
        // Default to English if no preference saved
        currentLanguage = 'en';
    }
    // Always update language on page load
    updateLanguage();
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

// Image Slider for Battle Tables
let currentSlideIndex = 1;
showSlide(currentSlideIndex);

function moveSlide(n) {
    showSlide(currentSlideIndex += n);
}

function currentSlide(n) {
    showSlide(currentSlideIndex = n);
}

function showSlide(n) {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    
    if (n > slides.length) { currentSlideIndex = 1; }
    if (n < 1) { currentSlideIndex = slides.length; }
    
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    if (slides[currentSlideIndex - 1]) {
        slides[currentSlideIndex - 1].classList.add('active');
    }
    if (dots[currentSlideIndex - 1]) {
        dots[currentSlideIndex - 1].classList.add('active');
    }
}

// Auto-advance slider every 5 seconds
setInterval(() => {
    moveSlide(1);
}, 5000);

// Gallery Pagination System
let currentGalleryPage = 1;

function initGallery() {
    const pages = document.querySelectorAll('.gallery-page');
    const pagination = document.getElementById('galleryPagination');
    
    if (pages.length > 1) {
        // Create pagination dots
        pages.forEach((_, index) => {
            const dot = document.createElement('span');
            dot.className = 'gallery-dot' + (index === 0 ? ' active' : '');
            dot.onclick = () => goToGalleryPage(index + 1);
            pagination.appendChild(dot);
        });
    }
    
    updateGalleryNav();
}

function moveGalleryPage(direction) {
    const pages = document.querySelectorAll('.gallery-page');
    const newPage = currentGalleryPage + direction;
    
    if (newPage >= 1 && newPage <= pages.length) {
        goToGalleryPage(newPage);
    }
}

function goToGalleryPage(pageNum) {
    const pages = document.querySelectorAll('.gallery-page');
    const dots = document.querySelectorAll('.gallery-dot');
    
    if (pageNum < 1 || pageNum > pages.length) return;
    
    currentGalleryPage = pageNum;
    
    // Update active page
    pages.forEach((page, index) => {
        page.classList.toggle('active', index === pageNum - 1);
    });
    
    // Update active dot
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === pageNum - 1);
    });
    
    updateGalleryNav();
}

function updateGalleryNav() {
    const pages = document.querySelectorAll('.gallery-page');
    const prevBtn = document.querySelector('.gallery-nav-btn.prev');
    const nextBtn = document.querySelector('.gallery-nav-btn.next');
    
    if (prevBtn && nextBtn) {
        prevBtn.disabled = currentGalleryPage === 1;
        nextBtn.disabled = currentGalleryPage === pages.length;
        
        // Hide buttons if only one page
        if (pages.length <= 1) {
            prevBtn.style.display = 'none';
            nextBtn.style.display = 'none';
        }
    }
}

// Initialize gallery on page load
document.addEventListener('DOMContentLoaded', () => {
    initGallery();
});

// Event Modal Data
const eventData = {
    waterloo: {
        title: { en: 'Waterloo Campaign', th: 'Waterloo Campaign' },
        date: { en: '6-10 March 2026', th: '6-10 มีนาคม 2026' },
        duration: { en: '5 Days / 4 Nights', th: '5 วัน 4 คืน' },
        players: { en: '8-12 players', th: '8-12 คน' },
        description: {
            en: 'Join us for an epic recreation of the legendary Waterloo Campaign! This multi-day event will allow you to command armies and make the critical decisions that shaped European history.',
            th: 'มาร่วมกับเราในการจำลองแคมเปญ Waterloo อันเป็นตำนาน! อีเวนต์หลายวันนี้จะให้คุณบัญชาการกองทัพและตัดสินใจสำคัญที่หล่อหลอมประวัติศาสตร์ยุโรป'
        },
        history: {
            en: 'The Waterloo Campaign (June 1815) was Napoleon Bonaparte\'s final campaign. After escaping from Elba, Napoleon raised a new army and marched into Belgium, where he faced the combined forces of the Duke of Wellington and Field Marshal Blücher. The campaign culminated in the decisive Battle of Waterloo on June 18, 1815.',
            th: 'แคมเปญ Waterloo (มิถุนายน 1815) เป็นแคมเปญสุดท้ายของนโปเลียน โบนาปาร์ต หลังจากหลบหนีจากเอลบา นโปเลียนได้ชุมนุมกองทัพใหม่และเดินทัพเข้าเบลเยียม ที่ซึ่งเขาเผชิญหน้ากับกองกำลังรวมของดยุกแห่งเวลลิงตันและจอมพลบลูเชอร์ แคมเปญสิ้นสุดด้วยการรบที่ Waterloo ใน 18 มิถุนายน 1815'
        },
        includes: [
            { en: 'Accommodation for 4 nights', th: 'ที่พักสำหรับ 4 คืน' },
            { en: 'All meals (breakfast, lunch, dinner)', th: 'อาหารทุกมื้อ (อาหารเช้า กลางวัน เย็น)' },
            { en: 'Complete miniature armies and terrain', th: 'กองทัพโมเดลและฉากสมบูรณ์' },
            { en: 'Expert game master guidance', th: 'คำแนะนำจาก Game Master ผู้เชี่ยวชาญ' },
            { en: 'Historical reference materials', th: 'เอกสารอ้างอิงทางประวัติศาสตร์' },
            { en: 'Event certificate and photos', th: 'ใบประกาศนียบัตรและรูปภาพจากอีเวนต์' }
        ],
        rules: { en: 'Black Powder / General de Brigade', th: 'Black Powder / General de Brigade' }
    },
    normandy: {
        title: { en: 'Break-out from Normandy', th: 'Break-out from Normandy' },
        date: { en: '13-16 March 2026', th: '13-16 มีนาคม 2026' },
        duration: { en: '4 Days / 3 Nights', th: '4 วัน 3 คืน' },
        players: { en: '10-16 players', th: '10-16 คน' },
        description: {
            en: 'Experience the intensity of Operation Cobra and the Normandy breakout! Command Allied or German forces in this pivotal WWII campaign that changed the course of the war in Western Europe.',
            th: 'สัมผัสความเข้มข้นของปฏิบัติการโคบราและการยึดนอร์มังดี! บัญชาการกองกำลังฝ่ายสัมพันธมิตรหรือเยอรมันในแคมเปญ WWII สำคัญนี้ที่เปลี่ยนทิศทางสงครามในยุโรปตะวันตก'
        },
        history: {
            en: 'Following D-Day, Allied forces were initially contained in Normandy. Operation Cobra, launched on July 25, 1944, was the American breakout from the Normandy beachhead. The operation shattered German defenses and led to the liberation of France.',
            th: 'หลังจากวันดี-เดย์ กองกำลังสัมพันธมิตรถูกกักไว้ในนอร์มังดีในตอนแรก ปฏิบัติการโคบรา เริ่มเมื่อ 25 กรกฎาคม 1944 เป็นการยึดพื้นที่ของอเมริกาจากหาดนอร์มังดี ปฏิบัติการนี้ทำลายแนวป้องกันของเยอรมันและนำไปสู่การปลดปล่อยฝรั่งเศส'
        },
        includes: [
            { en: 'Accommodation for 3 nights', th: 'ที่พักสำหรับ 3 คืน' },
            { en: 'All meals included', th: 'อาหารทุกมื้อ' },
            { en: 'Massive WWII miniature collection', th: 'คอลเล็กชันโมเดล WWII ขนาดใหญ่' },
            { en: 'Detailed Normandy terrain boards', th: 'กระดานภูมิประเทศนอร์มังดีโดยละเอียด' },
            { en: 'Tank and aircraft models', th: 'โมเดลรถถังและเครื่องบิน' },
            { en: 'Campaign booklet and maps', th: 'หนังสือแคมเปญและแผนที่' }
        ],
        rules: { en: 'Bolt Action / Chain of Command', th: 'Bolt Action / Chain of Command' }
    },
    agincourt: {
        title: { en: 'Battle of Agincourt', th: 'Battle of Agincourt' },
        date: { en: '20-24 March 2026', th: '20-24 มีนาคม 2026' },
        duration: { en: '5 Days / 4 Nights', th: '5 วัน 4 คืน' },
        players: { en: '12-20 players', th: '12-20 คน' },
        description: {
            en: 'Relive one of history\'s most famous battles! The Battle of Agincourt (1415) where Henry V\'s outnumbered English army achieved a stunning victory against French nobility. Command knights, archers, and men-at-arms in this epic medieval showdown.',
            th: 'จำลองหนึ่งในสงครามที่มีชื่อเสียงที่สุดในประวัติศาสตร์! สงคราม Agincourt (1415) ที่กองทัพอังกฤษของเฮนรี่ที่ 5 ซึ่งมีจำนวนน้อยกว่าได้รับชัยชนะอันน่าทึ่งเหนือชนชั้นสูงฝรั่งเศส บัญชาการอัศวิน นักธนู และทหารในการเผชิญหน้ายุคกลางอันยิ่งใหญ่นี้'
        },
        history: {
            en: 'The Battle of Agincourt was fought on October 25, 1415, during the Hundred Years\' War. Despite being heavily outnumbered, the English longbowmen devastated the heavily armored French cavalry and infantry. The battle is famous for the effectiveness of the English longbow against French knights.',
            th: 'สงคราม Agincourt เกิดขึ้นเมื่อวันที่ 25 ตุลาคม 1415 ในช่วงสงครามร้อยปี แม้จะมีกำลังน้อยกว่ามาก นักธนูคันยาวอังกฤษได้ทำลายล้างทหารม้าและทหารราบฝรั่งเศสที่สวมเกราะหนัก สงครามนี้มีชื่อเสียงจากประสิทธิภาพของคันธนูยาวอังกฤษต่ออัศวินฝรั่งเศส'
        },
        includes: [
            { en: 'Accommodation for 4 nights', th: 'ที่พักสำหรับ 4 คืน' },
            { en: 'All medieval-themed meals', th: 'อาหารธีมยุคกลางทุกมื้อ' },
            { en: '1,500+ medieval miniatures', th: 'โมเดลยุคกลางกว่า 1,500 ตัว' },
            { en: 'Authentic Agincourt terrain', th: 'ภูมิประเทศ Agincourt ที่สมจริง' },
            { en: 'Historical costume option', th: 'ตัวเลือกเครื่องแต่งกายยุคกลาง' },
            { en: 'Medieval banquet dinner', th: 'งานเลี้ยงอาหารยุคกลาง' }
        ],
        rules: { en: 'Lion Rampant / Hail Caesar', th: 'Lion Rampant / Hail Caesar' }
    },
    rome: {
        title: { en: 'Glory of Rome 64 AD', th: 'Glory of Rome 64 AD' },
        date: { en: '27-30 March 2026', th: '27-30 มีนาคม 2026' },
        duration: { en: '4 Days / 3 Nights', th: '4 วัน 3 คืน' },
        players: { en: '8-14 players', th: '8-14 คน' },
        description: {
            en: 'Command the legendary Roman legions at the height of their power! Experience ancient warfare with disciplined infantry, cavalry, and siege weapons. Relive the glory days of the Roman Empire in 64 AD.',
            th: 'บัญชาการกองทหารโรมันในยุครุ่งเรือง! สัมผัสสงครามโบราณด้วยทหารราบที่มีวินัย ทหารม้า และอาวุธล้อมเมือง จำลองยุครุ่งเรืองของจักรวรรดิโรมันใน 64 คริสต์ศักราช'
        },
        history: {
            en: '64 AD saw the Roman Empire at its peak under Emperor Nero. The Roman military machine was the most advanced in the world, with professional legions conquering territories from Britain to the Middle East. This period showcases the tactical brilliance and organizational superiority of Roman warfare.',
            th: '64 คริสต์ศักราช จักรวรรดิโรมันอยู่ในจุดสูงสุดภายใต้จักรพรรดิเนโร เครื่องจักรทางทหารของโรมันเป็นระบบที่ทันสมัยที่สุดในโลก ด้วยกองทหารมืออาชีพที่พิชิตดินแดนตั้งแต่บริเตนไปจนถึงตะวันออกกลาง ยุคนี้แสดงให้เห็นความเฉลียวฉลาดทางยุทธวิธีและความเหนือกว่าทางองค์กรของสงครามโรมัน'
        },
        includes: [
            { en: 'Accommodation for 3 nights', th: 'ที่พักสำหรับ 3 คืน' },
            { en: 'All meals with Roman theme', th: 'อาหารทุกมื้อธีมโรมัน' },
            { en: 'Complete Roman & enemy armies', th: 'กองทัพโรมันและกองทัพศัตรูครบชุด' },
            { en: 'Ancient battlefield terrain', th: 'ภูมิประเทศสนามรบโบราณ' },
            { en: 'Legion tactics workshop', th: 'การอบรมยุทธวิธีของกองทหาร' },
            { en: 'Roman military demonstration', th: 'การสาธิตทหารโรมัน' }
        ],
        rules: { en: 'Hail Caesar / Impetus', th: 'Hail Caesar / Impetus' }
    }
};

// Event Modal Management
const eventModal = document.getElementById('eventModal');
const eventModalClose = document.getElementById('eventModalClose');
const eventModalCloseBtn = document.getElementById('eventModalCloseBtn');
const eventModalBtns = document.querySelectorAll('.event-modal-btn');

// Open Event Modal
eventModalBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const eventType = btn.getAttribute('data-event');
        openEventModal(eventType);
    });
});

function openEventModal(eventType) {
    const data = eventData[eventType];
    if (!data) return;

    const lang = currentLanguage;
    
    // Update modal content
    document.getElementById('eventModalTitle').textContent = data.title[lang];
    document.getElementById('eventModalDate').textContent = data.date[lang];
    document.getElementById('eventModalDuration').textContent = data.duration[lang];
    document.getElementById('eventModalPlayers').textContent = data.players[lang];
    document.getElementById('eventModalDescription').textContent = data.description[lang];
    document.getElementById('eventModalHistory').textContent = data.history[lang];
    document.getElementById('eventModalRules').textContent = data.rules[lang];
    
    // Update includes list
    const includesList = document.getElementById('eventModalIncludes');
    includesList.innerHTML = '';
    data.includes.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item[lang];
        includesList.appendChild(li);
    });
    
    // Show modal
    eventModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close Event Modal
function closeEventModal() {
    eventModal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

if (eventModalClose) {
    eventModalClose.addEventListener('click', closeEventModal);
}

if (eventModalCloseBtn) {
    eventModalCloseBtn.addEventListener('click', closeEventModal);
}

// Close event modal when clicking outside
eventModal.addEventListener('click', (e) => {
    if (e.target === eventModal) {
        closeEventModal();
    }
});

// Update Escape key handler to close both modals
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (gameModal.classList.contains('active')) {
            closeGameModal();
        }
        if (eventModal.classList.contains('active')) {
            closeEventModal();
        }
    }
});

// Game Modal Data
const gameData = {
    ancient: {
        title: { en: 'Ancient Warfare', th: 'สงครามสมัยโบราณ' },
        description: {
            en: 'Explore the epic battles of ancient civilizations including Roman legions, Greek phalanxes, Persian armies, and more. Experience the tactical brilliance of commanders like Alexander the Great, Julius Caesar, and Hannibal.',
            th: 'สำรวจสงครามอันยิ่งใหญ่ของอารยธรรมโบราณ รวมถึงกองทัพโรมัน กองพลกรีก กองทัพเปอร์เซีย และอื่นๆ สัมผัสความเฉลียวฉลาดทางยุทธวิธีของแม่ทัพเช่น อเล็กซานเดอร์มหาราช จูเลียส ซีซาร์ และฮันนิบาล'
        },
        rules: [
            { en: 'Hail Caesar', th: 'Hail Caesar' },
            { en: 'Impetus', th: 'Impetus' },
            { en: 'DBMM (De Bellis Magistrorum Militum)', th: 'DBMM (De Bellis Magistrorum Militum)' }
        ],
        collection: {
            en: 'Over 3,000 beautifully painted miniatures representing various ancient armies from 3000 BC to 476 AD.',
            th: 'โมเดลทหารที่ทาสีอย่างสวยงามกว่า 3,000 ตัว แทนกองทัพโบราณต่างๆ ตั้งแต่ 3000 ปีก่อนคริสตกาลถึง 476 คริสต์ศักราช'
        },
        scenarios: [
            { en: 'Battle of Gaugamela (331 BC)', th: 'สงครามเกากาเมลา (331 ปีก่อนคริสตกาล)' },
            { en: 'Cannae - Hannibal vs Rome', th: 'คานนาอี - ฮันนิบาล ปะทะโรม' },
            { en: 'Thermopylae - Spartans Last Stand', th: 'เธอร์โมไพลี - การยืนหยัดครั้งสุดท้ายของสปาร์ตัน' }
        ]
    },
    medieval: {
        title: { en: 'Medieval Warfare', th: 'สงครามยุคกลาง' },
        description: {
            en: 'Journey through the age of knights, castles, and crusades. Command mighty armies featuring armored cavalry, archers, and siege engines in battles that shaped medieval Europe and beyond.',
            th: 'เดินทางผ่านยุคของอัศวิน ปราสาท และสงครามครูเสด บัญชาการกองทัพอันทรงพลังที่มีทหารม้าเกราะเหล็ก นักธนู และเครื่องล้อมปราสาท ในสงครามที่หล่อหลอมยุโรปยุคกลาง'
        },
        rules: [
            { en: 'Lion Rampant', th: 'Lion Rampant' },
            { en: 'Hail Caesar (Medieval Variant)', th: 'Hail Caesar (Medieval Variant)' },
            { en: 'Sword & Spear', th: 'Sword & Spear' }
        ],
        collection: {
            en: 'Extensive collection of 2,500+ medieval miniatures covering the period from 500 AD to 1500 AD.',
            th: 'คอลเล็กชันโมเดลยุคกลางที่ครอบคลุมกว่า 2,500 ตัว ครอบคลุมช่วงเวลาตั้งแต่ 500 ถึง 1500 คริสต์ศักราช'
        },
        scenarios: [
            { en: 'Hastings 1066 - Norman Conquest', th: 'เฮสติงส์ 1066 - การยึดครองของนอร์แมน' },
            { en: 'Agincourt 1415', th: 'อาฌินคูร์ 1415' },
            { en: 'Crusader Sieges', th: 'การล้อมปราสาทในสมัยครูเสด' }
        ]
    },
    renaissance: {
        title: { en: 'Renaissance Period', th: 'ยุคฟื้นฟูศิลปวิทยา' },
        description: {
            en: 'The age of pike and shot! Experience the transformation of warfare with the introduction of gunpowder weapons alongside traditional pike formations.',
            th: 'ยุคแห่งหอกและปืน! สัมผัสการเปลี่ยนแปลงของสงครามด้วยการนำอาวุธดินปืนมาใช้ควบคู่ไปกับรูปแบบการรบด้วยหอกแบบดั้งเดิม'
        },
        rules: [
            { en: 'Pike & Shotte', th: 'Pike & Shotte' },
            { en: 'Tercios', th: 'Tercios' },
            { en: 'For King and Parliament', th: 'For King and Parliament' }
        ],
        collection: {
            en: '1,800+ miniatures featuring Spanish Tercios, Swiss Pike, and early musket troops.',
            th: 'โมเดลกว่า 1,800 ตัว ประกอบด้วย Spanish Tercios, Swiss Pike และทหารปืนสั้นยุคแรก'
        },
        scenarios: [
            { en: 'Battle of Pavia 1525', th: 'สงครามปาเวีย 1525' },
            { en: 'Dutch Revolt Campaigns', th: 'แคมเปญการกบฏของดัตช์' },
            { en: 'Italian Wars', th: 'สงครามอิตาลี' }
        ]
    },
    syw: {
        title: { en: "Seven Years' War", th: 'สงครามเจ็ดปี' },
        description: {
            en: "The Seven Years' War (1756-1763) was a global conflict involving most of the great powers. Experience linear warfare at its finest with beautifully uniformed armies.",
            th: 'สงครามเจ็ดปี (1756-1763) เป็นความขัดแย้งระดับโลกที่มีมหาอำนาจส่วนใหญ่เข้าร่วม สัมผัสสงครามแบบเส้นตรงที่ดีที่สุดพร้อมกองทัพที่มีเครื่องแบบสวยงาม'
        },
        rules: [
            { en: 'Black Powder', th: 'Black Powder' },
            { en: 'Maurice', th: 'Maurice' },
            { en: 'Warfare in the Age of Reason', th: 'Warfare in the Age of Reason' }
        ],
        collection: {
            en: '2,200+ miniatures including Prussian, Austrian, French, and British forces.',
            th: 'โมเดลกว่า 2,200 ตัว รวมทั้งกองกำลังปรัสเซีย ออสเตรีย ฝรั่งเศส และอังกฤษ'
        },
        scenarios: [
            { en: 'Battle of Rossbach 1757', th: 'สงครามรอสบัค 1757' },
            { en: 'Leuthen - Frederick the Great', th: 'ลอยเทิน - เฟรเดอริกมหาราช' },
            { en: 'Battle of Minden', th: 'สงครามมินเดน' }
        ]
    },
    napoleon: {
        title: { en: 'Napoleonic Wars', th: 'สงครามยุคนโปเลียน' },
        description: {
            en: 'Recreate the epic campaigns of Napoleon Bonaparte! From the pyramids of Egypt to the frozen steppes of Russia, command armies across all European theaters.',
            th: 'จำลองแคมเปญอันยิ่งใหญ่ของนโปเลียน โบนาปาร์ต! ตั้งแต่พีระมิดแห่งอียิปต์ไปจนถึงที่ราบเยือกแข็งของรัสเซีย บัญชาการกองทัพทั่วทุกสมรภูมิในยุโรป'
        },
        rules: [
            { en: 'Black Powder', th: 'Black Powder' },
            { en: 'General de Brigade', th: 'General de Brigade' },
            { en: 'Napoleon at War', th: 'Napoleon at War' }
        ],
        collection: {
            en: 'Our largest collection! Over 5,000 miniatures representing French, British, Russian, Austrian, and Prussian armies.',
            th: 'คอลเล็กชันที่ใหญ่ที่สุดของเรา! โมเดลกว่า 5,000 ตัว แทนกองทัพฝรั่งเศส อังกฤษ รัสเซีย ออสเตรีย และปรัสเซีย'
        },
        scenarios: [
            { en: 'Waterloo 1815', th: 'วอเตอร์ลู 1815' },
            { en: 'Austerlitz - The Battle of Three Emperors', th: 'ออสเตอร์ลิทซ์ - สงครามแห่งสามจักรพรรดิ' },
            { en: 'Borodino - Invasion of Russia', th: 'โบโรดิโน - การบุกรัสเซีย' }
        ]
    },
    acw: {
        title: { en: 'American Civil War', th: 'สงครามกลางเมืองอเมริกา' },
        description: {
            en: 'Fight the battles that divided a nation! Command Union or Confederate forces in this pivotal conflict that transformed American history.',
            th: 'สู้รบในสงครามที่แบ่งแยกประเทศ! บัญชาการกองกำลังสหภาพหรือสมาพันธรัฐในความขัดแย้งที่สำคัญนี้ที่เปลี่ยนประวัติศาสตร์อเมริกา'
        },
        rules: [
            { en: 'Black Powder - Glory Hallelujah!', th: 'Black Powder - Glory Hallelujah!' },
            { en: 'Fire and Fury', th: 'Fire and Fury' },
            { en: 'Longstreet', th: 'Longstreet' }
        ],
        collection: {
            en: '3,500+ miniatures covering both Union and Confederate armies, including cavalry and artillery.',
            th: 'โมเดลกว่า 3,500 ตัว ครอบคลุมทั้งกองทัพสหภาพและสมาพันธรัฐ รวมทั้งทหารม้าและปืนใหญ่'
        },
        scenarios: [
            { en: 'Gettysburg - The High Water Mark', th: 'เก็ตตีสเบิร์ก - จุดสูงสุดของสมาพันธรัฐ' },
            { en: 'Battle of Antietam', th: 'สงครามแอนทีแทม' },
            { en: "Pickett's Charge", th: 'การโจมตีของพิคเก็ตต์' }
        ]
    },
    ww2: {
        title: { en: 'World War II', th: 'สงครามโลกครั้งที่ 2' },
        description: {
            en: 'The largest conflict in human history! Command armies from all major powers across European, Pacific, and African theaters with tanks, aircraft, and infantry.',
            th: 'ความขัดแย้งที่ยิ่งใหญ่ที่สุดในประวัติศาสตร์มนุษยชาติ! บัญชาการกองทัพจากมหาอำนาจหลักทั้งหมดทั่วสมรภูมิยุโรป แปซิฟิก และแอฟริกา พร้อมรถถัง เครื่องบิน และทหารราบ'
        },
        rules: [
            { en: 'Bolt Action', th: 'Bolt Action' },
            { en: 'Flames of War', th: 'Flames of War' },
            { en: 'Chain of Command', th: 'Chain of Command' }
        ],
        collection: {
            en: 'Massive collection of 6,000+ miniatures including German, American, British, Soviet, and Japanese forces, plus vehicles and aircraft.',
            th: 'คอลเล็กชันขนาดใหญ่กว่า 6,000 ชิ้น รวมทั้งกองกำลังเยอรมัน อเมริกัน อังกฤษ โซเวียต และญี่ปุ่น บวกยานพาหนะและเครื่องบิน'
        },
        scenarios: [
            { en: 'D-Day Normandy Landings', th: 'การยกพลขึ้นบกนอร์มังดี วันดีเดย์' },
            { en: 'Battle of Stalingrad', th: 'สงครามสตาลินกราด' },
            { en: 'El Alamein - Desert War', th: 'เอลอะลาเมน - สงครามทะเลทราย' }
        ]
    },
    dnd: {
        title: { en: 'Dungeons & Dragons', th: 'Dungeons & Dragons' },
        description: {
            en: 'Enter a world of fantasy and adventure! Create your character and embark on epic quests with magic, monsters, and treasure in the ultimate tabletop roleplaying game.',
            th: 'เข้าสู่โลกแห่งแฟนตาซีและการผจญภัย! สร้างตัวละครของคุณและเริ่มต้นภารกิจอันยิ่งใหญ่พร้อมเวทมนตร์ สัตว์ประหลาด และสมบัติในเกมสวมบทบาทบนโต๊ะที่ดีที่สุด'
        },
        rules: [
            { en: 'D&D 5th Edition', th: 'D&D 5th Edition' },
            { en: 'Pathfinder', th: 'Pathfinder' },
            { en: 'Adventure League', th: 'Adventure League' }
        ],
        collection: {
            en: 'Extensive miniature collection, terrain pieces, dungeons, and accessories for immersive fantasy gaming.',
            th: 'คอลเล็กชันโมเดลที่หลากหลาย ชิ้นส่วนภูมิประเทศ คุกใต้ดิน และอุปกรณ์เสริมสำหรับการเล่นเกมแฟนตาซีที่สมจริง'
        },
        scenarios: [
            { en: 'Classic Adventure Modules', th: 'โมดูลการผจญภัยคลาสสิก' },
            { en: 'Custom Campaigns', th: 'แคมเปญที่กำหนดเอง' },
            { en: 'One-Shot Adventures', th: 'การผจญภัยแบบเล่นจบในครั้งเดียว' }
        ]
    }
};

// Game Modal Management
const gameModal = document.getElementById('gameModal');
const modalClose = document.getElementById('modalClose');
const modalCloseBtn = document.getElementById('modalCloseBtn');
const gameModalBtns = document.querySelectorAll('.game-modal-btn');

// Open Modal
gameModalBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const gameType = btn.getAttribute('data-game');
        openGameModal(gameType);
    });
});

function openGameModal(gameType) {
    const data = gameData[gameType];
    if (!data) return;

    const lang = currentLanguage;
    
    // Update modal content
    document.getElementById('modalTitle').textContent = data.title[lang];
    document.getElementById('modalDescription').textContent = data.description[lang];
    document.getElementById('modalCollection').textContent = data.collection[lang];
    
    // Update rules list
    const rulesList = document.getElementById('modalRules');
    rulesList.innerHTML = '';
    data.rules.forEach(rule => {
        const li = document.createElement('li');
        li.textContent = rule[lang];
        rulesList.appendChild(li);
    });
    
    // Update scenarios list
    const scenariosList = document.getElementById('modalScenarios');
    scenariosList.innerHTML = '';
    data.scenarios.forEach(scenario => {
        const li = document.createElement('li');
        li.textContent = scenario[lang];
        scenariosList.appendChild(li);
    });
    
    // Show modal
    gameModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close Modal
function closeGameModal() {
    gameModal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

if (modalClose) {
    modalClose.addEventListener('click', closeGameModal);
}

if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeGameModal);
}

// Close modal when clicking outside
gameModal.addEventListener('click', (e) => {
    if (e.target === gameModal) {
        closeGameModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && gameModal.classList.contains('active')) {
        closeGameModal();
    }
});

// Scroll to Top Button
const scrollToTopBtn = document.getElementById('scrollToTop');

if (scrollToTopBtn) {
    // Show/hide button based on scroll position
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.classList.add('visible');
        } else {
            scrollToTopBtn.classList.remove('visible');
        }
    });

    // Scroll to top when clicked
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Booking Modal Management
let bookingModal, bookingModalClose, bookingModalCancel, bookingForm, successModal, successModalClose;

// Initialize booking modal after DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    bookingModal = document.getElementById('bookingModal');
    bookingModalClose = document.getElementById('bookingModalClose');
    bookingModalCancel = document.getElementById('bookingModalCancel');
    bookingForm = document.getElementById('bookingForm');
    successModal = document.getElementById('successModal');
    successModalClose = document.getElementById('successModalClose');
    
    // Setup booking modal event listeners
    setupBookingModal();
});

// Setup booking modal
function setupBookingModal() {
    // Use event delegation for booking buttons
    document.addEventListener('click', (e) => {
        const button = e.target.closest('.btn-primary, .btn-secondary');
        if (button) {
            const buttonText = button.textContent.trim();
            if (buttonText.includes('Book Now') || buttonText.includes('จองเลย') || 
                buttonText.includes('Contact Us') || buttonText.includes('ติดต่อเรา') ||
                buttonText.includes('Select Package') || buttonText.includes('เลือกแพ็คเกจ')) {
                e.preventDefault();
                openBookingModal();
            }
        }
    });
    
    // Close booking modal
    if (bookingModalClose) {
        bookingModalClose.addEventListener('click', closeBookingModal);
    }

    if (bookingModalCancel) {
        bookingModalCancel.addEventListener('click', closeBookingModal);
    }

    // Close success modal
    if (successModalClose) {
        successModalClose.addEventListener('click', () => {
            closeSuccessModal();
            closeBookingModal();
        });
    }

    // Close modals when clicking outside
    bookingModal?.addEventListener('click', (e) => {
        if (e.target === bookingModal) {
            closeBookingModal();
        }
    });

    successModal?.addEventListener('click', (e) => {
        if (e.target === successModal) {
            closeSuccessModal();
            closeBookingModal();
        }
    });
    
    // Setup form submission
    if (bookingForm) {
        bookingForm.addEventListener('submit', handleBookingSubmit);
    }
    
    // Check-in/Check-out date validation
    const checkInInput = document.getElementById('checkIn');
    const checkOutInput = document.getElementById('checkOut');

    if (checkInInput && checkOutInput) {
        checkInInput.addEventListener('change', () => {
            const checkInDate = new Date(checkInInput.value);
            const minCheckOut = new Date(checkInDate);
            minCheckOut.setDate(minCheckOut.getDate() + 1);
            
            checkOutInput.setAttribute('min', minCheckOut.toISOString().split('T')[0]);
            
            // If check-out is before check-in, clear it
            if (checkOutInput.value && new Date(checkOutInput.value) <= checkInDate) {
                checkOutInput.value = '';
            }
        });
        
        checkInInput.addEventListener('change', updateBookingDuration);
        checkOutInput.addEventListener('change', updateBookingDuration);
    }
}

function openBookingModal() {
    bookingModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('checkIn').setAttribute('min', today);
    document.getElementById('checkOut').setAttribute('min', today);
}

function closeBookingModal() {
    bookingModal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function openSuccessModal() {
    successModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeSuccessModal() {
    successModal.classList.remove('active');
    document.body.style.overflow = 'auto';
}



// Setup Escape key handler after DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const gameModal = document.getElementById('gameModal');
            const eventModal = document.getElementById('eventModal');
            
            if (gameModal?.classList.contains('active')) {
                closeGameModal();
            }
            if (eventModal?.classList.contains('active')) {
                closeEventModal();
            }
            if (bookingModal?.classList.contains('active')) {
                closeBookingModal();
            }
            if (successModal?.classList.contains('active')) {
                closeSuccessModal();
            }
        }
    });
});



// Handle booking form submission
async function handleBookingSubmit(e) {
    e.preventDefault();
    
    if (!bookingForm) return;
        
        // Get form data
        const formData = new FormData(bookingForm);
        const bookingData = {
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            country: formData.get('country'),
            packageType: formData.get('packageType'),
            checkIn: formData.get('checkIn'),
            checkOut: formData.get('checkOut'),
            adults: formData.get('adults'),
            children: formData.get('children'),
            accommodation: formData.get('accommodation'),
            extras: formData.getAll('extras'),
            specialRequests: formData.get('specialRequests'),
            hearAbout: formData.get('hearAbout'),
            language: currentLanguage,
            timestamp: new Date().toISOString()
        };
        
        // Log to console (in production, send to server)
        console.log('Booking Request:', bookingData);
        
        // Show loading state
        const submitBtn = bookingForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span data-en="⏳ Sending..." data-th="⏳ กำลังส่ง...">⏳ กำลังส่ง...</span>';
        
        // Simulate API call (replace with actual API call in production)
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Reset button
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        
        // Reset form
        bookingForm.reset();
        
        // Show success modal
        openSuccessModal();
        
        // In production, you would send this data to your server:
        /*
        try {
            const response = await fetch('/api/bookings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bookingData)
            });
            
            if (response.ok) {
                openSuccessModal();
                bookingForm.reset();
            } else {
                alert('Error submitting booking. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error submitting booking. Please try again.');
        }
        */
}

// Calculate number of nights and update display
function updateBookingDuration() {
    const checkInInput = document.getElementById('checkIn');
    const checkOutInput = document.getElementById('checkOut');
    
    if (checkInInput?.value && checkOutInput?.value) {
        const checkIn = new Date(checkInInput.value);
        const checkOut = new Date(checkOutInput.value);
        const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
        
        if (nights > 0) {
            console.log(`Booking duration: ${nights} night(s)`);
            // You can display this to the user if needed
        }
    }
}

// Print welcome message to console
console.log('%c🎲 Welcome to Wargames Holiday Centre Phuket! 🎲', 
    'color: #4f772d; font-size: 16px; font-weight: bold;');
console.log('%cWebsite designed for gaming enthusiasts', 
    'color: #90a955; font-size: 12px;');
