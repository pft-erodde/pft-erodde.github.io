// === AURORA GRAIN OVERLAY ===
(function() {
    const grain = document.createElement('div');
    grain.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:1;opacity:0.04;mix-blend-mode:overlay;background-image:url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'300\' height=\'300\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'300\' height=\'300\' filter=\'url(%23n)\'/%3E%3C/svg%3E");background-size:200px 200px';
    document.body.appendChild(grain);
})();

// ===================================
// PORTFOLIO MULTI-PAGES - JAVASCRIPT
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

    const hoverElements = document.querySelectorAll('a, button, .btn, .skill-card, .experience-card, .project-card, .certification-card, .timeline-card, .stat-item, .school-project-card, .nav-block');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => { cursor.classList.add('hover'); cursorFollower.classList.add('hover'); });
        el.addEventListener('mouseleave', () => { cursor.classList.remove('hover'); cursorFollower.classList.remove('hover'); });
    });

    document.addEventListener('mouseleave', () => { cursor.style.opacity = '0'; cursorFollower.style.opacity = '0'; });
    document.addEventListener('mouseenter', () => { cursor.style.opacity = '1'; cursorFollower.style.opacity = '0.6'; });
}

// ===================================
// SCROLL FLUIDE POUR LES ANCRES
// ===================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        const target = document.querySelector(targetId);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ===================================
// MENU HAMBURGER MOBILE
// ===================================
const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('nav ul');
const navLinksMobile = document.querySelectorAll('nav ul a');

if (menuToggle && navMenu) {
    menuToggle.setAttribute('aria-expanded', 'false');

    menuToggle.addEventListener('click', () => {
        const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
        menuToggle.setAttribute('aria-expanded', !isExpanded);
        menuToggle.setAttribute('aria-label', isExpanded ? 'Ouvrir le menu' : 'Fermer le menu');
        menuToggle.classList.toggle('active');
        navMenu.classList.toggle('nav-active');
        document.body.style.overflow = navMenu.classList.contains('nav-active') ? 'hidden' : '';
    });

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
// NAVBAR DÉROULANTE (DROPDOWN) - MOBILE
// ===================================
const dropdowns = document.querySelectorAll('.nav-dropdown');

dropdowns.forEach(dropdown => {
    const toggle = dropdown.querySelector('.nav-dropdown-toggle');

    // Sur mobile : toggle au clic
    if (toggle) {
        toggle.addEventListener('click', (e) => {
            // Si on est en mobile (menu hamburger visible)
            if (window.innerWidth <= 1024) {
                e.preventDefault();
                const isOpen = dropdown.classList.contains('open');
                // Fermer tous les autres
                dropdowns.forEach(d => d.classList.remove('open'));
                if (!isOpen) dropdown.classList.add('open');
            }
        });
    }
});

// Fermer les dropdowns en cliquant ailleurs
document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-dropdown')) {
        dropdowns.forEach(d => d.classList.remove('open'));
    }
});

// ===================================
// NAVBAR - EFFET AU SCROLL
// ===================================
const navbar = document.getElementById('navbar');
if (navbar) {
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    });
}

// ===================================
// ANIMATIONS AU SCROLL - INTERSECTION OBSERVER
// ===================================
const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -80px 0px' };

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
    });
}, observerOptions);

document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(element => {
    revealObserver.observe(element);
});

// ===================================
// NAVIGATION ACTIVE AU SCROLL (page index uniquement)
// ===================================
const sections = document.querySelectorAll('section, header');
const navLinks = document.querySelectorAll('nav a');

