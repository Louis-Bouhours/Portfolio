/* ===================================================================
 * Louis Bouhours Portfolio - Main JS (UI Core)
 * -------------------------------------------------------------------
 * - Gère uniquement l'UI globale (préloader, navigation, scroll, etc.)
 * - Toute la logique dynamique GitHub + Terminal est dans script.js
 * ------------------------------------------------------------------- */

(function(html) {

    'use strict';

    /* --------------------------------------------------
     * Préloader (fusion logique custom + précédent)
     * -------------------------------------------------- */
    const initPreloader = () => {
        const preloader = document.querySelector('#preloader');
        if (!preloader) return;

        html.classList.add('ss-preload');

        window.addEventListener('load', () => {
            html.classList.remove('ss-preload');
            html.classList.add('ss-loaded');

            setTimeout(() => {
                preloader.style.opacity = '0';
                setTimeout(() => {
                    preloader.style.display = 'none';
                    document.body.classList.add('ss-show');
                }, 500);
            }, 500);
        });
    };

    /* --------------------------------------------------
     * Navbar (effet scroll)
     * -------------------------------------------------- */
    const initNavbarScrollEffect = () => {
        const navbar = document.querySelector('#navbar');
        if (!navbar) return;

        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('bg-dark-900/90', 'backdrop-blur-md', 'shadow-lg', 'navbar-fixed');
            } else {
                navbar.classList.remove('bg-dark-900/90', 'backdrop-blur-md', 'shadow-lg', 'navbar-fixed');
            }
        });
    };

    /* --------------------------------------------------
     * Menu mobile
     * -------------------------------------------------- */
    const initMobileMenu = () => {
        const menuToggle = document.getElementById('menu-toggle');
        const mobileMenu = document.getElementById('mobile-menu');
        if (!(menuToggle && mobileMenu)) return;

        menuToggle.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });

        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
            });
        });
    };

    /* --------------------------------------------------
     * Smooth scroll + fermeture menu mobile
     * -------------------------------------------------- */
    const initSmoothScroll = () => {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', e => {
                const targetId = anchor.getAttribute('href');
                if (!targetId || targetId === '#') return;
                const el = document.querySelector(targetId);
                if (!el) return;
                e.preventDefault();
                el.scrollIntoView({ behavior: 'smooth' });

                const mobileMenu = document.getElementById('mobile-menu');
                if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                    mobileMenu.classList.add('hidden');
                }
            });
        });
    };

    /* --------------------------------------------------
     * ScrollSpy (activation des liens nav)
     * -------------------------------------------------- */
    const initScrollSpy = () => {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('nav a[href^="#"]');
        if (!sections.length || !navLinks.length) return;

        window.addEventListener('scroll', () => {
            let current = '';
            sections.forEach(section => {
                const top = section.offsetTop;
                if (pageYOffset >= top - 200) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('text-white');
                link.classList.add('text-gray-400');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('text-white');
                    link.classList.remove('text-gray-400');
                }
            });
        });
    };

    /* --------------------------------------------------
     * Bouton "Retour en haut" (si custom)
     * -------------------------------------------------- */
    const initBackToTop = () => {
        const backToTop = document.querySelector('a[href="#home"]');
        if (!backToTop) return;

        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                backToTop.classList.add('visible');
                backToTop.classList.remove('invisible');
            } else {
                backToTop.classList.remove('visible');
                backToTop.classList.add('invisible');
            }
        });
    };

    /* --------------------------------------------------
     * Formulaire de contact (mailto)
     * -------------------------------------------------- */
    const initContactForm = () => {
        const form = document.getElementById('contact-form');
        if (!form) return;

        form.addEventListener('submit', e => {
            e.preventDefault();
            const name = form.querySelector('#name').value.trim();
            const email = form.querySelector('#email').value.trim();
            const message = form.querySelector('#message').value.trim();

            const mailtoLink = `mailto:louis.bouhours1302@gmail.com?subject=Contact depuis le portfolio&body=${encodeURIComponent(
                `De: ${name} (${email})\n\n${message}`
            )}`;

            window.location.href = mailtoLink;
        });
    };

    /* --------------------------------------------------
     * INIT
     * -------------------------------------------------- */
    (function init() {
        initPreloader();
        initNavbarScrollEffect();
        initMobileMenu();
        initSmoothScroll();
        initScrollSpy();
        initBackToTop();
        initContactForm();
        // IMPORTANT : aucune logique GitHub ou Terminal ici (voir script.js)
    })();

})(document.documentElement);