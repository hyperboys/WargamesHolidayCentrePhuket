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

// Backend API Configuration
const API_BASE_URL = 'http://localhost:3000'; // Change to production URL when deployed

// Check backend connection on page load
async function checkBackendConnection() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/health`, {
            method: 'GET',
            headers: { 'Accept': 'application/json' }
        });
        
        if (response.ok) {
            console.log('✅ Backend connected successfully');
            return true;
        } else {
            console.warn('⚠️ Backend responded but with error:', response.status);
            return false;
        }
    } catch (error) {
        console.warn('⚠️ Backend not available:', error.message);
        console.log('💡 Make sure backend is running at:', API_BASE_URL);
        console.log('   cd WargamesHolidayCentrePhuket-Backend');
        console.log('   npm run dev');
        return false;
    }
}

// Language Dropdown Handler - will be initialized after DOM loads
let languageBtn, languageMenu, currentFlagImg, languageOptions;

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
    if (languageOptions) {
        languageOptions.forEach(option => {
            option.classList.toggle('active', option.getAttribute('data-lang') === lang);
        });
    }
    
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
    // Check backend connection
    checkBackendConnection();
    
    // Initialize language elements
    languageBtn = document.getElementById('languageBtn');
    languageMenu = document.getElementById('languageMenu');
    currentFlagImg = document.getElementById('currentFlag');
    languageOptions = document.querySelectorAll('.language-option');
    
    // Setup language dropdown
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
    
    // Load saved language
    const savedLang = localStorage.getItem('preferredLanguage');
    if (savedLang) {
        currentLanguage = savedLang;
    } else {
        // Default to English if no preference saved
        currentLanguage = 'en';
    }
    
    // Update language immediately
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
        image: 'image/event/Waterloo.jpg',
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
        image: 'image/event/Normandy.jpg',
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
        image: 'image/event/Agincourt.jpg',
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
        image: 'image/event/GloryOfRome.jpg',
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

let currentEventType = null; // Store current event type
let currentEventDates = { start: null, end: null }; // Store event dates

function openEventModal(eventType) {
    const data = eventData[eventType];
    if (!data) return;

    const lang = currentLanguage;
    currentEventType = eventType; // Store for later use
    
    // Get dates from the event card
    const eventCard = document.querySelector(`[data-event="${eventType}"]`);
    if (eventCard) {
        const eventDateDiv = eventCard.closest('.event-card').querySelector('.event-date');
        if (eventDateDiv) {
            currentEventDates.start = eventDateDiv.getAttribute('data-start');
            currentEventDates.end = eventDateDiv.getAttribute('data-end');
        }
    }
    
    // Update modal image
    const modalImage = document.getElementById('eventModalImage');
    if (modalImage && data.image) {
        modalImage.src = data.image;
        modalImage.alt = data.title[lang];
    }
    
    // Update modal content
    document.getElementById('eventModalTitle').textContent = data.title[lang];
    document.getElementById('eventModalDate').textContent = data.date[lang];
    document.getElementById('eventModalDuration').textContent = data.duration[lang];
    document.getElementById('eventModalPlayers').textContent = data.players[lang];
    document.getElementById('eventModalDescription').textContent = data.description[lang];
    document.getElementById('eventModalHistory').textContent = data.history[lang];
    document.getElementById('eventModalRules').textContent = data.rules[lang];
    
    // Update includes list (highlights in sidebar)
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
    // Setup player management
    const addPlayerBtn = document.getElementById('addPlayerBtn');
    const playersContainer = document.getElementById('playersContainer');
    let playerCount = 0;
    
    // Function to create a new player card
    function createPlayerCard(playerNumber) {
        playerCount++;
        const playerId = `player-${playerCount}`;
        
        const playerCard = document.createElement('div');
        playerCard.className = 'person-card';
        playerCard.setAttribute('data-player-id', playerId);
        
        playerCard.innerHTML = `
            <div class="person-card-header">
                <div>
                    <h4 class="person-card-title">
                        <span data-en="Player ${playerNumber}" data-th="ผู้เล่น ${playerNumber}">Player ${playerNumber}</span>
                    </h4>
                    <span class="person-card-badge" data-en="Required Information" data-th="ข้อมูลที่ต้องกรอก">Required Information</span>
                </div>
                <button type="button" class="btn-remove-person" data-player-id="${playerId}">
                    <span data-en="Remove" data-th="ลบ">Remove</span>
                </button>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label data-en="First Name *" data-th="ชื่อ *">First Name *</label>
                    <input type="text" name="${playerId}_firstName" required 
                        data-placeholder-en="Enter first name" 
                        data-placeholder-th="กรอกชื่อ" 
                        placeholder="Enter first name">
                </div>
                <div class="form-group">
                    <label data-en="Last Name *" data-th="นามสกุล *">Last Name *</label>
                    <input type="text" name="${playerId}_lastName" required 
                        data-placeholder-en="Enter last name" 
                        data-placeholder-th="กรอกนามสกุล" 
                        placeholder="Enter last name">
                </div>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label data-en="Age *" data-th="อายุ *">Age *</label>
                    <input type="number" name="${playerId}_age" min="1" max="120" required 
                        data-placeholder-en="Enter age" 
                        data-placeholder-th="กรอกอายุ" 
                        placeholder="Enter age">
                    <small class="error-message" style="display: none; color: #dc3545; font-size: 0.85rem; margin-top: 5px;"></small>
                </div>
                <div class="form-group">
                    <label data-en="Phone Number" data-th="เบอร์โทรศัพท์">Phone Number</label>
                    <input type="tel" name="${playerId}_phone" 
                        data-placeholder-en="Enter phone number" 
                        data-placeholder-th="กรอกเบอร์โทรศัพท์" 
                        placeholder="Enter phone number">
                    <small class="error-message" style="display: none; color: #dc3545; font-size: 0.85rem; margin-top: 5px;"></small>
                </div>
            </div>
            
            <div class="form-group">
                <label data-en="Email" data-th="อีเมล">Email</label>
                <input type="email" name="${playerId}_email" 
                    data-placeholder-en="Enter email address" 
                    data-placeholder-th="กรอกอีเมล" 
                    placeholder="Enter email address">
                <small class="error-message" style="display: none; color: #dc3545; font-size: 0.85rem; margin-top: 5px;"></small>
            </div>
        `;
        
        return playerCard;
    }
    
    // Add player button handler
    if (addPlayerBtn && playersContainer) {
        addPlayerBtn.addEventListener('click', () => {
            const currentPlayerCount = playersContainer.querySelectorAll('.person-card').length;
            const playerId = currentPlayerCount + 1;
            const playerCard = createPlayerCard(playerId);
            playersContainer.appendChild(playerCard);
            
            // Add validation listeners
            const emailInput = playerCard.querySelector(`input[name="${playerId}_email"]`);
            const phoneInput = playerCard.querySelector(`input[name="${playerId}_phone"]`);
            const ageInput = playerCard.querySelector(`input[name="${playerId}_age"]`);
            const firstNameInput = playerCard.querySelector(`input[name="${playerId}_firstName"]`);
            const lastNameInput = playerCard.querySelector(`input[name="${playerId}_lastName"]`);
            
            if (emailInput) {
                emailInput.addEventListener('blur', function() {
                    validatePlayerEmail(this);
                });
                emailInput.addEventListener('input', function() {
                    clearError(this);
                });
            }
            
            if (phoneInput) {
                phoneInput.addEventListener('blur', function() {
                    validatePlayerPhone(this);
                });
                phoneInput.addEventListener('input', function() {
                    clearError(this);
                });
            }
            
            if (ageInput) {
                ageInput.addEventListener('blur', function() {
                    validatePlayerAge(this);
                });
                ageInput.addEventListener('input', function() {
                    clearError(this);
                });
            }
            
            if (firstNameInput) {
                firstNameInput.addEventListener('blur', function() {
                    validateRequiredField(this);
                });
                firstNameInput.addEventListener('input', function() {
                    clearError(this);
                });
            }
            
            if (lastNameInput) {
                lastNameInput.addEventListener('blur', function() {
                    validateRequiredField(this);
                });
                lastNameInput.addEventListener('input', function() {
                    clearError(this);
                });
            }
            
            // Update language for new card
            updateLanguage();
            
            // Update price when player is added
            updatePriceEstimate();
            
            // Add remove button handler
            const removeBtn = playerCard.querySelector('.btn-remove-person');
            removeBtn.addEventListener('click', function() {
                if (playersContainer.querySelectorAll('.person-card').length > 1) {
                    playerCard.remove();
                    updatePlayerNumbers();
                    // Update price when player is removed
                    updatePriceEstimate();
                } else {
                    alert(currentLanguage === 'en' 
                        ? 'At least one player is required' 
                        : 'ต้องมีผู้เล่นอย่างน้อย 1 คน');
                }
            });
        });
        
        // Add first player by default and show price
        setTimeout(() => {
            addPlayerBtn.click();
            // Update price after player is added
            setTimeout(() => {
                updatePriceEstimate();
            }, 100);
        }, 100);
    }
    
    // Function to update player numbers after removal
    function updatePlayerNumbers() {
        const playerCards = playersContainer.querySelectorAll('.person-card');
        playerCards.forEach((card, index) => {
            const titleSpan = card.querySelector('.person-card-title span');
            const playerNum = index + 1;
            titleSpan.setAttribute('data-en', `Player ${playerNum}`);
            titleSpan.setAttribute('data-th', `ผู้เล่น ${playerNum}`);
            titleSpan.textContent = currentLanguage === 'en' ? `Player ${playerNum}` : `ผู้เล่น ${playerNum}`;
        });
    }
    
    // Handle event-specific registration button
    const eventRegisterBtn = document.getElementById('eventRegisterBtn');
    if (eventRegisterBtn) {
        eventRegisterBtn.addEventListener('click', (e) => {
            e.preventDefault();
            // Get current event data
            const eventTitle = document.getElementById('eventModalTitle')?.textContent;
            const eventDate = document.getElementById('eventModalDate')?.textContent;
            const eventDuration = document.getElementById('eventModalDuration')?.textContent;
            const eventPlayers = document.getElementById('eventModalPlayers')?.textContent;
            
            // Close event modal
            closeEventModal();
            
            // Open booking modal with event info
            openBookingModalWithEvent(eventTitle, eventDate, eventDuration, eventPlayers, currentEventType, currentEventDates);
        });
    }
    
    // Use event delegation for general booking buttons
    document.addEventListener('click', (e) => {
        const button = e.target.closest('.btn-primary, .btn-secondary');
        if (button) {
            const buttonText = button.textContent.trim();
            // Exclude event register button
            if (!button.id || button.id !== 'eventRegisterBtn') {
                if (buttonText.includes('Book Now') || buttonText.includes('จองเลย') || 
                    buttonText.includes('Contact Us') || buttonText.includes('ติดต่อเรา') ||
                    buttonText.includes('Select Package') || buttonText.includes('เลือกแพ็คเกจ')) {
                    e.preventDefault();
                    openBookingModal();
                }
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
    attachBookingFormListener();
    
    // Check-in/Check-out date validation
    const checkInInput = document.getElementById('checkIn');
    const checkOutInput = document.getElementById('checkOut');
    const adultsInput = document.getElementById('adults');
    const childrenInput = document.getElementById('children');
    const packageTypeInput = document.getElementById('packageType');
    const accommodationInput = document.getElementById('accommodation');

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
        
        checkInInput.addEventListener('change', () => {
            updateBookingDuration();
            updatePriceEstimate();
        });
        checkOutInput.addEventListener('change', () => {
            updateBookingDuration();
            updatePriceEstimate();
        });
    }
    
    // Update price estimate when values change
    if (packageTypeInput) {
        packageTypeInput.addEventListener('change', updatePriceEstimate);
    }
    if (accommodationInput) {
        accommodationInput.addEventListener('change', updatePriceEstimate);
    }
    
    // Update price when adults/children change
    if (adultsInput) {
        adultsInput.addEventListener('change', updatePriceEstimate);
    }
    if (childrenInput) {
        childrenInput.addEventListener('change', updatePriceEstimate);
    }
    
    // Update price when companion buttons are clicked
    document.querySelectorAll('.number-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            setTimeout(updatePriceEstimate, 100);
        });
    });
}

function openBookingModal() {
    // Hide event info section for general bookings
    const eventInfoSection = document.getElementById('eventInfoSection');
    if (eventInfoSection) {
        eventInfoSection.style.display = 'none';
    }
    
    // Reset event selection
    const eventSelect = document.getElementById('selectedEvent');
    if (eventSelect) {
        eventSelect.value = '';
        eventSelect.disabled = false;
    }
    
    // Hide duration and price displays
    const durationDisplay = document.getElementById('durationDisplay');
    if (durationDisplay) {
        durationDisplay.style.display = 'none';
    }
    
    bookingModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('checkIn').setAttribute('min', today);
    document.getElementById('checkOut').setAttribute('min', today);
}

// Function to attach form submit listener (can be called multiple times)
function attachBookingFormListener() {
    if (!bookingForm) {
        console.log('❌ Booking form NOT found');
        return;
    }
    
    console.log('✅ Attaching booking form listener');
    
    // Remove existing listener to prevent duplicates
    bookingForm.removeEventListener('submit', handleBookingSubmit);
    
    // Attach new listener
    bookingForm.addEventListener('submit', handleBookingSubmit);
    
    // Also add direct click listener for debugging
    const submitBtn = bookingForm.querySelector('button[type="submit"]');
    if (submitBtn) {
        submitBtn.addEventListener('click', (e) => {
            console.log('🟢 SUBMIT BUTTON CLICKED!');
            console.log('🟢 Form is VALID:', bookingForm.checkValidity());
            
            // If form is valid, manually trigger handleBookingSubmit
            if (bookingForm.checkValidity()) {
                console.log('🟢 Form valid, manually calling handleBookingSubmit...');
                e.preventDefault();
                handleBookingSubmit(e);
            } else {
                // Check for invalid fields
                const invalidFields = Array.from(bookingForm.querySelectorAll('input, select, textarea'))
                    .filter(field => !field.checkValidity() && !field.disabled);
                console.log('❌ Invalid fields:', invalidFields);
            }
        });
    }
    
    console.log('✅ Booking form listener attached successfully');
}

function openBookingModalWithEvent(eventTitle, eventDate, eventDuration, eventPlayers, eventType, eventDates) {
    // Show and populate event info section
    const eventInfoSection = document.getElementById('eventInfoSection');
    if (eventInfoSection) {
        eventInfoSection.style.display = 'block';
        document.getElementById('selectedEventTitle').textContent = eventTitle;
        document.getElementById('selectedEventDate').textContent = eventDate;
        document.getElementById('selectedEventDuration').textContent = eventDuration;
        document.getElementById('selectedEventPlayers').textContent = eventPlayers;
    }
    
    // Pre-select the event and make it readonly
    const eventSelect = document.getElementById('selectedEvent');
    if (eventSelect && eventType) {
        eventSelect.value = eventType;
        eventSelect.disabled = true; // Disable selection when coming from event modal
    }
    
    // Pre-select Campaign Weekend package and make it readonly
    const packageSelect = document.getElementById('packageType');
    if (packageSelect) {
        packageSelect.value = 'campaign-weekend';
        packageSelect.disabled = true; // Disable selection when coming from event modal
    }
    
    // Auto-fill check-in and check-out dates if available
    const checkInInput = document.getElementById('checkIn');
    const checkOutInput = document.getElementById('checkOut');
    
    if (eventDates && eventDates.start && eventDates.end) {
        // Set the date values
        if (checkInInput) {
            checkInInput.value = eventDates.start;
            checkInInput.readOnly = true;
            checkInInput.disabled = true;
            checkInInput.style.backgroundColor = '#f5f5f5';
            checkInInput.style.cursor = 'not-allowed';
            checkInInput.style.pointerEvents = 'none';
        }
        
        if (checkOutInput) {
            checkOutInput.value = eventDates.end;
            checkOutInput.readOnly = true;
            checkOutInput.disabled = true;
            checkOutInput.style.backgroundColor = '#f5f5f5';
            checkOutInput.style.cursor = 'not-allowed';
            checkOutInput.style.pointerEvents = 'none';
        }
        
        // Update booking duration display
        updateBookingDuration();
        
        // Update price estimate after dates are set
        setTimeout(() => {
            updatePriceEstimate();
        }, 200);
        
        // Disable Flatpickr calendars if they exist
        if (window.flatpickrInstances) {
            if (window.flatpickrInstances.checkIn) {
                window.flatpickrInstances.checkIn.destroy();
            }
            if (window.flatpickrInstances.checkOut) {
                window.flatpickrInstances.checkOut.destroy();
            }
        }
    }
    
    // Hide duration and price displays initially
    const durationDisplay = document.getElementById('durationDisplay');
    if (durationDisplay) {
        durationDisplay.style.display = 'none';
    }
    
    bookingModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Re-attach form submit listener when opening modal
    attachBookingFormListener();
    
    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    if (checkInInput) checkInInput.setAttribute('min', today);
    if (checkOutInput) checkOutInput.setAttribute('min', today);
}

function closeBookingModal() {
    // Check if form has data
    if (bookingForm && hasFormData()) {
        const confirmMsg = currentLanguage === 'th'
            ? 'คุณมีข้อมูลที่ยังไม่ได้บันทึก ต้องการปิดหน้าต่างนี้หรือไม่?'
            : 'You have unsaved data. Are you sure you want to close?';
        
        if (!confirm(confirmMsg)) {
            return;
        }
    }
    
    // Reset form and players
    if (bookingForm) {
        bookingForm.reset();
    }
    
    const playersContainer = document.getElementById('playersContainer');
    if (playersContainer) {
        playersContainer.innerHTML = '';
        // Re-add first player
        const addPlayerBtn = document.getElementById('addPlayerBtn');
        if (addPlayerBtn) {
            setTimeout(() => addPlayerBtn.click(), 100);
        }
    }
    
    bookingModal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Check if form has any data entered
function hasFormData() {
    if (!bookingForm) return false;
    
    const formData = new FormData(bookingForm);
    for (let [key, value] of formData.entries()) {
        if (value && value.toString().trim() !== '') {
            // Ignore default values
            if (key === 'adults' && value === '1') continue;
            if (key === 'children' && value === '0') continue;
            if (key === 'accommodation' && value === 'basic') continue;
            return true;
        }
    }
    return false;
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
    // Setup date input formatting
    setupDateInputs();
    
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

// Setup date inputs with Flatpickr
function setupDateInputs() {
    const checkInInput = document.getElementById('checkIn');
    const checkOutInput = document.getElementById('checkOut');
    
    if (!checkInInput || !checkOutInput) return;
    
    // Setup number input buttons for adults and children
    setupNumberInputs();
    
    // Initialize Flatpickr for check-in date
    const checkInPicker = flatpickr(checkInInput, {
        dateFormat: 'd/m/Y',
        minDate: 'today',
        allowInput: true,
        locale: {
            firstDayOfWeek: 1,
            weekdays: {
                shorthand: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
                longhand: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
            },
            months: {
                shorthand: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                longhand: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
            }
        },
        onChange: function(selectedDates, dateStr, instance) {
            // Update check-out minimum date
            if (selectedDates.length > 0) {
                const nextDay = new Date(selectedDates[0]);
                nextDay.setDate(nextDay.getDate() + 1);
                checkOutPicker.set('minDate', nextDay);
            }
            // Update duration and price
            updateBookingDuration();
            updatePriceEstimate();
        },
        onOpen: function() {
            // Prevent opening if input is disabled
            if (checkInInput.disabled) {
                this.close();
                return false;
            }
        }
    });
    
    // Initialize Flatpickr for check-out date
    const checkOutPicker = flatpickr(checkOutInput, {
        dateFormat: 'd/m/Y',
        minDate: 'today',
        allowInput: true,
        locale: {
            firstDayOfWeek: 1,
            weekdays: {
                shorthand: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
                longhand: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
            },
            months: {
                shorthand: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                longhand: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
            }
        },
        onChange: function(selectedDates, dateStr, instance) {
            // Update duration and price
            updateBookingDuration();
            updatePriceEstimate();
        },
        onOpen: function() {
            // Prevent opening if input is disabled
            if (checkOutInput.disabled) {
                this.close();
                return false;
            }
        }
    });
    
    // Store instances globally
    if (!window.flatpickrInstances) {
        window.flatpickrInstances = {};
    }
    window.flatpickrInstances.checkIn = checkInPicker;
    window.flatpickrInstances.checkOut = checkOutPicker;
    
    // Add click prevention for locked dates
    checkInInput.addEventListener('click', function(e) {
        if (this.readOnly) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
    }, true);
    
    checkOutInput.addEventListener('click', function(e) {
        if (this.readOnly) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
    }, true);
}

// Setup number input buttons for adults/children
function setupNumberInputs() {
    const numberBtns = document.querySelectorAll('.number-btn');
    
    numberBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const input = document.getElementById(targetId);
            if (!input) return;
            
            const currentValue = parseInt(input.value) || 0;
            const min = parseInt(input.min) || 0;
            const max = parseInt(input.max) || 100;
            
            if (this.classList.contains('plus')) {
                if (currentValue < max) {
                    input.value = currentValue + 1;
                    updatePriceEstimate();
                }
            } else if (this.classList.contains('minus')) {
                if (currentValue > min) {
                    input.value = currentValue - 1;
                    updatePriceEstimate();
                }
            }
            
            // Update button states
            updateNumberButtonStates(input);
        });
    });
    
    // Initialize button states
    const adultsInput = document.getElementById('adults');
    const childrenInput = document.getElementById('children');
    if (adultsInput) updateNumberButtonStates(adultsInput);
    if (childrenInput) updateNumberButtonStates(childrenInput);
}

// Update number button states (enable/disable based on min/max)
function updateNumberButtonStates(input) {
    const targetId = input.id;
    const currentValue = parseInt(input.value) || 0;
    const min = parseInt(input.min) || 0;
    const max = parseInt(input.max) || 100;
    
    const minusBtn = document.querySelector(`.number-btn.minus[data-target="${targetId}"]`);
    const plusBtn = document.querySelector(`.number-btn.plus[data-target="${targetId}"]`);
    
    if (minusBtn) {
        minusBtn.disabled = currentValue <= min;
    }
    
    if (plusBtn) {
        plusBtn.disabled = currentValue >= max;
    }
}

// Validation helper functions for player information
function validatePlayerEmail(input) {
    const value = input.value.trim();
    if (value && !isValidEmail(value)) {
        showError(input, currentLanguage === 'en' ? 'Please enter a valid email address' : 'กรุณากรอกอีเมลให้ถูกต้อง');
        return false;
    }
    clearError(input);
    return true;
}

function validatePlayerPhone(input) {
    const value = input.value.trim();
    if (value && !isValidPhone(value)) {
        showError(input, currentLanguage === 'en' ? 'Please enter a valid phone number' : 'กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง');
        return false;
    }
    clearError(input);
    return true;
}

function validatePlayerAge(input) {
    const value = parseInt(input.value);
    if (!value || value < 1 || value > 120) {
        showError(input, currentLanguage === 'en' ? 'Age must be between 1 and 120' : 'อายุต้องอยู่ระหว่าง 1 ถึง 120 ปี');
        return false;
    }
    clearError(input);
    return true;
}

function validateRequiredField(input) {
    const value = input.value.trim();
    if (!value) {
        showError(input, currentLanguage === 'en' ? 'This field is required' : 'กรุณากรอกข้อมูลนี้');
        return false;
    }
    clearError(input);
    return true;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    // Allow digits, spaces, hyphens, parentheses, and plus sign
    // Minimum 8 digits
    const phoneRegex = /^[\d\s\-\(\)\+]{8,}$/;
    const digitsOnly = phone.replace(/[^\d]/g, '');
    return phoneRegex.test(phone) && digitsOnly.length >= 8;
}

function showError(input, message) {
    const errorElement = input.parentElement.querySelector('.error-message');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
    input.style.borderColor = '#dc3545';
    input.style.background = '#fff5f5';
}

function clearError(input) {
    const errorElement = input.parentElement.querySelector('.error-message');
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.style.display = 'none';
    }
    input.style.borderColor = '#ddd';
    input.style.background = 'white';
}

// Validate all players before submission
function validateAllPlayers() {
    let isValid = true;
    const playersContainer = document.getElementById('playersContainer');
    if (!playersContainer) return true;
    
    const playerCards = playersContainer.querySelectorAll('.person-card');
    playerCards.forEach((card) => {
        const inputs = card.querySelectorAll('input[required]');
        inputs.forEach(input => {
            if (!validateRequiredField(input)) {
                isValid = false;
            }
        });
        
        // Validate email if provided
        const emailInput = card.querySelector('input[type="email"]');
        if (emailInput && emailInput.value.trim() && !validatePlayerEmail(emailInput)) {
            isValid = false;
        }
        
        // Validate phone if provided
        const phoneInput = card.querySelector('input[type="tel"]');
        if (phoneInput && phoneInput.value.trim() && !validatePlayerPhone(phoneInput)) {
            isValid = false;
        }
        
        // Validate age
        const ageInput = card.querySelector('input[type="number"]');
        if (ageInput && !validatePlayerAge(ageInput)) {
            isValid = false;
        }
    });
    
    if (!isValid) {
        const errorMsg = currentLanguage === 'en' 
            ? 'Please correct the errors in player information' 
            : 'กรุณาแก้ไขข้อผิดพลาดในข้อมูลผู้เล่น';
        alert(errorMsg);
    }
    
    return isValid;
}



// Handle booking form submission
async function handleBookingSubmit(e) {
    e.preventDefault();
    
    console.log('🔵 Form submit triggered'); // Debug log
    
    if (!bookingForm) {
        console.log('❌ bookingForm not found');
        return;
    }
    
    console.log('🔵 Validating form...'); // Debug log
    
    // Validate form
    if (!validateBookingForm()) {
        console.log('❌ Form validation failed');
        return;
    }
    
    console.log('🔵 Validating players...'); // Debug log
    
    // Validate all players
    if (!validateAllPlayers()) {
        console.log('❌ Player validation failed');
        return;
    }
    
    console.log('✅ Validation passed, preparing data...'); // Debug log
    
    console.log('🔵 Getting form data...'); // Debug log
    
    // Get form data
    const formData = new FormData(bookingForm);
    
    console.log('🔵 Parsing dates...'); // Debug log
    
    // Parse dates from dd/mm/yyyy format
    const parseDate = (dateString) => {
        if (!dateString) return null;
        const match = dateString.match(/(\d{2})\/(\d{2})\/(\d{4})/);
        if (!match) return null;
        return new Date(parseInt(match[3]), parseInt(match[2]) - 1, parseInt(match[1]));
    };
    
    // Get dates directly from inputs (in case they are disabled)
    const checkInInput = document.getElementById('checkIn');
    const checkOutInput = document.getElementById('checkOut');
    const checkInValue = checkInInput?.value || formData.get('checkIn');
    const checkOutValue = checkOutInput?.value || formData.get('checkOut');
    
    console.log('🔵 Check-in value:', checkInValue);
    console.log('🔵 Check-out value:', checkOutValue);
    
    const checkInDate = parseDate(checkInValue);
    const checkOutDate = parseDate(checkOutValue);
    
    if (!checkInDate || !checkOutDate) {
        alert(currentLanguage === 'en' 
            ? 'Please enter valid dates in DD/MM/YYYY format' 
            : 'กรุณากรอกวันที่ให้ถูกต้องในรูปแบบ วัน/เดือน/ปี');
        return;
    }
    
    // Calculate nights
    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    
    // Collect player information
    const players = [];
    const playersContainer = document.getElementById('playersContainer');
    if (playersContainer) {
        const playerCards = playersContainer.querySelectorAll('.person-card');
        playerCards.forEach((card, index) => {
            const playerId = card.getAttribute('data-player-id');
            const player = {
                number: index + 1,
                name: `${formData.get(`${playerId}_firstName`)} ${formData.get(`${playerId}_lastName`)}`,
                firstName: formData.get(`${playerId}_firstName`),
                lastName: formData.get(`${playerId}_lastName`),
                age: formData.get(`${playerId}_age`),
                phone: formData.get(`${playerId}_phone`) || '',
                email: formData.get(`${playerId}_email`) || ''
            };
            players.push(player);
        });
    }
    
    // Get disabled field values directly from inputs
    const eventSelect = document.getElementById('selectedEvent');
    const packageSelect = document.getElementById('packageType');
    
    const bookingData = {
        // Main contact
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        country: formData.get('country'),
        // Booking details
        selectedEvent: eventSelect?.value || formData.get('selectedEvent'),
        packageType: packageSelect?.value || formData.get('packageType'),
        checkIn: checkInValue,
        checkOut: checkOutValue,
        nights: nights,
        // Players & Companions
        adults: parseInt(formData.get('adults')) || 0,
        children: parseInt(formData.get('children')) || 0,
        players: players,
        // Accommodation
        accommodation: formData.get('accommodation'),
        extras: formData.getAll('extras'),
        specialRequests: formData.get('specialRequests') || '',
        hearAbout: formData.get('hearAbout') || '',
        language: currentLanguage,
        timestamp: new Date().toISOString()
    };
    
    // Show loading state
    const submitBtn = bookingForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    console.log('🔵 Setting loading state...'); // Debug log
    console.log('🔵 Submit button:', submitBtn); // Debug log
    
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span data-en="⏳ Sending..." data-th="⏳ กำลังส่ง...">${currentLanguage === 'th' ? '⏳ กำลังส่ง...' : '⏳ Sending...'}</span>`;
    
    console.log('🔵 Loading state set, preparing to send...'); // Debug log
    
    try {
        // Log to console for debugging
        console.log('📤 Sending booking request:', bookingData);
        console.log('📤 API URL:', `${API_BASE_URL}/api/booking`); // Debug log
        
        // Send to backend API
        const response = await fetch(`${API_BASE_URL}/api/booking`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(bookingData)
        });
        
        console.log('📥 Response received:', response.status); // Debug log
        
        const result = await response.json();
        
        console.log('📥 Response data:', result); // Debug log
        
        if (!response.ok) {
            throw new Error(result.error || 'Failed to submit booking');
        }
        
        console.log('✅ Booking submitted successfully:', result);
        console.log('✅ Booking submitted successfully:', result);
        
        // Reset form
        bookingForm.reset();
        
        // Reset players container
        if (playersContainer) {
            playersContainer.innerHTML = '';
            const addPlayerBtn = document.getElementById('addPlayerBtn');
            if (addPlayerBtn) {
                setTimeout(() => addPlayerBtn.click(), 100);
            }
        }
        
        // Reset companion counts
        const adultsInput = document.getElementById('adults');
        const childrenInput = document.getElementById('children');
        if (adultsInput) adultsInput.value = 0;
        if (childrenInput) childrenInput.value = 0;
        
        // Re-enable event select if it was disabled
        const eventSelect = document.getElementById('selectedEvent');
        if (eventSelect) {
            eventSelect.disabled = false;
        }
        
        // Hide event info section if visible
        const eventInfoSection = document.getElementById('eventInfoSection');
        if (eventInfoSection) {
            eventInfoSection.style.display = 'none';
        }
        
        // Close booking modal
        closeBookingModal();
        
        // Show success modal
        openSuccessModal();
        
    } catch (error) {
        console.error('❌ Error submitting booking:', error);
        
        // Show user-friendly error message
        let errorMsg;
        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
            errorMsg = currentLanguage === 'th' 
                ? '⚠️ ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้\n\nกรุณาตรวจสอบว่า:\n• Backend server กำลังรันอยู่ที่ http://localhost:3000\n• หรือติดต่อเราโดยตรงที่:\n  📞 +66 (0) 92-721-9803\n  ✉️ info@wargameshc.com'
                : '⚠️ Unable to connect to server\n\nPlease check that:\n• Backend server is running at http://localhost:3000\n• Or contact us directly at:\n  📞 +66 (0) 92-721-9803\n  ✉️ info@wargameshc.com';
        } else {
            errorMsg = currentLanguage === 'th' 
                ? `เกิดข้อผิดพลาด: ${error.message}\n\nกรุณาลองใหม่อีกครั้ง หรือติดต่อเราที่:\n📞 +66 (0) 92-721-9803\n✉️ info@wargameshc.com`
                : `Error: ${error.message}\n\nPlease try again or contact us at:\n📞 +66 (0) 92-721-9803\n✉️ info@wargameshc.com`;
        }
        
        alert(errorMsg);
    } finally {
        // Reset button
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
    }
}

