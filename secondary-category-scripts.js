/* ============================================
   SECONDARY CATEGORY PAGE SCRIPTS
   Dr. Delgado - Dermatólogo en Cúcuta
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
    // SERVICE CARDS STAGGER ANIMATION
    // ============================================
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });

    // ============================================
    // WHATSAPP SERVICE CONSULTATION
    // ============================================
    function setupServiceConsultation() {
        const serviceLinks = document.querySelectorAll('.service-link');
        serviceLinks.forEach(link => {
            // Check if link has an href attribute pointing to another page
            const href = link.getAttribute('href');
            
            // If it's a navigation link (ends with .html), don't prevent default
            if (href && href.endsWith('.html')) {
                // Let it navigate normally
                return;
            }
            
            // Otherwise, set up WhatsApp consultation
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const serviceCard = this.closest('.service-card');
                const serviceTitle = serviceCard ? serviceCard.querySelector('h2') : null;
                const categoryTitle = document.querySelector('.hero-content h1');
                
                if (serviceTitle && categoryTitle) {
                    const serviceName = serviceTitle.textContent.trim();
                    const categoryName = categoryTitle.textContent.trim();
                    const message = `Hola Dr. Delgado, me interesa obtener más información sobre *${serviceName}* en ${categoryName}`;
                    const whatsappURL = `https://wa.me/573114701386?text=${encodeURIComponent(message)}`;
                    window.open(whatsappURL, '_blank');
                }
            });
        });
    }

    // Setup after slight delay to ensure DOM is fully loaded
    setTimeout(setupServiceConsultation, 500);

    // ============================================
    // SCROLL TO TOP BUTTON (OPTIONAL)
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
    // PERFORMANCE: LAZY LOAD IMAGES
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
    // LOG PAGE VIEW (OPTIONAL - FOR ANALYTICS)
    // ============================================
    console.log('Secondary Category Page Loaded:', document.title);
});

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Format phone number for WhatsApp
function formatWhatsAppNumber(number) {
    return number.replace(/\D/g, '');
}

// Get current page category
function getCurrentCategory() {
    const h1 = document.querySelector('.hero-content h1');
    return h1 ? h1.textContent.trim() : '';
}

// Track user engagement (can be connected to analytics)
function trackEngagement(action, label) {
    console.log('Engagement:', action, label);
    // Add your analytics tracking here (Google Analytics, Facebook Pixel, etc.)
}