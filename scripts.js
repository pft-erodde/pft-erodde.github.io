// ===================================
// PORTFOLIO MODERNE - JAVASCRIPT
// Animations, Interactions & UX
// ===================================

// ===================================
// CURSEUR PERSONNALISÉ
// ===================================
const cursor = document.querySelector('.cursor');
const cursorFollower = document.querySelector('.cursor-follower');

if (cursor && cursorFollower) {
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';

        cursorFollower.style.left = e.clientX + 'px';
        cursorFollower.style.top = e.clientY + 'px';
    });

    // Effet hover sur les éléments cliquables
    const hoverElements = document.querySelectorAll('a, button, .btn, .skill-card, .experience-card, .project-card, .certification-card, .timeline-card, .stat-item');

    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('hover');
            cursorFollower.classList.add('hover');
        });

        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('hover');
            cursorFollower.classList.remove('hover');
        });
    });

    // Cacher le curseur quand il sort de la fenêtre
    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
        cursorFollower.style.opacity = '0';
    });

    document.addEventListener('mouseenter', () => {
        cursor.style.opacity = '1';
        cursorFollower.style.opacity = '0.6';
    });
}

// ===================================
// SCROLL FLUIDE POUR LA NAVIGATION
// ===================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const target = document.querySelector(targetId);

        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===================================
// NAVBAR - EFFET AU SCROLL
// ===================================
const navbar = document.getElementById('navbar');
let lastScrollY = window.scrollY;

window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;

    // Ajout classe "scrolled" quand on scroll
    if (currentScrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    lastScrollY = currentScrollY;
});

// ===================================
// ANIMATIONS AU SCROLL - INTERSECTION OBSERVER
// ===================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -80px 0px'
};

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observer tous les éléments avec les classes reveal
document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(element => {
    revealObserver.observe(element);
});

// ===================================
// NAVIGATION ACTIVE AU SCROLL
// ===================================
const sections = document.querySelectorAll('section, header');
const navLinks = document.querySelectorAll('nav a');

window.addEventListener('scroll', () => {
    let current = '';
    const scrollY = window.scrollY + 150;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;

        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
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

// ===================================
// EFFET PARALLAXE SUR LE HERO
// ===================================
const hero = document.querySelector('.hero');

window.addEventListener('scroll', () => {
    if (window.scrollY < window.innerHeight) {
        const scrolled = window.scrollY;
        hero.style.transform = `translateY(${scrolled * 0.3}px)`;
        hero.style.opacity = 1 - (scrolled / window.innerHeight) * 0.5;
    }
});

// ===================================
// EFFET PUSH 3D SUR TOUTES LES CARTES
// ===================================
const cards = document.querySelectorAll('.skill-card, .experience-card, .timeline-card, .certification-card, .project-card');

cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        // Effet "push" : le côté où se trouve la souris s'enfonce
        // Souris en haut (y < centerY) → rotateX négatif → haut s'enfonce
        // Souris à gauche (x < centerX) → rotateY positif → gauche s'enfonce
        const rotateX = -(y - centerY) / 25;
        const rotateY = (x - centerX) / 25;

        requestAnimationFrame(() => {
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(-10px)`;
        });
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
    });
});

// ===================================
// COMPTEUR ANIMÉ POUR LES STATS
// ===================================
const animateCounter = (element, target, duration = 2000) => {
    let start = 0;
    const increment = target / (duration / 16);

    const updateCounter = () => {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start) + (element.dataset.suffix || '');
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target + (element.dataset.suffix || '');
        }
    };

    updateCounter();
};

// Observer pour déclencher l'animation des compteurs
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            statNumbers.forEach(stat => {
                const text = stat.textContent;
                const hasPlus = text.includes('+');
                const number = parseInt(text.replace(/\D/g, ''));
                if (number) {
                    stat.dataset.suffix = hasPlus ? '+' : '';
                    animateCounter(stat, number);
                }
            });
            entry.target.classList.add('counted');
        }
    });
}, { threshold: 0.5 });

const aboutStats = document.querySelector('.about-stats');
if (aboutStats) {
    statsObserver.observe(aboutStats);
}

// ===================================
// EFFET DE FRAPPE POUR LE HERO (OPTIONNEL)
// ===================================
const typeWriter = (element, text, speed = 50) => {
    let i = 0;
    element.textContent = '';

    const type = () => {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    };

    type();
};

// ===================================
// GLOW EFFECT SUR LA SOURIS
// ===================================
document.addEventListener('mousemove', (e) => {
    const glowCards = document.querySelectorAll('.skill-card, .project-card, .experience-card');

    glowCards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
    });
});

// ===================================
// SMOOTH SCROLL POUR LE SCROLL INDICATOR
// ===================================
const scrollIndicator = document.querySelector('.scroll-indicator');
if (scrollIndicator) {
    scrollIndicator.addEventListener('click', () => {
        const apropos = document.querySelector('#apropos');
        if (apropos) {
            apropos.scrollIntoView({ behavior: 'smooth' });
        }
    });
    scrollIndicator.style.cursor = 'pointer';
}

// ===================================
// INITIALISATION AU CHARGEMENT
// ===================================
window.addEventListener('load', () => {
    // Forcer les révélations visibles au chargement pour le hero
    const firstVisibleElements = document.querySelectorAll('.hero, .hero-badge, .hero-cta');
    firstVisibleElements.forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
    });

    // Ajouter une classe au body pour indiquer que le JS est chargé
    document.body.classList.add('js-loaded');
});

// ===================================
// GESTION DU PREFERS-REDUCED-MOTION
// ===================================
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if (prefersReducedMotion.matches) {
    // Désactiver les animations pour les utilisateurs qui le préfèrent
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
        el.classList.add('visible');
    });
}

// ===================================
// CONSOLE MESSAGE
// ===================================
console.log('%c🚀 Portfolio Edan RODDE', 'font-size: 24px; font-weight: bold; color: #6366f1;');
console.log('%c✨ Conçu avec passion pour l\'infrastructure IT', 'font-size: 14px; color: #94a3b8;');