// Validate booking form
function validateBookingForm() {
    const checkInInput = document.getElementById('checkIn');
    const checkOutInput = document.getElementById('checkOut');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    
    // Validate dates
    if (checkInInput?.value && checkOutInput?.value) {
        const checkIn = new Date(checkInInput.value);
        const checkOut = new Date(checkOutInput.value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (checkIn < today) {
            const msg = currentLanguage === 'th' 
                ? 'วันเช็คอินต้องไม่เป็นวันที่ผ่านมาแล้ว'
                : 'Check-in date cannot be in the past';
            alert(msg);
            checkInInput.focus();
            return false;
        }
        
        if (checkOut <= checkIn) {
            const msg = currentLanguage === 'th' 
                ? 'วันเช็คเอาท์ต้องมาหลังวันเช็คอิน'
                : 'Check-out date must be after check-in date';
            alert(msg);
            checkOutInput.focus();
            return false;
        }
    }
    
    // Validate email format
    if (emailInput?.value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailInput.value)) {
            const msg = currentLanguage === 'th' 
                ? 'กรุณากรอกอีเมลให้ถูกต้อง'
                : 'Please enter a valid email address';
            alert(msg);
            emailInput.focus();
            return false;
        }
    }
    
    // Validate phone format
    if (phoneInput?.value) {
        const phoneRegex = /^[\d\s\+\-\(\)]+$/;
        if (!phoneRegex.test(phoneInput.value)) {
            const msg = currentLanguage === 'th' 
                ? 'กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง'
                : 'Please enter a valid phone number';
            alert(msg);
            phoneInput.focus();
            return false;
        }
    }
    
    return true;
}

