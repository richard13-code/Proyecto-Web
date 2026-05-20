/* =========================================
   MAIN.JS
========================================= */

import {
  STORAGE_KEYS,
  SCROLL_CONFIG
} from './config.js';

import {
  applyTheme,
  isValidEmail,
  triggerSettingsToast,
  showToast
} from './utils.js';


document.addEventListener('DOMContentLoaded', () => {

  /* =========================================
     1. NAVBAR
  ========================================= */

  const navbar = document.getElementById('mainNavbar');
  const backToTop = document.getElementById('backToTop');

  const handleScroll = () => {

    // Navbar shadow
    if (window.scrollY > SCROLL_CONFIG.NAVBAR_SCROLL) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }

    // Back to top button
    if (backToTop) {

      if (window.scrollY > SCROLL_CONFIG.BACK_TO_TOP_SCROLL) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }

    }

  };

  window.addEventListener('scroll', handleScroll, {
    passive: true
  });

  // Active nav link
  const currentPage =
    window.location.pathname.split('/').pop() || 'index.html';

  document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {

    const href = link.getAttribute('href');

    if (href && href !== '#' && currentPage.includes(href)) {
      link.classList.add('active');
    }

  });


  /* =========================================
     2. SEARCH FORM
  ========================================= */

  const searchForm = document.getElementById('searchForm');
  const searchInput = document.getElementById('searchInput');

  if (searchForm) {

    searchForm.addEventListener('submit', (e) => {

      e.preventDefault();

      const query = searchInput.value.trim();

      if (query.length > 0) {

        console.log('[MAISON Search]:', query);

        searchInput.blur();

        showToast(
          `Buscando: "${query}"`,
          'bi-search'
        );

      }

    });

  }


  /* =========================================
     3. DARK MODE
  ========================================= */

  const darkModeToggle =
    document.getElementById('darkModeToggle');

  const storedTheme =
    localStorage.getItem(STORAGE_KEYS.THEME);

  if (storedTheme) {

    applyTheme(storedTheme);

    if (darkModeToggle) {
      darkModeToggle.checked = storedTheme === 'dark';
    }

  }

  if (darkModeToggle) {

    darkModeToggle.addEventListener('change', () => {

      const newTheme =
        darkModeToggle.checked ? 'dark' : 'light';

      applyTheme(newTheme);

      localStorage.setItem(
        STORAGE_KEYS.THEME,
        newTheme
      );

    });

  }


  /* =========================================
     4. LANGUAGE & CURRENCY
  ========================================= */

  const langSelect =
    document.getElementById('langSelect');

  const currencySelect =
    document.getElementById('currencySelect');

  // Restore saved preferences
  if (
    langSelect &&
    localStorage.getItem(STORAGE_KEYS.LANGUAGE)
  ) {

    langSelect.value =
      localStorage.getItem(STORAGE_KEYS.LANGUAGE);

  }

  if (
    currencySelect &&
    localStorage.getItem(STORAGE_KEYS.CURRENCY)
  ) {

    currencySelect.value =
      localStorage.getItem(STORAGE_KEYS.CURRENCY);

  }


  /* =========================================
     5. SAVE SETTINGS
  ========================================= */

  const saveBtn =
    document.getElementById('saveSettings');

  if (saveBtn) {

    saveBtn.addEventListener('click', () => {

      // Save language
      if (langSelect) {

        localStorage.setItem(
          STORAGE_KEYS.LANGUAGE,
          langSelect.value
        );

      }

      // Save currency
      if (currencySelect) {

        localStorage.setItem(
          STORAGE_KEYS.CURRENCY,
          currencySelect.value
        );

      }

      // Save theme
      if (darkModeToggle) {

        const theme =
          darkModeToggle.checked ? 'dark' : 'light';

        localStorage.setItem(
          STORAGE_KEYS.THEME,
          theme
        );

      }

      // Close offcanvas
      const offcanvasEl =
        document.getElementById('settingsOffcanvas');

      const offcanvas =
        bootstrap.Offcanvas.getInstance(offcanvasEl);

      if (offcanvas) {
        offcanvas.hide();
      }

      // Show success toast
      triggerSettingsToast();

    });

  }


  /* =========================================
     6. BACK TO TOP
  ========================================= */

  if (backToTop) {

    backToTop.addEventListener('click', () => {

      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });

    });

  }


  /* =========================================
     7. NEWSLETTER FORM
  ========================================= */

  const newsletterForm =
    document.getElementById('newsletterForm');

  if (newsletterForm) {

    newsletterForm.addEventListener('submit', (e) => {

      e.preventDefault();

      const emailInput =
        newsletterForm.querySelector('input[type="email"]');

      const email =
        emailInput ? emailInput.value.trim() : '';

      if (!email || !isValidEmail(email)) {

        emailInput.style.borderBottom =
          '2px solid #b84040';

        return;

      }

      // Success
      emailInput.style.borderBottom = '';

      emailInput.value = '';

      showToast(
        `¡Gracias! Suscrito con ${email}`
      );

    });

  }


  /* =========================================
     8. PRODUCT ACTION BUTTONS
  ========================================= */

  document
    .querySelectorAll('.product-action-btn')
    .forEach(btn => {

      btn.addEventListener('click', (e) => {

        e.stopPropagation();

        const icon = btn.querySelector('i');

        if (
          icon &&
          icon.classList.contains('bi-heart')
        ) {

          icon.classList.replace(
            'bi-heart',
            'bi-heart-fill'
          );

          btn.style.color = '#b84040';

          setTimeout(() => {

            icon.classList.replace(
              'bi-heart-fill',
              'bi-heart'
            );

            btn.style.color = '';

          }, 2000);

        }

      });

    });


  /* =========================================
     9. CAROUSEL
  ========================================= */

  const carousel =
    document.getElementById('heroCarousel');

  if (carousel) {

    carousel.addEventListener('mouseenter', () => {

      bootstrap
        .Carousel
        .getInstance(carousel)
        ?.pause();

    });

    carousel.addEventListener('mouseleave', () => {

      bootstrap
        .Carousel
        .getInstance(carousel)
        ?.cycle();

    });

  }


  /* =========================================
     10. CATEGORY CARDS
  ========================================= */

  document
    .querySelectorAll('.category-card')
    .forEach(card => {

      card.setAttribute('tabindex', '0');

      card.addEventListener('keydown', (e) => {

        if (e.key === 'Enter') {

          const link = card.querySelector('a');

          if (link) {
            link.click();
          }

        }

      });

    });

});