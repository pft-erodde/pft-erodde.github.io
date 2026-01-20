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
// MENU HAMBURGER MOBILE
// ===================================
const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('nav ul');
const navLinksMobile = document.querySelectorAll('nav a');

if (menuToggle && navMenu) {
    // Initialisation de l'état accessibilité
    menuToggle.setAttribute('aria-expanded', 'false');

    menuToggle.addEventListener('click', () => {
        const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
        menuToggle.setAttribute('aria-expanded', !isExpanded);
        menuToggle.setAttribute('aria-label', isExpanded ? 'Ouvrir le menu' : 'Fermer le menu');

        menuToggle.classList.toggle('active');
        navMenu.classList.toggle('nav-active');

        // Empêcher le scroll du body quand le menu est ouvert
        if (navMenu.classList.contains('nav-active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });

    // Fermer le menu lors du clic sur un lien
    navLinksMobile.forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.setAttribute('aria-expanded', 'false');
            menuToggle.setAttribute('aria-label', 'Ouvrir le menu');
            menuToggle.classList.remove('active');
            navMenu.classList.remove('nav-active');
            document.body.style.overflow = '';
        });
    });
}

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
// GESTION DU THÈME SOMBRE / CLAIR
// ===================================
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = themeToggle?.querySelector('.theme-icon');
const htmlElement = document.documentElement;

// Fonction pour définir le thème
const setTheme = (theme) => {
    htmlElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);

    // Mettre à jour les icônes lune/soleil
    if (themeIcon) {
        const moonIcon = themeIcon.querySelector('.moon-icon');
        const sunIcon = themeIcon.querySelector('.sun-icon');

        if (theme === 'light') {
            // Afficher l'icône soleil en mode clair
            if (moonIcon) moonIcon.style.display = 'none';
            if (sunIcon) sunIcon.style.display = 'block';
        } else {
            // Afficher l'icône lune en mode sombre
            if (moonIcon) moonIcon.style.display = 'block';
            if (sunIcon) sunIcon.style.display = 'none';
        }
    }

    // Mettre à jour l'image de profil
    const profileImage = document.getElementById('profile-image');
    if (profileImage) {
        const newSrc = theme === 'light' ? profileImage.dataset.lightSrc : profileImage.dataset.darkSrc;
        if (newSrc && profileImage.src !== newSrc) {
            profileImage.style.opacity = '0';
            setTimeout(() => {
                profileImage.src = newSrc;
                profileImage.style.opacity = '1';
            }, 200);
        }
    }
};

// Vérifier les préférences sauvegardées ou, à défaut, forcer le mode sombre
const savedTheme = localStorage.getItem('theme');

// Appliquer le thème initial
if (savedTheme) {
    setTheme(savedTheme);
} else {
    // Force dark mode by default for first-time visitors
    setTheme('dark');
}

// Event listener sur le bouton
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
    });
}


// ===================================
// EFFET PUSH 3D SUR LES CARTES DE PROJETS
// ===================================
const cards = document.querySelectorAll('.timeline-card, .certification-card, .project-card, .school-project-card');

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
// EFFET DE FRAPPE AVANCÉ POUR LE HERO
// ===================================
const heroTypingText = "Étudiant en BTS SIO — Spécialité SISR | Infrastructure, Réseaux & Cybersécurité";
const typingElement = document.getElementById('typing-text');
const typingCursor = document.querySelector('.typing-cursor');

function typeHeroText() {
    if (!typingElement) return;

    let charIndex = 0;
    const baseSpeed = 50;

    function type() {
        if (charIndex < heroTypingText.length) {
            const char = heroTypingText.charAt(charIndex);
            typingElement.textContent += char;
            charIndex++;

            // Vitesse variable pour un effet plus naturel
            let delay = baseSpeed;
            if (char === ' ') delay = baseSpeed * 0.5;
            else if (char === '—' || char === '|') delay = baseSpeed * 3;
            else if (char === ',') delay = baseSpeed * 2;
            else delay = baseSpeed + Math.random() * 30;

            setTimeout(type, delay);
        } else {
            // Animation terminée - cacher le curseur après un délai
            setTimeout(() => {
                if (typingCursor) {
                    typingCursor.style.animation = 'none';
                    typingCursor.style.opacity = '0';
                }
            }, 2000);
        }
    }

    // Démarrer l'effet de frappe après un court délai
    setTimeout(type, 800);
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

    // Démarrer l'effet de frappe
    typeHeroText();
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
// MODAL PROJETS SCOLAIRES
// ===================================
const projectModal = document.getElementById('project-modal');
const modalOverlay = projectModal?.querySelector('.modal-overlay');
const modalClose = projectModal?.querySelector('.modal-close');
const schoolProjectCards = document.querySelectorAll('.school-project-card[data-project="true"], .project-card[data-project="true"]');

// Fonction pour ouvrir le modal avec les données du projet
function openProjectModal(card) {
    if (!projectModal) return;

    // Récupérer les données du projet depuis les attributs data-*
    // Pour l'icône, on essaie de récupérer le SVG depuis l'élément .project-icon-large s'il existe
    const iconContainer = card.querySelector('.project-icon-large');
    const icon = iconContainer ? iconContainer.innerHTML : (card.dataset.icon || '📁');

    const title = card.dataset.title || 'Projet';
    const status = card.dataset.status || 'En cours';
    const year = card.dataset.year || '';
    const description = card.dataset.description || 'Description non disponible.';
    const objectives = card.dataset.objectives || 'Objectifs non définis.';
    const tasks = card.dataset.tasks ? card.dataset.tasks.split('|') : ['Aucune tâche définie'];
    const tech = card.dataset.tech ? card.dataset.tech.split(',') : [];

    // Remplir le modal avec les données
    document.getElementById('modal-icon').innerHTML = icon;
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-description').textContent = description;
    document.getElementById('modal-objectives').textContent = objectives;
    document.getElementById('modal-year').textContent = year;

    // Badge de statut
    const modalBadge = document.getElementById('modal-badge');
    modalBadge.textContent = status;
    modalBadge.className = 'modal-badge ' + (status === 'Terminé' ? 'completed' : 'in-progress');

    // Liste des tâches
    const tasksList = document.getElementById('modal-tasks');
    tasksList.innerHTML = tasks.map(task => `<li>${task.trim()}</li>`).join('');

    // Technologies
    const techContainer = document.getElementById('modal-tech');
    techContainer.innerHTML = tech.map(t => `<span>${t.trim()}</span>`).join('');

    // Afficher le modal
    projectModal.classList.add('active');
    projectModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
}

// Fonction pour fermer le modal
function closeProjectModal() {
    if (!projectModal) return;

    projectModal.classList.remove('active');
    projectModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
}

// Event listeners pour les cartes de projets
schoolProjectCards.forEach(card => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', () => openProjectModal(card));
});

// Fermer le modal
if (modalClose) {
    modalClose.addEventListener('click', closeProjectModal);
}

if (modalOverlay) {
    modalOverlay.addEventListener('click', closeProjectModal);
}

// Fermer avec la touche Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && projectModal?.classList.contains('active')) {
        closeProjectModal();
    }
});

// ===================================
// CONSOLE MESSAGE
// ===================================
console.log('%c🚀 Portfolio Edan RODDE', 'font-size: 24px; font-weight: bold; color: #6366f1;');
console.log('%c✨ Conçu avec passion pour l\'infrastructure IT', 'font-size: 14px; color: #94a3b8;');