if (sections.length > 0) {
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
            const href = link.getAttribute('href');
            if (href === `#${current}` || href === `index.html#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// ===================================
// EFFET PARALLAXE SUR LE HERO (page index uniquement)
// ===================================
const hero = document.querySelector('.hero');

if (hero) {
    window.addEventListener('scroll', () => {
        if (window.scrollY < window.innerHeight) {
            const scrolled = window.scrollY;
            hero.style.transform = `translateY(${scrolled * 0.3}px)`;
            hero.style.opacity = 1 - (scrolled / window.innerHeight) * 0.5;
        }
    });
}

// ===================================
// GESTION DU THÈME SOMBRE / CLAIR
// ===================================
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = themeToggle?.querySelector('.theme-icon');
const htmlElement = document.documentElement;

const setTheme = (theme) => {
    htmlElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);

    if (themeIcon) {
        const moonIcon = themeIcon.querySelector('.moon-icon');
        const sunIcon = themeIcon.querySelector('.sun-icon');
        if (theme === 'light') {
            if (moonIcon) moonIcon.style.display = 'none';
            if (sunIcon) sunIcon.style.display = 'block';
        } else {
            if (moonIcon) moonIcon.style.display = 'block';
            if (sunIcon) sunIcon.style.display = 'none';
        }
    }

    const profileImage = document.getElementById('profile-image');
    if (profileImage) {
        const newSrc = theme === 'light' ? profileImage.dataset.lightSrc : profileImage.dataset.darkSrc;
        if (newSrc && profileImage.src !== newSrc) {
            profileImage.style.opacity = '0';
            setTimeout(() => { profileImage.src = newSrc; profileImage.style.opacity = '1'; }, 200);
        }
    }
};

const savedTheme = localStorage.getItem('theme');
setTheme(savedTheme || 'dark');

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const newTheme = htmlElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
    });
}

// ===================================
// EFFET PUSH 3D SUR LES CARTES
// ===================================
const cards = document.querySelectorAll('.timeline-card, .certification-card, .project-card, .school-project-card');

cards.forEach(card => {
    // Initialise une vitesse de retour fluide
    card.style.transition = 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const rotateX = -(y - rect.height / 2) / 20;
        const rotateY = (x - rect.width / 2) / 20;
        
        requestAnimationFrame(() => {
            card.style.transition = 'transform 0.1s ease';
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02) translateY(-5px)`;
        });
    });
    
    card.addEventListener('mouseleave', () => {
        requestAnimationFrame(() => {
            card.style.transition = 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1) translateY(0)';
        });
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

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            statNumbers.forEach(stat => {
                const text = stat.textContent;
                const hasPlus = text.includes('+');
                const number = parseInt(text.replace(/\D/g, ''));
                if (number) { stat.dataset.suffix = hasPlus ? '+' : ''; animateCounter(stat, number); }
            });
            entry.target.classList.add('counted');
        }
    });
}, { threshold: 0.5 });

const aboutStats = document.querySelector('.about-stats');
if (aboutStats) statsObserver.observe(aboutStats);

// ===================================
// EFFET DE FRAPPE POUR LE HERO
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
            let delay = baseSpeed;
            if (char === ' ') delay = baseSpeed * 0.5;
            else if (char === '—' || char === '|') delay = baseSpeed * 3;
            else if (char === ',') delay = baseSpeed * 2;
            else delay = baseSpeed + Math.random() * 30;
            setTimeout(type, delay);
        } else {
            setTimeout(() => {
                if (typingCursor) { typingCursor.style.animation = 'none'; typingCursor.style.opacity = '0'; }
            }, 2000);
        }
    }
    setTimeout(type, 800);
}

// ===================================
// INITIALISATION AU CHARGEMENT
// ===================================
window.addEventListener('load', () => {
    document.body.classList.add('js-loaded');
    typeHeroText();
});

