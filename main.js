/* ========================================
   MAIN.JS — Cami Roa Portfolio
   All interactive features
   ======================================== */

/* ========================================
   1. SCROLL REVEAL — IntersectionObserver
   ======================================== */
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ========================================
   2. HEADER — Solid background on scroll
   ======================================== */
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY > 50) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
        header.style.boxShadow = '0 1px 8px rgba(0,0,0,0.06)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = 'none';
    }
}, { passive: true });

/* ========================================
   3. HERO PARALLAX — Subtle scroll effect
   ======================================== */
const heroContent = document.querySelector('.hero-content');
if (heroContent) {
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const heroHeight = window.innerHeight;
        if (scrollY < heroHeight) {
            const progress = scrollY / heroHeight;
            heroContent.style.transform = `translateY(${scrollY * 0.15}px)`;
            heroContent.style.opacity = 1 - progress * 0.6;
        }
    }, { passive: true });
}

/* ========================================
   4. CARD TILT — 3D hover effect on cards
   ======================================== */
function initTiltCards(selector) {
    document.querySelectorAll(selector).forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / centerY * -4;
            const rotateY = (x - centerX) / centerX * 4;
            card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateY(0)';
            card.style.transition = 'transform 0.4s ease';
        });
        card.addEventListener('mouseenter', () => {
            card.style.transition = 'transform 0.1s ease';
        });
    });
}
initTiltCards('.sc-card');
initTiltCards('.project-card');

/* ========================================
   5. MAGNETIC BUTTONS — Follow cursor
   ======================================== */
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
    });
    btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0, 0)';
        btn.style.transition = 'transform 0.3s ease';
    });
    btn.addEventListener('mouseenter', () => {
        btn.style.transition = 'transform 0.1s ease';
    });
});

/* ========================================
   6. TEXT SCRAMBLE — On service card hover
   ======================================== */
const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*';
function scrambleText(el) {
    const original = el.dataset.original || el.textContent;
    el.dataset.original = original;
    let iteration = 0;
    const maxIterations = original.length;
    const interval = setInterval(() => {
        el.textContent = original.split('').map((char, i) => {
            if (i < iteration) return original[i];
            return chars[Math.floor(Math.random() * chars.length)];
        }).join('');
        iteration += 1 / 2;
        if (iteration >= maxIterations) {
            clearInterval(interval);
            el.textContent = original;
        }
    }, 30);
}

document.querySelectorAll('.sc-card h3').forEach(h3 => {
    const card = h3.closest('.sc-card');
    card.addEventListener('mouseenter', () => scrambleText(h3));
});

/* ========================================
   7. SMOOTH ANCHOR SCROLL
   ======================================== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

/* ========================================
   8. ACTIVE NAV LINK — Highlight on scroll
   ======================================== */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        if (window.scrollY >= sectionTop) {
            current = section.getAttribute('id');
        }
    });
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
        }
    });
}, { passive: true });

/* ========================================
   9. CURSOR FOLLOWER — Subtle dot
   ======================================== */
if (window.matchMedia('(pointer: fine)').matches) {
    const cursor = document.createElement('div');
    cursor.className = 'cursor-follower';
    document.body.appendChild(cursor);

    let cursorX = 0, cursorY = 0;
    let targetX = 0, targetY = 0;

    document.addEventListener('mousemove', (e) => {
        targetX = e.clientX;
        targetY = e.clientY;
    });

    function updateCursor() {
        cursorX += (targetX - cursorX) * 0.12;
        cursorY += (targetY - cursorY) * 0.12;
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
        requestAnimationFrame(updateCursor);
    }
    updateCursor();

    document.querySelectorAll('a, button, .project-card, .sc-card').forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('active'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('active'));
    });
}

/* ========================================
   10. PROJECT MODAL
   ======================================== */
const projects = {
    'project-1': {
        title: 'Proyecto 01',
        tag: 'Diseño + Desarrollo',
        fullDescription: 'Diseño y desarrollo de una experiencia web pensada para transmitir la identidad de la marca y facilitar la navegación de sus usuarios.',
        tech: ['HTML', 'CSS', 'JavaScript', 'Responsive Design'],
        links: [{ label: 'Ver proyecto', url: '#', primary: true }]
    },
    'project-2': {
        title: 'Proyecto 02',
        tag: 'Landing page',
        fullDescription: 'Landing page diseñada para presentar una propuesta de forma clara, visual y estratégica.',
        tech: ['HTML', 'CSS', 'Animaciones CSS'],
        links: [{ label: 'Ver proyecto', url: '#', primary: true }]
    },
    'project-3': {
        title: 'Proyecto 03',
        tag: 'Sitio web completo',
        fullDescription: 'Sitio web para una marca que necesitaba una presencia digital profesional y alineada con su identidad.',
        tech: ['HTML', 'CSS', 'JavaScript', 'Responsive Design'],
        links: [{ label: 'Ver proyecto', url: '#', primary: true }]
    }
};

const modalOverlay = document.getElementById('project-modal');
const modalContent = document.getElementById('modal-content');
const modalClose = document.getElementById('modal-close');

document.querySelectorAll('.project-card[data-project]').forEach(card => {
    card.addEventListener('click', () => {
        const project = projects[card.dataset.project];
        if (!project) return;
        modalContent.innerHTML = `
            <span class="modal-tag">${project.tag}</span>
            <h2 id="modal-title">${project.title}</h2>
            <p class="modal-description">${project.fullDescription}</p>
            <h3>Tecnologías</h3>
            <div class="modal-tech">
                ${project.tech.map(t => `<span class="tech-tag">${t}</span>`).join('')}
            </div>
            <div class="modal-links">
                ${project.links.map(l => `<a href="${l.url}" class="modal-link ${l.primary ? 'primary' : 'secondary'}" target="_blank">${l.label}</a>`).join('')}
            </div>
        `;
        modalOverlay.hidden = false;
        document.body.style.overflow = 'hidden';
        modalClose.focus();
    });
});

modalClose.addEventListener('click', () => {
    modalOverlay.hidden = true;
    document.body.style.overflow = '';
});

modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
        modalOverlay.hidden = true;
        document.body.style.overflow = '';
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modalOverlay.hidden) {
        modalOverlay.hidden = true;
        document.body.style.overflow = '';
    }
});

/* ========================================
   11. HAMBURGER MENU
   ======================================== */
const navToggle = document.getElementById('nav-toggle');
const navLinksMobile = document.getElementById('nav-links');

if (navToggle && navLinksMobile) {
    navToggle.addEventListener('click', () => {
        navLinksMobile.classList.toggle('open');
        navToggle.classList.toggle('active');
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinksMobile.classList.remove('open');
            navToggle.classList.remove('active');
        });
    });
}
