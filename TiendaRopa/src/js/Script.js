/* ═══════════════════════════════════════════════════════════
   MAISON — Alta Moda  |  js/script.js
═══════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ─── 1. NAVBAR: scroll shadow & active link ─── */
  const navbar = document.getElementById('mainNavbar');

  const handleScroll = () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    toggleBackToTop();
  };

  window.addEventListener('scroll', handleScroll, { passive: true });

  // Highlight active nav link by current page filename
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href && href !== '#' && currentPage.includes(href)) {
      link.classList.add('active');
    }
  });


  /* ─── 2. SEARCH FORM ─── */
  const searchForm = document.getElementById('searchForm');
  const searchInput = document.getElementById('searchInput');

  if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const query = searchInput.value.trim();
      if (query.length > 0) {
        // In a real store, redirect to: search.html?q=encodeURIComponent(query)
        console.log('[MAISON Search]:', query);
        searchInput.blur();
        showToast(`Buscando: "${query}"`);
      }
    });
  }


  /* ─── 3. DARK MODE TOGGLE ─── */
  const darkModeToggle = document.getElementById('darkModeToggle');
  const storedTheme = localStorage.getItem('maisonTheme');

  if (storedTheme) {
    applyTheme(storedTheme);
    if (darkModeToggle) darkModeToggle.checked = storedTheme === 'dark';
  }

  if (darkModeToggle) {
    darkModeToggle.addEventListener('change', () => {
      const newTheme = darkModeToggle.checked ? 'dark' : 'light';
      applyTheme(newTheme);
      localStorage.setItem('maisonTheme', newTheme);
    });
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
  }


  /* ─── 4. SETTINGS: LANGUAGE & CURRENCY ─── */
  const langSelect     = document.getElementById('langSelect');
  const currencySelect = document.getElementById('currencySelect');

  // Restore saved preferences
  if (langSelect && localStorage.getItem('maisonLang')) {
    langSelect.value = localStorage.getItem('maisonLang');
  }
  if (currencySelect && localStorage.getItem('maisonCurrency')) {
    currencySelect.value = localStorage.getItem('maisonCurrency');
  }


  /* ─── 5. SAVE SETTINGS BUTTON ─── */
  const saveBtn = document.getElementById('saveSettings');
  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      // Persist settings
      if (langSelect)     localStorage.setItem('maisonLang', langSelect.value);
      if (currencySelect) localStorage.setItem('maisonCurrency', currencySelect.value);

      const darkToggle = document.getElementById('darkModeToggle');
      if (darkToggle) {
        const theme = darkToggle.checked ? 'dark' : 'light';
        localStorage.setItem('maisonTheme', theme);
      }

      // Close offcanvas
      const offcanvasEl = document.getElementById('settingsOffcanvas');
      const offcanvas   = bootstrap.Offcanvas.getInstance(offcanvasEl);
      if (offcanvas) offcanvas.hide();

      // Show toast
      triggerSettingsToast();
    });
  }


  /* ─── 6. SETTINGS TOAST ─── */
  function triggerSettingsToast() {
    const toastEl = document.getElementById('settingsToast');
    if (!toastEl) return;
    const toast = bootstrap.Toast.getOrCreateInstance(toastEl, { delay: 3000 });
    toast.show();
  }

  function showToast(message) {
    const toastEl = document.getElementById('settingsToast');
    if (!toastEl) return;
    const body = toastEl.querySelector('.toast-body');
    if (body) body.innerHTML = `<i class="bi bi-search me-2"></i>${message}`;
    const toast = bootstrap.Toast.getOrCreateInstance(toastEl, { delay: 2500 });
    toast.show();
    // Reset label after it hides
    toastEl.addEventListener('hidden.bs.toast', () => {
      if (body) body.innerHTML = '<i class="bi bi-check-circle me-2"></i> Cambios guardados correctamente.';
    }, { once: true });
  }


  /* ─── 7. BACK TO TOP ─── */
  const backToTop = document.getElementById('backToTop');

  function toggleBackToTop() {
    if (!backToTop) return;
    if (window.scrollY > 400) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  }

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }


  /* ─── 8. NEWSLETTER FORM ─── */
  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = newsletterForm.querySelector('input[type="email"]');
      const email = emailInput ? emailInput.value.trim() : '';

      if (!email || !isValidEmail(email)) {
        emailInput.style.borderBottom = '2px solid #b84040';
        return;
      }

      // Simulate success
      emailInput.style.borderBottom = '';
      emailInput.value = '';
      showToast(`¡Gracias! Suscrito con ${email}`);
    });
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }


  /* ─── 9. PRODUCT WISHLIST BUTTONS (demo) ─── */
  document.querySelectorAll('.product-action-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const icon = btn.querySelector('i');
      if (icon && icon.classList.contains('bi-heart')) {
        icon.classList.replace('bi-heart', 'bi-heart-fill');
        btn.style.color = '#b84040';
        setTimeout(() => {
          icon.classList.replace('bi-heart-fill', 'bi-heart');
          btn.style.color = '';
        }, 2000);
      }
    });
  });


  /* ─── 10. CAROUSEL: pause on hover ─── */
  const carousel = document.getElementById('heroCarousel');
  if (carousel) {
    carousel.addEventListener('mouseenter', () => {
      bootstrap.Carousel.getInstance(carousel)?.pause();
    });
    carousel.addEventListener('mouseleave', () => {
      bootstrap.Carousel.getInstance(carousel)?.cycle();
    });
  }


  /* ─── 11. CATEGORY CARDS: keyboard navigation ─── */
  document.querySelectorAll('.category-card').forEach(card => {
    card.setAttribute('tabindex', '0');
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const link = card.querySelector('a');
        if (link) link.click();
      }
    });
  });


  /* ─── 12. ANNOUNCEMENT BAR: ticker (optional) ─── */
  // If the announcement bar has static text it's fine; 
  // for a marquee effect we'd clone the span. Kept simple here.

}); // end DOMContentLoaded