// ===================================
// ILLUSTRATIONS DE PAGE (RENDU VITRINE)
// ===================================
const pageIllustrations = {
    'formation.html': {
        src: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
        alt: 'Baie de serveurs et infrastructure reseau'
    },
    'parcours.html': {
        src: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80',
        alt: 'Parcours scolaire et documents de formation'
    },
    'projets-tous.html': {
        src: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1200&q=80',
        alt: 'Collaboration sur des projets informatiques'
    },
    'projets-pro.html': {
        src: 'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1200&q=80',
        alt: 'Poste de travail professionnel et code'
    },
    'projets-scolaires.html': {
        src: 'https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=1200&q=80',
        alt: 'Ordinateur portable pour projets scolaires'
    },
    'competences.html': {
        src: 'https://res.cloudinary.com/dynbrtfxs/image/upload/v1778071401/Gemini_Generated_Image_o8fn49o8fn49o8fn_ckaydp.png',
        alt: 'Developpement et competences techniques'
    },
    'qualifications-professionnelles.html': {
        src: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1200&q=80',
        alt: 'Certifications et qualifications professionnelles'
    }
};

const currentPageName = window.location.pathname.split('/').pop() || 'index.html';
const headerIllustrationData = pageIllustrations[currentPageName];
const pageHeaderEl = document.querySelector('.page-header');

if (pageHeaderEl && headerIllustrationData && !pageHeaderEl.querySelector('.page-header-illustration')) {
    const figure = document.createElement('figure');
    figure.className = 'page-header-illustration';
    figure.innerHTML = `
        <img src="${headerIllustrationData.src}" alt="${headerIllustrationData.alt}" loading="eager" decoding="async" referrerpolicy="no-referrer">
    `;
    const illustrationImg = figure.querySelector('img');
    if (illustrationImg) {
        illustrationImg.onerror = function () {
            this.onerror = null;
            this.src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%221200%22 height=%22340%22 viewBox=%220 0 1200 340%22%3E%3Cdefs%3E%3ClinearGradient id=%22g%22 x1=%220%25%22 y1=%220%25%22 x2=%22100%25%22 y2=%22100%25%22%3E%3Cstop offset=%220%25%22 stop-color=%22%231e1b4b%22/%3E%3Cstop offset=%22100%25%22 stop-color=%22%230f766e%22/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width=%221200%22 height=%22340%22 fill=%22url(%23g)%22/%3E%3Ccircle cx=%221050%22 cy=%2260%22 r=%22170%22 fill=%22rgba(255,255,255,0.08)%22/%3E%3Ccircle cx=%22140%22 cy=%22310%22 r=%22180%22 fill=%22rgba(255,255,255,0.05)%22/%3E%3C/svg%3E';
        };
    }
    pageHeaderEl.appendChild(figure);
}

// ===================================
// MODAL PROJETS — VERSION ENRICHIE
// ===================================
const projectModal = document.getElementById('project-modal');
const modalOverlay = projectModal?.querySelector('.modal-overlay');
const modalClose = projectModal?.querySelector('.modal-close');
const projectCards = document.querySelectorAll('.school-project-card[data-project="true"], .project-card[data-project="true"]');

function setModalSection(id, content, isHtml = false) {
    const el = document.getElementById(id);
    if (el) {
        if (isHtml) el.innerHTML = content;
        else el.textContent = content;
    }
}

function showHideSection(sectionId, data) {
    const sec = document.getElementById(sectionId);
    if (sec) sec.style.display = data ? 'block' : 'none';
}

function makeList(data, separator = '|') {
    if (!data) return '';
    return data.split(separator).map(item => `<li>${item.trim()}</li>`).join('');
}

