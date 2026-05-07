/* ========================================
   FAROOQ & SONS — JavaScript
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ========== MOBILE MENU ==========
    const hamburger = document.getElementById('hamburger');
    const nav = document.getElementById('nav');
    const navLinks = document.querySelectorAll('.nav-link');
    let overlay = document.createElement('div');
    overlay.classList.add('nav-overlay');
    document.body.appendChild(overlay);

    function toggleMenu() {
        hamburger.classList.toggle('active');
        nav.classList.toggle('open');
        overlay.classList.toggle('active');
        document.body.style.overflow = nav.classList.contains('open') ? 'hidden' : '';
    }

    hamburger.addEventListener('click', toggleMenu);
    overlay.addEventListener('click', toggleMenu);

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (nav.classList.contains('open')) {
                toggleMenu();
            }
        });
    });

    // ========== STICKY HEADER ==========
    const header = document.getElementById('header');

    function handleScroll() {
        if (window.scrollY > 80) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    // ========== ACTIVE NAV LINK ON SCROLL ==========
    const sections = document.querySelectorAll('section[id]');

    function updateActiveNav() {
        const scrollPos = window.scrollY + 150;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollPos >= top && scrollPos < top + height) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav);

    // ========== HERO PARTICLES ==========
    const particlesContainer = document.getElementById('heroParticles');

    function createParticles() {
        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDuration = (Math.random() * 10 + 8) + 's';
            particle.style.animationDelay = (Math.random() * 10) + 's';
            particle.style.width = (Math.random() * 3 + 1) + 'px';
            particle.style.height = particle.style.width;
            particlesContainer.appendChild(particle);
        }
    }

    createParticles();

    // ========== COUNTER ANIMATION ==========
    const statNumbers = document.querySelectorAll('.stat-number');
    let countersAnimated = false;

    function animateCounters() {
        if (countersAnimated) return;

        const heroStats = document.querySelector('.hero-stats');
        if (!heroStats) return;

        const rect = heroStats.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            countersAnimated = true;

            statNumbers.forEach(num => {
                const target = parseInt(num.getAttribute('data-count'));
                const duration = 2000;
                const step = target / (duration / 16);
                let current = 0;

                const timer = setInterval(() => {
                    current += step;
                    if (current >= target) {
                        current = target;
                        clearInterval(timer);
                    }
                    num.textContent = Math.floor(current).toLocaleString();
                }, 16);
            });
        }
    }

    window.addEventListener('scroll', animateCounters);
    animateCounters();

    // ========== SCROLL REVEAL ==========
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // ========== GALLERY FILTERS ==========
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            galleryItems.forEach((item, index) => {
                const category = item.getAttribute('data-category');

                if (filter === 'all' || category === filter) {
                    item.classList.remove('hidden');
                    item.style.animation = `fadeInUp 0.5s ease-out ${index * 0.05}s both`;
                } else {
                    item.classList.add('hidden');
                    item.style.animation = '';
                }
            });

            // Update lightbox array
            updateLightboxArray();
        });
    });

    // ========== LIGHTBOX ==========
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');
    let lightboxImages = [];
    let currentLightboxIndex = 0;

    function updateLightboxArray() {
        lightboxImages = [];
        galleryItems.forEach(item => {
            if (!item.classList.contains('hidden')) {
                const img = item.querySelector('img');
                const title = item.querySelector('.gallery-overlay h4');
                lightboxImages.push({
                    src: img.src.replace('w=600&h=400', 'w=1200&h=800'),
                    caption: title ? title.textContent : ''
                });
            }
        });
    }

    updateLightboxArray();

    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            // Find the index in the current lightbox array
            const imgSrc = item.querySelector('img').src;
            const idx = lightboxImages.findIndex(img => img.src.includes(imgSrc.split('w=')[1]?.split('&')[0] || ''));
            
            // Fallback: find by checking visible items
            const visibleItems = [...galleryItems].filter(i => !i.classList.contains('hidden'));
            const visibleIndex = visibleItems.indexOf(item);
            
            currentLightboxIndex = visibleIndex >= 0 ? visibleIndex : 0;
            openLightbox();
        });
    });

    function openLightbox() {
        if (lightboxImages.length === 0) return;

        const data = lightboxImages[currentLightboxIndex];
        lightboxImg.src = data.src;
        lightboxCaption.textContent = data.caption;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    function prevImage() {
        currentLightboxIndex = (currentLightboxIndex - 1 + lightboxImages.length) % lightboxImages.length;
        const data = lightboxImages[currentLightboxIndex];
        lightboxImg.style.opacity = 0;
        setTimeout(() => {
            lightboxImg.src = data.src;
            lightboxCaption.textContent = data.caption;
            lightboxImg.style.opacity = 1;
        }, 200);
    }

    function nextImage() {
        currentLightboxIndex = (currentLightboxIndex + 1) % lightboxImages.length;
        const data = lightboxImages[currentLightboxIndex];
        lightboxImg.style.opacity = 0;
        setTimeout(() => {
            lightboxImg.src = data.src;
            lightboxCaption.textContent = data.caption;
            lightboxImg.style.opacity = 1;
        }, 200);
    }

    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', prevImage);
    lightboxNext.addEventListener('click', nextImage);

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    // Add transition to lightbox image
    lightboxImg.style.transition = 'opacity 0.2s ease';

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;

        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') prevImage();
        if (e.key === 'ArrowRight') nextImage();
    });

    // ========== CONTACT FORM VALIDATION ==========
    const contactForm = document.getElementById('contactForm');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const messageError = document.getElementById('messageError');
    const submitBtn = document.getElementById('submitBtn');
    const formSuccess = document.getElementById('formSuccess');

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function clearError(input, errorEl) {
        input.classList.remove('error');
        errorEl.textContent = '';
    }

    function showError(input, errorEl, message) {
        input.classList.add('error');
        errorEl.textContent = message;
    }

    // Real-time validation
    nameInput.addEventListener('input', () => clearError(nameInput, nameError));
    emailInput.addEventListener('input', () => clearError(emailInput, emailError));
    messageInput.addEventListener('input', () => clearError(messageInput, messageError));

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        let isValid = true;

        // Name validation
        if (nameInput.value.trim() === '') {
            showError(nameInput, nameError, 'Please enter your name.');
            isValid = false;
        } else if (nameInput.value.trim().length < 2) {
            showError(nameInput, nameError, 'Name must be at least 2 characters.');
            isValid = false;
        } else {
            clearError(nameInput, nameError);
        }

        // Email validation
        if (emailInput.value.trim() === '') {
            showError(emailInput, emailError, 'Please enter your email address.');
            isValid = false;
        } else if (!validateEmail(emailInput.value.trim())) {
            showError(emailInput, emailError, 'Please enter a valid email address.');
            isValid = false;
        } else {
            clearError(emailInput, emailError);
        }

        // Message validation
        if (messageInput.value.trim() === '') {
            showError(messageInput, messageError, 'Please enter your message.');
            isValid = false;
        } else if (messageInput.value.trim().length < 10) {
            showError(messageInput, messageError, 'Message must be at least 10 characters.');
            isValid = false;
        } else {
            clearError(messageInput, messageError);
        }

        if (isValid) {
            // Simulate form submission
            submitBtn.innerHTML = '<span>Sending...</span> <i class="fas fa-spinner fa-spin"></i>';
            submitBtn.disabled = true;

            setTimeout(() => {
                contactForm.reset();
                submitBtn.innerHTML = '<span>Send Message</span> <i class="fas fa-paper-plane"></i>';
                submitBtn.disabled = false;
                formSuccess.classList.add('show');

                // Hide success message after 5 seconds
                setTimeout(() => {
                    formSuccess.classList.remove('show');
                }, 5000);
            }, 1500);
        }
    });

    // ========== BACK TO TOP ==========
    const backToTop = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 600) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ========== SMOOTH SCROLL FOR ALL ANCHOR LINKS ==========
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                e.preventDefault();
                targetEl.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

});