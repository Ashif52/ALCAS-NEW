// ========================================
// ALCAS FOR BLUEFIN INDIA - PROPOSAL PAGE
// ========================================

// Splash Screen
window.addEventListener('load', () => {
    const splashScreen = document.getElementById('splashScreen');
    setTimeout(() => {
        splashScreen.classList.add('hidden');
    }, 3000); // Show for 3 seconds
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });

            // Close mobile menu if open
            const navMenu = document.getElementById('navMenu');
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
            }
        }
    });
});

// Mobile navigation toggle
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

if (navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
}

// Active navigation link on scroll
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

function highlightNavigation() {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', highlightNavigation);

// Reveal elements on scroll
const revealElements = document.querySelectorAll('.reveal');

function revealOnScroll() {
    const windowHeight = window.innerHeight;
    const revealPoint = 100;

    revealElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;

        if (elementTop < windowHeight - revealPoint) {
            element.classList.add('active');
        }
    });
}

window.addEventListener('scroll', revealOnScroll);
// Initial check
revealOnScroll();

// Header background on scroll
const header = document.getElementById('header');

function updateHeader() {
    if (window.scrollY > 50) {
        header.style.background = 'rgba(230, 81, 0, 0.98)';
        header.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.2)';
    } else {
        header.style.background = 'rgba(230, 81, 0, 0.95)';
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    }
}

window.addEventListener('scroll', updateHeader);

// Contact form submission
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // Get form data
        const formData = new FormData(contactForm);

        // Show success message (you can replace this with actual form submission)
        alert('Thank you for your message! We will get back to you soon.');

        // Reset form
        contactForm.reset();
    });
}

// Video autoplay fix for mobile
const heroVideo = document.querySelector('.hero-video');

if (heroVideo) {
    // Ensure video plays on mobile
    heroVideo.play().catch(error => {
        console.log('Video autoplay prevented:', error);
    });

    // Replay video when it ends
    heroVideo.addEventListener('ended', function () {
        this.currentTime = 0;
        this.play();
    });
}

// Lazy loading for images
const images = document.querySelectorAll('img');

const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.src;
            img.classList.add('loaded');
            observer.unobserve(img);
        }
    });
});

images.forEach(img => {
    imageObserver.observe(img);
});

// Scroll to top button (optional enhancement)
function createScrollToTop() {
    const scrollBtn = document.createElement('button');
    scrollBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollBtn.className = 'scroll-to-top';
    scrollBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: linear-gradient(135deg, #FFD54F 0%, #FFB300 100%);
        border: none;
        border-radius: 50%;
        color: #2C3E50;
        font-size: 1.2rem;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 999;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
    `;

    document.body.appendChild(scrollBtn);

    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            scrollBtn.style.opacity = '1';
            scrollBtn.style.visibility = 'visible';
        } else {
            scrollBtn.style.opacity = '0';
            scrollBtn.style.visibility = 'hidden';
        }
    });

    scrollBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    scrollBtn.addEventListener('mouseenter', () => {
        scrollBtn.style.transform = 'translateY(-5px)';
        scrollBtn.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.3)';
    });

    scrollBtn.addEventListener('mouseleave', () => {
        scrollBtn.style.transform = 'translateY(0)';
        scrollBtn.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.2)';
    });
}

// Initialize scroll to top button
createScrollToTop();

// Add animation to stats on scroll
const statBoxes = document.querySelectorAll('.stat-box h4');

function animateStats() {
    statBoxes.forEach(stat => {
        const finalValue = stat.textContent;
        const isInView = stat.getBoundingClientRect().top < window.innerHeight;

        if (isInView && !stat.classList.contains('animated')) {
            stat.classList.add('animated');

            // Extract number from text
            const match = finalValue.match(/\d+/);
            if (match) {
                const number = parseInt(match[0]);
                const duration = 2000;
                const increment = number / (duration / 16);
                let current = 0;

                const timer = setInterval(() => {
                    current += increment;
                    if (current >= number) {
                        stat.textContent = finalValue;
                        clearInterval(timer);
                    } else {
                        stat.textContent = Math.floor(current) + (finalValue.includes('+') ? '+' : '') + (finalValue.includes('%') ? '%' : '');
                    }
                }, 16);
            }
        }
    });
}

window.addEventListener('scroll', animateStats);

// Initialize
console.log('The Bluefin India - Landing Page Loaded Successfully');