function openProjectModal(card) {
    if (!projectModal) return;

    const iconContainer = card.querySelector('.project-icon-large');
    const icon = iconContainer ? iconContainer.innerHTML : (card.dataset.icon || '📁');

    const title = card.dataset.title || 'Projet';
    const status = card.dataset.status || 'En cours';
    const year = card.dataset.year || '';
    const description = card.dataset.description || '';
    const tasks = card.dataset.tasks ? card.dataset.tasks.split('|') : [];
    const tech = card.dataset.tech ? card.dataset.tech.split(',') : [];

    // Nouvelles données enrichies
    const context = card.dataset.context || '';
    const client = card.dataset.client || '';
    const needs = card.dataset.needs || '';
    const docsIn = card.dataset.docsIn || '';
    const docsOut = card.dataset.docsOut || '';
    const opinion = card.dataset.opinion || '';
    const difficulties = card.dataset.difficulties || '';
    const contributions = card.dataset.contributions || '';
    const bonus = card.dataset.bonus || '';

    // Remplissage du modal
    document.getElementById('modal-icon').innerHTML = icon;
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-year').textContent = year;

    const modalBadge = document.getElementById('modal-badge');
    if (modalBadge) {
        modalBadge.textContent = status;
        modalBadge.className = 'modal-badge ' + (status === 'Terminé' ? 'completed' : 'in-progress');
    }

    // Tâches (toujours présentes)
    const tasksList = document.getElementById('modal-tasks');
    if (tasksList) tasksList.innerHTML = tasks.map(t => `<li>${t.trim()}</li>`).join('');

    // Technologies
    const techContainer = document.getElementById('modal-tech');
    if (techContainer) techContainer.innerHTML = tech.map(t => `<span>${t.trim()}</span>`).join('');

    // Sections optionnelles enrichies
    showHideSection('ms-context', context);
    if (context) setModalSection('modal-context', context);

    showHideSection('ms-client', client);
    if (client) setModalSection('modal-client', client);

    showHideSection('ms-needs', needs);
    if (needs) { const el = document.getElementById('modal-needs'); if (el) el.innerHTML = makeList(needs); }

    showHideSection('ms-docs-in', docsIn);
    if (docsIn) { const el = document.getElementById('modal-docs-in'); if (el) el.innerHTML = makeList(docsIn); }

    showHideSection('ms-docs-out', docsOut);
    if (docsOut) { const el = document.getElementById('modal-docs-out'); if (el) el.innerHTML = makeList(docsOut); }

    showHideSection('ms-opinion', opinion);
    if (opinion) setModalSection('modal-opinion', opinion);

    showHideSection('ms-difficulties', difficulties);
    if (difficulties) { const el = document.getElementById('modal-difficulties'); if (el) el.innerHTML = makeList(difficulties); }

    showHideSection('ms-contributions', contributions);
    if (contributions) { const el = document.getElementById('modal-contributions'); if (el) el.innerHTML = makeList(contributions); }

    showHideSection('ms-bonus', bonus);
    if (bonus) setModalSection('modal-bonus', bonus);

    // Image du projet
    const imageUrl = card.dataset.image || '';
    const imageUrl2 = card.dataset.image2 || '';
    const imageCaption = card.dataset.imageCaption || '';
    const imageContainer = document.getElementById('modal-image-container');
    const modalImage = document.getElementById('modal-image');
    const modalImage2 = document.getElementById('modal-image2');
    const modalImageCaption = document.getElementById('modal-image-caption');

    if (imageUrl && imageContainer && modalImage) {
        modalImage.src = imageUrl;
        modalImage.alt = imageCaption || 'Image du projet';
        
        if (imageUrl2 && modalImage2) {
            modalImage2.src = imageUrl2;
            modalImage2.alt = 'Image secondaire';
            modalImage2.style.display = 'block';
        } else if (modalImage2) {
            modalImage2.style.display = 'none';
            modalImage2.src = '';
        }

        if (modalImageCaption) modalImageCaption.textContent = imageCaption;
        imageContainer.style.display = 'block';
    } else if (imageContainer) {
        imageContainer.style.display = 'none';
    }

    projectModal.classList.add('active');
    projectModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
}

function closeProjectModal() {
    if (!projectModal) return;
    projectModal.classList.remove('active');
    projectModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
}

projectCards.forEach(card => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', (e) => {
        if (e.target.closest('img')) return;
        openProjectModal(card);
    });
});

if (modalClose) modalClose.addEventListener('click', closeProjectModal);
if (modalOverlay) modalOverlay.addEventListener('click', closeProjectModal);
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) closeGlobalLightbox();
    if (e.key === 'Escape' && projectModal?.classList.contains('active')) closeProjectModal();
});

