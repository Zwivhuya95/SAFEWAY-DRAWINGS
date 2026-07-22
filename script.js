/* ==========================================
   SAFEWAY DRAWINGS - Complete JavaScript
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ----- Preloader -----
    const preloader = document.getElementById('preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                preloader.classList.add('hidden');
                // Initialize animations after preloader
                initScrollAnimations();
            }, 800);
        });
        // Fallback: hide preloader after 3 seconds if load event is slow
        setTimeout(() => {
            if (!preloader.classList.contains('hidden')) {
                preloader.classList.add('hidden');
                initScrollAnimations();
            }
        }, 3000);
    } else {
        initScrollAnimations();
    }

    // ----- Navbar Scroll Effect -----
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
            updateBackToTop();
        });
    }

    // ----- Hamburger Menu -----
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
            document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
        });

        // Close menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // ----- Active Nav Link Highlighting -----
    const setActiveNavLink = () => {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        navLinks.querySelectorAll('a').forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPage) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    };
    if (navLinks) setActiveNavLink();

    // ----- Smooth Scroll for Anchor Links -----
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const targetId = anchor.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ----- Scroll Animations (Intersection Observer) -----
    function initScrollAnimations() {
        const fadeElements = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right, .fade-in-up');
        
        if (fadeElements.length === 0) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, index * 100);
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        fadeElements.forEach(el => observer.observe(el));
    }

    // ----- Animated Counters -----
    const counters = document.querySelectorAll('.counter');
    if (counters.length > 0) {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = entry.target;
                    const targetValue = parseInt(target.getAttribute('data-target'));
                    const duration = 2000;
                    const step = Math.ceil(targetValue / (duration / 16));
                    let current = 0;

                    const updateCounter = () => {
                        current += step;
                        if (current >= targetValue) {
                            target.textContent = targetValue + '+';
                            return;
                        }
                        target.textContent = current + '+';
                        requestAnimationFrame(updateCounter);
                    };

                    updateCounter();
                    counterObserver.unobserve(target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => counterObserver.observe(counter));
    }

    // ----- Testimonials Slider -----
    const testimonialTrack = document.querySelector('.testimonial-track');
    const testimonialDots = document.querySelectorAll('.testimonial-dot');
    
    if (testimonialTrack && testimonialDots.length > 0) {
        let currentSlide = 0;
        const slides = testimonialTrack.querySelectorAll('.testimonial-card');
        const totalSlides = slides.length;

        const updateSlider = (index) => {
            testimonialTrack.style.transform = `translateX(-${index * 100}%)`;
            testimonialDots.forEach(dot => dot.classList.remove('active'));
            testimonialDots[index].classList.add('active');
            currentSlide = index;
        };

        testimonialDots.forEach((dot, index) => {
            dot.addEventListener('click', () => updateSlider(index));
        });

        // Auto-slide
        let autoSlideInterval = setInterval(() => {
            const next = (currentSlide + 1) % totalSlides;
            updateSlider(next);
        }, 5000);

        // Pause on hover
        const sliderContainer = document.querySelector('.testimonials-slider');
        if (sliderContainer) {
            sliderContainer.addEventListener('mouseenter', () => clearInterval(autoSlideInterval));
            sliderContainer.addEventListener('mouseleave', () => {
                autoSlideInterval = setInterval(() => {
                    const next = (currentSlide + 1) % totalSlides;
                    updateSlider(next);
                }, 5000);
            });
        }
    }

    // ----- Gallery Filtering -----
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    if (filterBtns.length > 0 && galleryItems.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Update active button
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filter = btn.getAttribute('data-filter');

                galleryItems.forEach(item => {
                    if (filter === 'all' || item.getAttribute('data-category') === filter) {
                        item.style.display = 'block';
                        item.style.opacity = '0';
                        setTimeout(() => { item.style.opacity = '1'; }, 50);
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    }

    // ----- Image Lightbox -----
    const lightbox = document.querySelector('.lightbox');
    const lightboxImg = document.querySelector('.lightbox img');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');

    if (lightbox && lightboxImg) {
        let currentImages = [];
        let currentIndex = 0;

        const openLightbox = (index) => {
            currentIndex = index;
            lightboxImg.src = currentImages[currentIndex].src;
            lightboxImg.alt = currentImages[currentIndex].alt || 'Gallery Image';
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        };

        const closeLightbox = () => {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        };

        const navigateLightbox = (direction) => {
            currentIndex = (currentIndex + direction + currentImages.length) % currentImages.length;
            lightboxImg.src = currentImages[currentIndex].src;
            lightboxImg.alt = currentImages[currentIndex].alt || 'Gallery Image';
        };

        // Gallery click events
        galleryItems.forEach((item, index) => {
            item.addEventListener('click', () => {
                currentImages = Array.from(galleryItems).filter(g => g.style.display !== 'none');
                if (currentImages.length === 0) currentImages = Array.from(galleryItems);
                const actualIndex = currentImages.indexOf(item);
                openLightbox(actualIndex);
            });
        });

        if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
        if (lightboxPrev) lightboxPrev.addEventListener('click', () => navigateLightbox(-1));
        if (lightboxNext) lightboxNext.addEventListener('click', () => navigateLightbox(1));

        // Close with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.classList.contains('active')) {
                closeLightbox();
            }
            if (lightbox.classList.contains('active')) {
                if (e.key === 'ArrowLeft') navigateLightbox(-1);
                if (e.key === 'ArrowRight') navigateLightbox(1);
            }
        });

        // Close on backdrop click
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
    }

    // ----- Contact Form Validation -----
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        const formGroups = contactForm.querySelectorAll('.form-group');
        
        const validateField = (group) => {
            const input = group.querySelector('input, textarea, select');
            const error = group.querySelector('.error');
            let valid = true;

            if (!input) return true;

            if (input.hasAttribute('required') && !input.value.trim()) {
                if (error) error.style.display = 'block';
                group.classList.add('error');
                group.classList.remove('success');
                valid = false;
            } else if (input.type === 'email' && input.value.trim()) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(input.value.trim())) {
                    if (error) {
                        error.textContent = 'Please enter a valid email address';
                        error.style.display = 'block';
                    }
                    group.classList.add('error');
                    group.classList.remove('success');
                    valid = false;
                } else {
                    if (error) error.style.display = 'none';
                    group.classList.remove('error');
                    group.classList.add('success');
                }
            } else if (input.value.trim()) {
                if (error) error.style.display = 'none';
                group.classList.remove('error');
                group.classList.add('success');
            } else {
                if (error) error.style.display = 'none';
                group.classList.remove('error', 'success');
            }

            return valid;
        };

        formGroups.forEach(group => {
            const input = group.querySelector('input, textarea, select');
            if (input) {
                input.addEventListener('blur', () => validateField(group));
                input.addEventListener('input', () => validateField(group));
            }
        });

        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let allValid = true;

            formGroups.forEach(group => {
                if (!validateField(group)) {
                    allValid = false;
                }
            });

            if (allValid) {
                // Show success message
                const btn = contactForm.querySelector('.btn');
                const originalText = btn.textContent;
                btn.textContent = '✓ Message Sent!';
                btn.style.background = '#28a745';
                btn.style.borderColor = '#28a745';
                
                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.style.background = '';
                    btn.style.borderColor = '';
                    contactForm.reset();
                    formGroups.forEach(g => g.classList.remove('success', 'error'));
                }, 3000);
            }
        });
    }

    // ----- FAQ Accordion -----
    const faqItems = document.querySelectorAll('.faq-item');
    if (faqItems.length > 0) {
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            if (question) {
                question.addEventListener('click', () => {
                    const isActive = item.classList.contains('active');
                    
                    // Close all FAQ items
                    faqItems.forEach(f => f.classList.remove('active'));
                    
                    // Toggle clicked item
                    if (!isActive) {
                        item.classList.add('active');
                    }
                });
            }
        });
    }

    // ----- Back to Top Button -----
    const backToTop = document.querySelector('.back-to-top');
    
    const updateBackToTop = () => {
        if (backToTop) {
            if (window.scrollY > 500) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        }
    };

    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ----- Newsletter Form -----
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const input = newsletterForm.querySelector('input');
            const btn = newsletterForm.querySelector('.btn');
            
            if (input && input.value.trim()) {
                const originalText = btn.textContent;
                btn.textContent = '✓ Subscribed!';
                btn.style.background = '#28a745';
                
                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.style.background = '';
                    input.value = '';
                }, 3000);
            }
        });
    }

    // ----- Floating Buttons Tooltip -----
    const floatingBtns = document.querySelectorAll('.floating-btn');
    floatingBtns.forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            const tooltip = btn.querySelector('.tooltip');
            if (tooltip) tooltip.style.opacity = '1';
        });
        btn.addEventListener('mouseleave', () => {
            const tooltip = btn.querySelector('.tooltip');
            if (tooltip) tooltip.style.opacity = '0';
        });
    });

});

