/* ============================================================
   Wewa Thaula Guest — Luxury Five-Star Hotel Website
   script.js
   ============================================================ */

'use strict';

document.addEventListener('DOMContentLoaded', () => {

    /* ----------------------------------------------------------
       1. STICKY NAVBAR — background change on scroll
       ---------------------------------------------------------- */
    const navbar = document.getElementById('navbar');
    const backToTop = document.getElementById('backToTop');

    const handleScroll = () => {
        if (window.scrollY > 60) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    /* ----------------------------------------------------------
       2. MOBILE NAVIGATION
       ---------------------------------------------------------- */
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    const closeMenu = () => {
        navMenu.classList.remove('open');
        navToggle.classList.remove('open');
        document.body.style.overflow = '';
    };

    navToggle.addEventListener('click', () => {
        const isOpen = navMenu.classList.toggle('open');
        navToggle.classList.toggle('open', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close menu when a link is clicked
    navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Close menu on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('open')) closeMenu();
    });

    /* ----------------------------------------------------------
       3. SMOOTH SCROLLING + ACTIVE LINK HIGHLIGHTING
       ---------------------------------------------------------- */
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = [...navLinks]
        .map(link => document.querySelector(link.getAttribute('href')))
        .filter(Boolean);

    const highlightActiveLink = () => {
        const scrollPos = window.scrollY + 120;
        let currentId = sections.length ? sections[0].id : null;

        sections.forEach(section => {
            if (scrollPos >= section.offsetTop) currentId = section.id;
        });

        navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === '#' + currentId);
        });
    };

    window.addEventListener('scroll', highlightActiveLink, { passive: true });
    highlightActiveLink();

    /* ----------------------------------------------------------
       4. SCROLL REVEAL ANIMATIONS
       ---------------------------------------------------------- */
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    /* ----------------------------------------------------------
       5. GALLERY LIGHTBOX
       ---------------------------------------------------------- */
    const galleryItems = [...document.querySelectorAll('.gallery-item')];
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');
    let currentIndex = 0;

    const openLightbox = (index) => {
        currentIndex = index;
        updateLightbox();
        lightbox.classList.add('open');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
        lightbox.classList.remove('open');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    };

    const updateLightbox = () => {
        const item = galleryItems[currentIndex];
        const img = item.querySelector('img');
        lightboxImg.src = img.src.replace('w=700', 'w=1400');
        lightboxImg.alt = img.alt;
        lightboxCaption.textContent = item.dataset.title || '';
    };

    const showPrev = () => {
        currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
        updateLightbox();
    };

    const showNext = () => {
        currentIndex = (currentIndex + 1) % galleryItems.length;
        updateLightbox();
    };

    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => openLightbox(index));
        item.setAttribute('tabindex', '0');
        item.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') openLightbox(index);
        });
    });

    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', showPrev);
    lightboxNext.addEventListener('click', showNext);

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('open')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') showPrev();
        if (e.key === 'ArrowRight') showNext();
    });

    /* ----------------------------------------------------------
       6. TESTIMONIAL SLIDER (auto-play + dots)
       ---------------------------------------------------------- */
    const track = document.getElementById('testimonialTrack');
    const cards = track.children;
    const dotsContainer = document.getElementById('testimonialDots');
    let currentSlide = 0;
    let autoPlayTimer = null;

    // Build dots
    for (let i = 0; i < cards.length; i++) {
        const dot = document.createElement('button');
        dot.setAttribute('aria-label', 'Go to testimonial ' + (i + 1));
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => {
            goToSlide(i);
            restartAutoPlay();
        });
        dotsContainer.appendChild(dot);
    }

    const dots = [...dotsContainer.children];

    const goToSlide = (index) => {
        currentSlide = index;
        track.style.transform = 'translateX(-' + (index * 100) + '%)';
        dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
    };

    const nextSlide = () => goToSlide((currentSlide + 1) % cards.length);

    const restartAutoPlay = () => {
        clearInterval(autoPlayTimer);
        autoPlayTimer = setInterval(nextSlide, 6000);
    };

    restartAutoPlay();

    // Pause auto-play on hover
    const slider = document.querySelector('.testimonial-slider');
    slider.addEventListener('mouseenter', () => clearInterval(autoPlayTimer));
    slider.addEventListener('mouseleave', restartAutoPlay);

    /* ----------------------------------------------------------
       7. FORM VALIDATION HELPERS
       ---------------------------------------------------------- */
    const showError = (input, message) => {
        const group = input.closest('.form-group');
        group.classList.add('invalid');
        const msg = group.querySelector('.error-msg');
        if (msg) msg.textContent = message;
    };

    const clearError = (input) => {
        const group = input.closest('.form-group');
        if (group) group.classList.remove('invalid');
    };

    const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const isValidPhone = (phone) => /^[+()\-\s\d]{7,20}$/.test(phone);

    // Live clearing of errors while typing
    document.querySelectorAll('.form-group input, .form-group select, .form-group textarea')
        .forEach(field => {
            field.addEventListener('input', () => clearError(field));
            field.addEventListener('change', () => clearError(field));
        });

    /* ----------------------------------------------------------
       8. BOOKING FORM VALIDATION + CONFIRMATION
       ---------------------------------------------------------- */
    const bookingForm = document.getElementById('bookingForm');
    const bookingSuccess = document.getElementById('bookingSuccess');
    const checkIn = document.getElementById('checkIn');
    const checkOut = document.getElementById('checkOut');

    // Prevent past dates
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    checkIn.min = todayStr;
    checkOut.min = todayStr;

    bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        let valid = true;

        const name = document.getElementById('guestName');
        const email = document.getElementById('guestEmail');
        const phone = document.getElementById('guestPhone');
        const guests = document.getElementById('numGuests');
        const roomType = document.getElementById('roomType');

        [name, email, phone, guests, checkIn, checkOut, roomType].forEach(clearError);

        if (name.value.trim().length < 2) {
            showError(name, 'Please enter your full name.');
            valid = false;
        }

        if (!isValidEmail(email.value.trim())) {
            showError(email, 'Please enter a valid email address.');
            valid = false;
        }

        if (!isValidPhone(phone.value.trim())) {
            showError(phone, 'Please enter a valid phone number.');
            valid = false;
        }

        if (!guests.value) {
            showError(guests, 'Please select the number of guests.');
            valid = false;
        }

        if (!checkIn.value) {
            showError(checkIn, 'Please choose a check-in date.');
            valid = false;
        }

        if (!checkOut.value) {
            showError(checkOut, 'Please choose a check-out date.');
            valid = false;
        }

        // Date validation: check-out must be AFTER check-in
        if (checkIn.value && checkOut.value) {
            const inDate = new Date(checkIn.value);
            const outDate = new Date(checkOut.value);

            if (inDate < new Date(todayStr)) {
                showError(checkIn, 'Check-in date cannot be in the past.');
                valid = false;
            } else if (outDate <= inDate) {
                showError(checkOut, 'Check-out date must be after the check-in date.');
                valid = false;
            }
        }

        if (!roomType.value) {
            showError(roomType, 'Please select a room type.');
            valid = false;
        }

        if (!valid) {
            const firstInvalid = bookingForm.querySelector('.form-group.invalid input, .form-group.invalid select');
            if (firstInvalid) firstInvalid.focus();
            return;
        }

        // Demo success — connect to a backend/booking service for real reservations
        bookingSuccess.classList.add('show');
        bookingForm.reset();
        bookingSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

        setTimeout(() => bookingSuccess.classList.remove('show'), 12000);
    });

    /* ----------------------------------------------------------
       9. CONTACT FORM
       ---------------------------------------------------------- */
    const contactForm = document.getElementById('contactForm');
    const contactSuccess = document.getElementById('contactSuccess');

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        let valid = true;

        const cName = document.getElementById('contactName');
        const cEmail = document.getElementById('contactEmail');
        const cMessage = document.getElementById('contactMessage');

        [cName, cEmail, cMessage].forEach(clearError);

        if (cName.value.trim().length < 2) {
            showError(cName, 'Please enter your name.');
            valid = false;
        }

        if (!isValidEmail(cEmail.value.trim())) {
            showError(cEmail, 'Please enter a valid email address.');
            valid = false;
        }

        if (cMessage.value.trim().length < 10) {
            showError(cMessage, 'Please write a message (at least 10 characters).');
            valid = false;
        }

        if (!valid) return;

        contactSuccess.classList.add('show');
        contactForm.reset();
        setTimeout(() => contactSuccess.classList.remove('show'), 8000);
    });

    /* ----------------------------------------------------------
       10. NEWSLETTER FORM
       ---------------------------------------------------------- */
    const newsletterForm = document.getElementById('newsletterForm');
    const newsletterEmail = document.getElementById('newsletterEmail');
    const newsletterMsg = document.getElementById('newsletterMsg');

    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = newsletterEmail.value.trim();

        if (!isValidEmail(email)) {
            newsletterMsg.textContent = 'Please enter a valid email address.';
            newsletterMsg.style.color = '#e8a2a2';
            return;
        }

        newsletterMsg.textContent = 'Thank you for subscribing! (demo — connect a mailing service to store subscribers)';
        newsletterMsg.style.color = '';
        newsletterForm.reset();

        setTimeout(() => { newsletterMsg.textContent = ''; }, 8000);
    });

    /* ----------------------------------------------------------
       11. BACK TO TOP
       ---------------------------------------------------------- */
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    /* ----------------------------------------------------------
       12. FOOTER YEAR
       ---------------------------------------------------------- */
    document.getElementById('year').textContent = new Date().getFullYear();

});