// ===================================
// SISR CARD - CLICK TO REVEAL IMAGE
// ===================================
const sisrCard = document.querySelector('.sisr-card');
const sisrReveal = document.getElementById('sisr-reveal');

if (sisrCard && sisrReveal) {
    sisrCard.style.cursor = 'pointer';
    sisrCard.addEventListener('click', (e) => {
        if (e.target.closest('img')) return;
        const isVisible = sisrReveal.style.display !== 'none';
        sisrReveal.style.display = isVisible ? 'none' : 'block';
        const hint = sisrCard.querySelector('.sisr-click-hint');
        if (hint) hint.textContent = isVisible ? 'Cliquez pour voir la salle' : 'Cliquez pour masquer';
    });
}

// ===================================
// CERTIFICATION CARDS - CLICK TO REVEAL
// ===================================
document.querySelectorAll('.certification-card').forEach(card => {
    const img = card.querySelector('.certification-image');
    if (img) {
        card.style.cursor = 'pointer';
        card.addEventListener('click', (e) => {
            if (e.target.closest('img')) return;
            const isVisible = img.style.display !== 'none';
            img.style.display = isVisible ? 'none' : 'block';
        });
    }
});

// ===================================
// LIGHTBOX GLOBALE POUR LES IMAGES
// ===================================
const lightbox = document.createElement('div');
lightbox.className = 'global-lightbox';
lightbox.setAttribute('aria-hidden', 'true');
lightbox.innerHTML = `
    <button class="global-lightbox-close" aria-label="Fermer l'image agrandie">×</button>
    <img class="global-lightbox-image" src="" alt="">
`;
document.body.appendChild(lightbox);

const lightboxImage = lightbox.querySelector('.global-lightbox-image');
const lightboxClose = lightbox.querySelector('.global-lightbox-close');

function openGlobalLightbox(imageEl) {
    if (!lightboxImage || !imageEl) return;
    lightboxImage.src = imageEl.src;
    lightboxImage.alt = imageEl.alt || 'Image agrandie';
    lightbox.classList.add('active');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
}

function closeGlobalLightbox() {
    if (!lightboxImage) return;
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
    lightboxImage.src = '';
    if (!projectModal?.classList.contains('active')) {
        document.body.style.overflow = '';
    }
}

document.addEventListener('click', (e) => {
    const image = e.target.closest('img');
    if (!image) return;
    if (image.closest('.modal-close') || image.closest('.modal-icon')) return;
    if (image.classList.contains('no-lightbox')) return;
    e.preventDefault();
    e.stopPropagation();
    openGlobalLightbox(image);
});

if (lightboxClose) {
    lightboxClose.addEventListener('click', closeGlobalLightbox);
}

lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeGlobalLightbox();
});

// ===================================
// GESTION DU PREFERS-REDUCED-MOTION
// ===================================
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => el.classList.add('visible'));
}

// ===================================
// BADGE HEURES SUR LES CARTES PROJET
// ===================================
document.querySelectorAll('[data-project="true"][data-hours]').forEach(card => {
    const hours = card.dataset.hours;
    if (!hours) return;
    // Ne pas dupliquer si déjà présent
    if (card.querySelector('.card-hours-badge')) return;
    const badge = document.createElement('span');
    badge.className = 'card-hours-badge';
    badge.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="12" height="12"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>${hours}`;
    // Insérer avant .click-hint s'il existe, sinon à la fin de la carte
    const hint = card.querySelector('.click-hint');
    if (hint) {
        card.insertBefore(badge, hint);
    } else {
        card.appendChild(badge);
    }
});

// ===================================
// CONSOLE MESSAGE
// ===================================
console.log('%c🚀 Portfolio Edan RODDE', 'font-size: 24px; font-weight: bold; color: #6366f1;');
console.log('%c✨ Conçu avec passion pour l\'infrastructure IT', 'font-size: 14px; color: #94a3b8;');