// Format booking data for email
function formatBookingEmail(data) {
    // Format dates as dd/mm/yyyy
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };
    
    let playersInfo = '';
    if (data.players && data.players.length > 0) {
        playersInfo = '\n⚔️ PLAYERS INFORMATION:\n';
        data.players.forEach((player) => {
            playersInfo += `\n${player.number}. ${player.firstName} ${player.lastName} (Age: ${player.age})\n`;
            if (player.phone) playersInfo += `   Phone: ${player.phone}\n`;
            if (player.email) playersInfo += `   Email: ${player.email}\n`;
        });
    }
    
    return `
🎮 WARGAMES HOLIDAY CENTRE PHUKET
📧 Booking Request

━━━━━━━━━━━━━━━━━━━━━━
👤 MAIN CONTACT INFORMATION
━━━━━━━━━━━━━━━━━━━━━━
Name: ${data.firstName} ${data.lastName}
Email: ${data.email}
Phone: ${data.phone}
Country: ${data.country}

━━━━━━━━━━━━━━━━━━━━━━
📦 BOOKING DETAILS
━━━━━━━━━━━━━━━━━━━━━━
Event: ${data.selectedEvent}
Package Type: ${data.packageType}
Check-in: ${formatDate(data.checkIn)}
Check-out: ${formatDate(data.checkOut)}
Duration: ${data.nights} night(s)

Companions (Non-playing):
- Adults: ${data.adults}
- Children: ${data.children}
Accommodation: ${data.accommodation}
${playersInfo}
✨ Extra Services:
${data.extras.length > 0 ? data.extras.join(', ') : 'None'}

💬 Special Requests:
${data.specialRequests || 'None'}

How they heard about us: ${data.hearAbout || 'Not specified'}

━━━━━━━━━━━━━━━━━━━━━━
Submitted: ${new Date(data.timestamp).toLocaleString()}
Language: ${data.language === 'th' ? 'Thai' : 'English'}
`;
}

