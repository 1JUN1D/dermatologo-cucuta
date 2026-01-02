/* ============================================
   SERVICE PAGE SCRIPTS
   Dr. Delgado - Dermatólogo en Cúcuta
   Scripts comunes para páginas de servicios individuales
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
    
    // ============================================
    // LOAD EXTERNAL HTML COMPONENTS
    // ============================================
    async function loadHTML(elementId, file) {
        try {
            const response = await fetch(file);
            const html = await response.text();
            const element = document.getElementById(elementId);
            if (element) {
                element.innerHTML = html;
            }
        } catch (error) {
            console.error(`Error loading ${file}:`, error);
        }
    }

    // Load all components
    loadHTML('navbar-container', 'navbar.html');
    loadHTML('footer-container', 'footer.html');
    loadHTML('whatsapp-button-container', 'whatsapp-button.html');
    loadHTML('map-container', 'map.html');

    // ============================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // ============================================
    setTimeout(() => {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }, 500);

    // ============================================
    // FAQ ACCORDION FUNCTIONALITY
    // ============================================
    function initFAQ() {
        const faqItems = document.querySelectorAll('.faq-item');
        
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            
            question.addEventListener('click', () => {
                // Close all other FAQs
                faqItems.forEach(otherItem => {
                    if (otherItem !== item && otherItem.classList.contains('active')) {
                        otherItem.classList.remove('active');
                    }
                });
                
                // Toggle current FAQ
                item.classList.toggle('active');
            });
        });
    }

    // Initialize FAQ after slight delay to ensure DOM is ready
    setTimeout(initFAQ, 500);

    // ============================================
    // INTERSECTION OBSERVER FOR ANIMATIONS
    // ============================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Unobserve after animation
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all elements with fade-in-up class
    document.querySelectorAll('.fade-in-up').forEach(element => {
        observer.observe(element);
    });

    // ============================================
    // SCROLL TO TOP BUTTON
    // ============================================
    const scrollButton = document.createElement('button');
    scrollButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollButton.className = 'scroll-to-top';
    scrollButton.style.cssText = `
        position: fixed;
        bottom: 90px;
        right: 25px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: #1e3a5f;
        color: white;
        border: none;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 998;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    `;

    document.body.appendChild(scrollButton);

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollButton.style.opacity = '1';
            scrollButton.style.visibility = 'visible';
        } else {
            scrollButton.style.opacity = '0';
            scrollButton.style.visibility = 'hidden';
        }
    });

    scrollButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    scrollButton.addEventListener('mouseenter', () => {
        scrollButton.style.background = '#d4af37';
        scrollButton.style.transform = 'translateY(-5px)';
    });

    scrollButton.addEventListener('mouseleave', () => {
        scrollButton.style.background = '#1e3a5f';
        scrollButton.style.transform = 'translateY(0)';
    });

    // ============================================
    // WHATSAPP CONSULTATION WITH SERVICE NAME
    // ============================================
    function setupServiceConsultation() {
        // Get service name from H1
        const serviceH1 = document.querySelector('.hero-content h1');
        const serviceName = serviceH1 ? serviceH1.textContent.trim() : 'este servicio';
        
        // Update all CTA buttons with service name
        const ctaButtons = document.querySelectorAll('.cta-button, .cta-button-primary');
        ctaButtons.forEach(button => {
            if (button.href && button.href.includes('wa.me')) {
                const baseURL = 'https://wa.me/573114701386?text=';
                const message = `Hola Dr. Delgado, me gustaría obtener más información sobre *${serviceName}*`;
                button.href = baseURL + encodeURIComponent(message);
            }
        });
    }

    // Setup after components are loaded
    setTimeout(setupServiceConsultation, 1000);

    // ============================================
    // BREADCRUMB STRUCTURED DATA
    // ============================================
    function addBreadcrumbSchema() {
        const breadcrumbList = document.querySelector('.breadcrumb');
        if (!breadcrumbList) return;

        const items = breadcrumbList.querySelectorAll('li');
        const breadcrumbSchema = {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": []
        };

        items.forEach((item, index) => {
            const link = item.querySelector('a');
            if (link) {
                breadcrumbSchema.itemListElement.push({
                    "@type": "ListItem",
                    "position": index + 1,
                    "name": link.textContent.trim(),
                    "item": link.href
                });
            } else if (!item.classList.contains('breadcrumb-separator')) {
                // Last item (current page)
                breadcrumbSchema.itemListElement.push({
                    "@type": "ListItem",
                    "position": index + 1,
                    "name": item.textContent.trim()
                });
            }
        });

        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(breadcrumbSchema);
        document.head.appendChild(script);
    }

    addBreadcrumbSchema();

    // ============================================
    // HIGHLIGHT CURRENT SECTION IN NAVIGATION
    // ============================================
    function highlightCurrentSection() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');

        window.addEventListener('scroll', () => {
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (window.pageYOffset >= (sectionTop - 100)) {
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
    }

    highlightCurrentSection();

    // ============================================
    // STAGGER ANIMATION FOR CARDS
    // ============================================
    function staggerCards(selector, delay = 100) {
        const cards = document.querySelectorAll(selector);
        cards.forEach((card, index) => {
            card.style.animationDelay = `${index * delay}ms`;
        });
    }

    staggerCards('.benefit-card');
    staggerCards('.process-step');
    staggerCards('.related-card');

    // ============================================
    // COPY TO CLIPBOARD FUNCTIONALITY (OPTIONAL)
    // ============================================
    function addCopyToClipboard() {
        const phoneNumbers = document.querySelectorAll('a[href^="tel:"]');
        phoneNumbers.forEach(phone => {
            phone.addEventListener('click', function(e) {
                const number = this.textContent.trim();
                if (navigator.clipboard) {
                    navigator.clipboard.writeText(number).then(() => {
                        console.log('Número copiado:', number);
                    });
                }
            });
        });
    }

    addCopyToClipboard();

    // ============================================
    // LAZY LOAD IMAGES
    // ============================================
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        imageObserver.unobserve(img);
                    }
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    // ============================================
    // PRINT FUNCTIONALITY (OPTIONAL)
    // ============================================
    function addPrintButton() {
        const printBtn = document.createElement('button');
        printBtn.innerHTML = '<i class="fas fa-print"></i>';
        printBtn.className = 'print-button';
        printBtn.style.cssText = `
            position: fixed;
            bottom: 150px;
            right: 25px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: #d4af37;
            color: #1e3a5f;
            border: none;
            cursor: pointer;
            transition: all 0.3s ease;
            z-index: 998;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
            display: none;
        `;

        printBtn.addEventListener('click', () => {
            window.print();
        });

        printBtn.addEventListener('mouseenter', () => {
            printBtn.style.transform = 'translateY(-5px)';
            printBtn.style.boxShadow = '0 6px 20px rgba(212, 175, 55, 0.4)';
        });

        printBtn.addEventListener('mouseleave', () => {
            printBtn.style.transform = 'translateY(0)';
            printBtn.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)';
        });

        // Show on scroll
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 500) {
                printBtn.style.display = 'block';
            } else {
                printBtn.style.display = 'none';
            }
        });

        document.body.appendChild(printBtn);
    }

    // Uncomment if you want print functionality
    // addPrintButton();

    // ============================================
    // LOG PAGE VIEW (OPTIONAL - FOR ANALYTICS)
    // ============================================
    console.log('Service Page Loaded:', document.title);
});

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Format phone number for WhatsApp
function formatWhatsAppNumber(number) {
    return number.replace(/\D/g, '');
}

// Get current service name
function getCurrentService() {
    const h1 = document.querySelector('.hero-content h1');
    return h1 ? h1.textContent.trim() : '';
}

// Track user engagement (can be connected to analytics)
function trackEngagement(action, label) {
    console.log('Engagement:', action, label);
    // Add your analytics tracking here (Google Analytics, Facebook Pixel, etc.)
}

// Share on social media (optional)
function shareOnSocialMedia(platform) {
    const url = window.location.href;
    const title = document.title;
    
    const shareURLs = {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
        twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
        whatsapp: `https://wa.me/?text=${encodeURIComponent(title + ' - ' + url)}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
    };
    
    if (shareURLs[platform]) {
        window.open(shareURLs[platform], '_blank', 'width=600,height=400');
    }
}