// Calculate number of nights and update display
function updateBookingDuration() {
    const checkInInput = document.getElementById('checkIn');
    const checkOutInput = document.getElementById('checkOut');
    
    if (checkInInput?.value && checkOutInput?.value) {
        // Parse dd/mm/yyyy format
        const parseDate = (dateString) => {
            const match = dateString.match(/(\d{2})\/(\d{2})\/(\d{4})/);
            if (!match) return null;
            return new Date(parseInt(match[3]), parseInt(match[2]) - 1, parseInt(match[1]));
        };
        
        const checkIn = parseDate(checkInInput.value);
        const checkOut = parseDate(checkOutInput.value);
        
        if (!checkIn || !checkOut) return;
        
        const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
        
        if (nights > 0) {
            // Display duration to user
            let durationDisplay = document.getElementById('durationDisplay');
            if (!durationDisplay) {
                // Create duration display element if it doesn't exist
                durationDisplay = document.createElement('div');
                durationDisplay.id = 'durationDisplay';
                durationDisplay.className = 'duration-display';
                durationDisplay.style.cssText = 'margin-top: 10px; padding: 12px; background: #f0f7ff; border-left: 4px solid #4f772d; border-radius: 4px;';
                checkOutInput.parentElement.parentElement.appendChild(durationDisplay);
            }
            
            const durationText = currentLanguage === 'th' 
                ? `📅 ระยะเวลา: ${nights} คืน`
                : `📅 Duration: ${nights} night${nights > 1 ? 's' : ''}`;
            
            durationDisplay.innerHTML = `<strong>${durationText}</strong>`;
            durationDisplay.style.display = 'block';
        }
    }
}

// Calculate and display price estimate
function updatePriceEstimate() {
    const checkInInput = document.getElementById('checkIn');
    const checkOutInput = document.getElementById('checkOut');
    const adultsInput = document.getElementById('adults');
    const childrenInput = document.getElementById('children');
    const packageTypeInput = document.getElementById('packageType');
    const accommodationInput = document.getElementById('accommodation');
    
    // Parse dates from DD/MM/YYYY format
    const parseDate = (dateStr) => {
        if (!dateStr) return null;
        const parts = dateStr.split('/');
        if (parts.length === 3) {
            // DD/MM/YYYY -> YYYY-MM-DD
            return new Date(parts[2], parts[1] - 1, parts[0]);
        }
        return new Date(dateStr);
    };
    
    // Get values with defaults
    let nights = 2; // Default 2 nights
    if (checkInInput?.value && checkOutInput?.value) {
        const checkIn = parseDate(checkInInput.value);
        const checkOut = parseDate(checkOutInput.value);
        const calculatedNights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
        if (calculatedNights > 0) {
            nights = calculatedNights;
        }
    }
    
    const adults = parseInt(adultsInput?.value) || 0;
    const children = parseInt(childrenInput?.value) || 0;
    const packageType = packageTypeInput?.value || 'campaign-weekend';
    const accommodation = accommodationInput?.value || 'basic';
    
    // Base prices for players: $200 per player per night (≈ ฿7,000)
    const playerPricePerNight = 7000; // THB per player per night
    
    // Calculate players total
    const playersContainer = document.getElementById('playersContainer');
    const playerCards = playersContainer?.querySelectorAll('.person-card') || [];
    const playerCount = playerCards.length;
    
    // If no players yet (during initialization), assume at least 1 for display
    const displayPlayerCount = playerCount > 0 ? playerCount : 1;
    const playersTotal = displayPlayerCount * nights * playerPricePerNight;
    
    // Calculate adult companions total ($100 per person per night = ฿3,500)
    const companionPricePerNight = 3500; // THB per adult companion per night
    const adultCompanionsTotal = adults * nights * companionPricePerNight;
    
    // Total price (players + adult companions, children not included)
    const totalPrice = playersTotal + adultCompanionsTotal;
    
    // Display price estimate
    let priceDisplay = document.getElementById('priceEstimate');
    if (!priceDisplay) {
        priceDisplay = document.createElement('div');
        priceDisplay.id = 'priceEstimate';
        priceDisplay.className = 'price-estimate';
        priceDisplay.style.cssText = 'margin-top: 2rem; padding: 15px; background: linear-gradient(135deg, #4f772d 0%, #90a955 100%); color: white; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);';
        
        // Find the players form section and append after companions
        const playersSection = playersContainer?.closest('.form-section');
        if (playersSection) {
            playersSection.appendChild(priceDisplay);
        }
    }
    
    // Build price breakdown
    let priceBreakdown = '';
    
    if (currentLanguage === 'th') {
        priceBreakdown = `<div style="margin-bottom: 12px;">
            <strong style="font-size: 1.1em;">💰 รายละเอียดราคา</strong>
        </div>`;
        
        // Package info
        const packageNames = {
            'campaign-weekend': 'Campaign Weekend',
            'own-hosted': 'Own Hosted Weekend',
            'custom': 'Custom Package'
        };
        const nightsText = (!checkInInput?.value || !checkOutInput?.value) 
            ? `${nights} คืน (ประมาณการเริ่มต้น)` 
            : `${nights} คืน`;
        priceBreakdown += `<div style="margin-bottom: 8px; padding-bottom: 8px; border-bottom: 1px solid rgba(255,255,255,0.3);">
            📦 <strong>แพ็คเกจ:</strong> ${packageNames[packageType] || packageType}<br>
            🏠 <strong>ที่พัก:</strong> ${accommodation === 'basic' ? 'Basic' : accommodation === 'superior' ? 'Superior' : 'Deluxe/Hot Spring'}<br>
            🌙 <strong>จำนวนคืน:</strong> ${nightsText}
        </div>`;
        
        // Players breakdown - always show
        priceBreakdown += `<div style="margin-bottom: 6px;">
            ⚔️ <strong>ผู้เล่น ${displayPlayerCount} คน:</strong><br>
            <span style="margin-left: 20px; font-size: 0.95em;">
                ${displayPlayerCount} คน × ${nights} คืน × ฿${playerPricePerNight.toLocaleString('th-TH')} = <strong>฿${playersTotal.toLocaleString('th-TH')}</strong>
            </span>
        </div>`;
        
        // Adult companions breakdown
        if (adults > 0) {
            priceBreakdown += `<div style="margin-bottom: 6px;">
                👨 <strong>ผู้ติดตามผู้ใหญ่ ${adults} คน:</strong><br>
                <span style="margin-left: 20px; font-size: 0.95em;">
                    ${adults} คน × ${nights} คืน × ฿${companionPricePerNight.toLocaleString('th-TH')} = <strong>฿${adultCompanionsTotal.toLocaleString('th-TH')}</strong>
                </span>
            </div>`;
        }
        
        // Children information (no charge, but show count)
        if (children > 0) {
            priceBreakdown += `<div style="margin-bottom: 6px; padding: 8px; background: rgba(255,255,255,0.1); border-radius: 5px;">
                👶 <strong>เด็ก ${children} คน:</strong><br>
                <span style="margin-left: 20px; font-size: 0.9em; opacity: 0.95;">
                    ราคาขึ้นอยู่กับอายุและความจุของห้อง<br>
                    ✓ ได้รับสิ่งอำนวยความสะดวกเหมือนผู้ใหญ่<br>
                    ✓ Kid-friendly tours
                </span>
            </div>`;
        }
        
        // Total
        priceBreakdown += `<div style="margin-top: 12px; padding-top: 12px; border-top: 2px solid rgba(255,255,255,0.5); font-size: 1.15em;">
            <strong>💵 ราคารวมทั้งหมด: ฿${totalPrice.toLocaleString('th-TH')}</strong>
        </div>`;
        
        if (children > 0) {
            priceBreakdown += `<div style="margin-top: 8px; padding: 8px; background: rgba(255,255,255,0.15); border-radius: 5px;">
                <small style="opacity: 0.95; font-size: 0.85em;">
                    📝 <strong>หมายเหตุ:</strong> ราคาสำหรับเด็กจะคำนวณตามอายุและความจุของห้อง<br>
                    (โรงแรมส่วนใหญ่อนุญาต 2-4 คนต่อห้อง)
                </small>
            </div>`;
        }
        
        priceBreakdown += `<div style="margin-top: 10px;">
            <small style="opacity: 0.9; font-size: 0.85em;">
                *ราคานี้เป็นการประมาณการเบื้องต้น ราคาสุดท้ายอาจแตกต่างกันตามบริการเสริมและโปรโมชั่น
            </small>
        </div>`;
    } else {
        // English - Show USD
        const exchangeRate = 35; // 1 USD = 35 THB (approximate)
        const totalPriceUSD = totalPrice / exchangeRate;
        const companionPricePerNightUSD = 100; // $100 per adult companion per night
        const adultCompanionsTotalUSD = adults * nights * companionPricePerNightUSD;
        
        priceBreakdown = `<div style="margin-bottom: 12px; color: #2d3748;">
            <strong style="font-size: 1.1em;">💰 Price Breakdown</strong>
        </div>`;
        
        // Package info
        const packageNames = {
            'campaign-weekend': 'Campaign Weekend',
            'own-hosted': 'Own Hosted Weekend',
            'custom': 'Custom Package'
        };
        const nightsText = (!checkInInput?.value || !checkOutInput?.value) 
            ? `${nights} night${nights > 1 ? 's' : ''} (estimated)` 
            : `${nights} night${nights > 1 ? 's' : ''}`;
        priceBreakdown += `<div style="margin-bottom: 8px; padding-bottom: 8px; border-bottom: 1px solid rgba(0,0,0,0.2); color: #2d3748;">
            📦 <strong>Package:</strong> ${packageNames[packageType] || packageType}<br>
            🏠 <strong>Accommodation:</strong> ${accommodation === 'basic' ? 'Basic' : accommodation === 'superior' ? 'Superior' : 'Deluxe/Hot Spring'}<br>
            🌙 <strong>Nights:</strong> ${nightsText}
        </div>`;
        
        // Players breakdown - always show
        const playerPricePerNightUSD = 200; // $200 per player per night
        const playersTotalUSD = playersTotal / exchangeRate;
        priceBreakdown += `<div style="margin-bottom: 6px; color: #2d3748;">
            ⚔️ <strong>${displayPlayerCount} Player${displayPlayerCount > 1 ? 's' : ''}:</strong><br>
            <span style="margin-left: 20px; font-size: 0.95em;">
                ${displayPlayerCount} × ${nights} night${nights > 1 ? 's' : ''} × $${playerPricePerNightUSD.toFixed(2)} = <strong>$${playersTotalUSD.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</strong>
            </span>
        </div>`;
        
        // Adult companions breakdown
        if (adults > 0) {
            priceBreakdown += `<div style="margin-bottom: 6px; color: #2d3748;">
                👨 <strong>${adults} Adult Companion${adults > 1 ? 's' : ''}:</strong><br>
                <span style="margin-left: 20px; font-size: 0.95em;">
                    ${adults} × ${nights} night${nights > 1 ? 's' : ''} × $${companionPricePerNightUSD.toFixed(2)} = <strong>$${adultCompanionsTotalUSD.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</strong>
                </span>
            </div>`;
        }
        
        // Children information (no charge, but show count)
        if (children > 0) {
            priceBreakdown += `<div style="margin-bottom: 6px; padding: 8px; background: rgba(79, 119, 45, 0.1); border-radius: 5px; color: #2d3748;">
                👶 <strong>${children} Child${children > 1 ? 'ren' : ''}:</strong><br>
                <span style="margin-left: 20px; font-size: 0.9em; opacity: 0.95;">
                    Cheaper rates - depends on age and room capacity<br>
                    ✓ Same inclusions as adults<br>
                    ✓ Kid-friendly tours
                </span>
            </div>`;
        }
        
        // Total
        priceBreakdown += `<div style="margin-top: 12px; padding-top: 12px; border-top: 2px solid rgba(0,0,0,0.3); font-size: 1.15em; color: #1a202c;">
            <strong>💵 Total Price: $${totalPriceUSD.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</strong>
        </div>`;
        
        if (children > 0) {
            priceBreakdown += `<div style="margin-top: 8px; padding: 8px; background: rgba(79, 119, 45, 0.15); border-radius: 5px; color: #2d3748;">
                <small style="opacity: 0.95; font-size: 0.85em;">
                    📝 <strong>Note:</strong> Children's rates will be calculated based on age and room capacity<br>
                    (Most hotels allow 2-4 per room)
                </small>
            </div>`;
        }
        
        priceBreakdown += `<div style="margin-top: 10px; color: #4a5568;">
            <small style="opacity: 0.9; font-size: 0.85em;">
                *This is a preliminary estimate. Final price may vary based on extras and promotions. (≈ ฿${totalPrice.toLocaleString('en-US')})
            </small>
        </div>`;
    }
    
    priceDisplay.innerHTML = priceBreakdown;
    priceDisplay.style.display = 'block';
}

// Print welcome message to console
console.log('%c🎲 Welcome to Wargames Holiday Centre Phuket! 🎲', 
    'color: #4f772d; font-size: 16px; font-weight: bold;');
console.log('%cWebsite designed for gaming enthusiasts', 
    'color: #90a955; font-size: 12px;');
