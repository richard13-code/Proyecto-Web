/* =========================================
   MAIN.JS — Tienda de Ropa Alta Moda
========================================= */

import { STORAGE_KEYS, SCROLL_CONFIG, API_CONFIG } from './config.js';
import { applyTheme, isValidEmail, triggerSettingsToast, showToast, getCartCookie, saveCartCookie, updateCartBadge } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {

  /* 1. NAVBAR */
  const navbar    = document.getElementById('mainNavbar');
  const backToTop = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    navbar?.classList.toggle('scrolled', window.scrollY > SCROLL_CONFIG.NAVBAR_SCROLL);
    if (backToTop) backToTop.classList.toggle('visible', window.scrollY > SCROLL_CONFIG.BACK_TO_TOP_SCROLL);
  }, { passive: true });

  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href && href !== '#' && currentPage.includes(href)) link.classList.add('active');
  });

  /* 2. SEARCH */
  document.getElementById('searchForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = document.getElementById('searchInput')?.value.trim();
    if (query) showToast(`Buscando: "${query}"`, 'bi-search');
  });

  /* 3. DARK MODE */
  const storedTheme = localStorage.getItem(STORAGE_KEYS.THEME);
  if (storedTheme) applyTheme(storedTheme);
  const darkModeToggle = document.getElementById('darkModeToggle');
  if (darkModeToggle) {
    darkModeToggle.checked = storedTheme === 'dark';
    darkModeToggle.addEventListener('change', () => {
      const theme = darkModeToggle.checked ? 'dark' : 'light';
      applyTheme(theme);
      localStorage.setItem(STORAGE_KEYS.THEME, theme);
    });
  }

  /* 4. IDIOMA Y MONEDA */
  const langSelect = document.getElementById('langSelect');
  if (langSelect) { const s = localStorage.getItem(STORAGE_KEYS.LANGUAGE); if (s) langSelect.value = s; }
  const currencySelect = document.getElementById('currencySelect');
  if (currencySelect) { const s = localStorage.getItem(STORAGE_KEYS.CURRENCY); if (s) currencySelect.value = s; }

  /* 5. GUARDAR SETTINGS */
  document.getElementById('saveSettings')?.addEventListener('click', () => {
    const theme = darkModeToggle?.checked ? 'dark' : 'light';
    applyTheme(theme);
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
    if (langSelect)     localStorage.setItem(STORAGE_KEYS.LANGUAGE, langSelect.value);
    if (currencySelect) localStorage.setItem(STORAGE_KEYS.CURRENCY, currencySelect.value);
    const offcanvasEl = document.getElementById('settingsOffcanvas');
    bootstrap.Offcanvas.getInstance(offcanvasEl)?.hide();
    triggerSettingsToast();
  });

  /* 6. BACK TO TOP */
  backToTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* 7. NEWSLETTER */
  document.getElementById('newsletterForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const emailInput = e.target.querySelector('input[type="email"]');
    const email = emailInput?.value.trim();
    if (!email || !isValidEmail(email)) { if (emailInput) emailInput.style.borderBottom = '2px solid #b84040'; return; }
    if (emailInput) { emailInput.style.borderBottom = ''; emailInput.value = ''; }
    showToast(`¡Gracias! Suscrito con ${email}`);
  });

  /* 8. FAVORITOS (tarjetas estáticas) */
  document.querySelectorAll('.product-action-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const icon = btn.querySelector('i');
      if (icon?.classList.contains('bi-heart')) {
        icon.classList.replace('bi-heart', 'bi-heart-fill');
        btn.style.color = '#b84040';
        setTimeout(() => { icon.classList.replace('bi-heart-fill', 'bi-heart'); btn.style.color = ''; }, 2000);
      }
    });
  });

  /* 9. CAROUSEL */
  const carousel = document.getElementById('heroCarousel');
  if (carousel) {
    carousel.addEventListener('mouseenter', () => bootstrap.Carousel.getInstance(carousel)?.pause());
    carousel.addEventListener('mouseleave', () => bootstrap.Carousel.getInstance(carousel)?.cycle());
  }

  /* 10. CATEGORY CARDS */
  document.querySelectorAll('.category-card').forEach(card => {
    card.setAttribute('tabindex', '0');
    card.addEventListener('keydown', (e) => { if (e.key === 'Enter') card.querySelector('a')?.click(); });
  });

  /* 10.5. PRODUCTOS DESTACADOS EN HOME */
  updateCartBadge();
  const featuredContainer = document.getElementById('featuredProductsContainer');
  if (featuredContainer) {
    fetch(API_CONFIG.PRODUCTS_URL)
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(products => {
        featuredContainer.innerHTML = '';
        products.slice(0, 4).forEach(product => {
          const col = document.createElement('div');
          col.className = 'col-6 col-lg-3';
          const tag = product.oldPrice
            ? `<span class="product-tag product-tag--sale">-${Math.round(((product.oldPrice-product.price)/product.oldPrice)*100)}%</span>`
            : (product.isNew ? `<span class="product-tag">Nuevo</span>` : '');
          const oldP = product.oldPrice ? `<span class="product-old-price">$${product.oldPrice.toLocaleString()}</span>` : '';
          col.innerHTML = `
            <div class="product-card" style="cursor:pointer;">
              <div class="product-img-wrap view-details" data-id="${product.id}">
                <img src="${product.image}" alt="${product.name}" class="product-img" loading="lazy" />
                <div class="product-actions" onclick="event.stopPropagation();">
                  <button class="product-action-btn btn-add-to-cart" data-id="${product.id}" aria-label="Añadir al carrito"><i class="bi bi-bag-plus"></i></button>
                </div>
                ${tag}
              </div>
              <div class="product-info view-details" data-id="${product.id}">
                <p class="product-category">${product.category.toUpperCase()}</p>
                <h4 class="product-name">${product.name}</h4>
                <p class="product-price">$${product.price.toLocaleString()} ${oldP}</p>
              </div>
            </div>`;
          featuredContainer.appendChild(col);
        });
        initAddToCartListeners();
        initDetailListeners();
      })
      .catch(() => { featuredContainer.innerHTML = `<p class="text-center text-danger my-5">Error al cargar productos.</p>`; });
  }

  /* 11. COLECCIÓN DINÁMICA (página coleccion.html) */
  const productsContainer = document.getElementById('productsContainer');
  if (productsContainer) {
    const urlParams      = new URLSearchParams(window.location.search);
    const temporadaParam = urlParams.get('temporada');
    const catParam       = urlParams.get('cat') || 'novedades';

    if (!temporadaParam) loadProductsByCategory(catParam);

    window.addEventListener('filterChanged', (e) => {
      const catView = document.getElementById('catView');
      if (catView?.style.display !== 'none') loadProductsByCategory(e.detail?.cat || 'novedades');
    });
  }

  function loadProductsByCategory(cat) {
    if (!productsContainer) return;
    const titles = { novedades:['Recién Llegado','Últimas Novedades'], mujer:['Descubre','Colección Mujer'], hombre:['Descubre','Colección Hombre'], ninos:['Descubre','Colección Niños'] };
    const [eyebrow, title] = titles[cat] || titles.novedades;
    const titleEl   = document.getElementById('collectionTitle');
    const eyebrowEl = document.getElementById('collectionEyebrow');
    if (titleEl)   titleEl.textContent   = title;
    if (eyebrowEl) eyebrowEl.textContent = eyebrow;

    productsContainer.innerHTML = `<div class="text-center my-5"><div class="spinner-border text-dark" role="status"><span class="visually-hidden">Cargando...</span></div></div>`;

    fetch(API_CONFIG.PRODUCTS_URL)
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(products => {
        const filtered = cat === 'novedades' ? products.filter(p => p.isNew) : products.filter(p => p.category === cat);
        productsContainer.innerHTML = '';
        if (!filtered.length) { productsContainer.innerHTML = `<p class="text-center my-5">No hay productos disponibles.</p>`; return; }
        filtered.forEach(product => {
          const col = document.createElement('div');
          col.className = 'col-6 col-lg-3';
          const tag = product.oldPrice
            ? `<span class="product-tag product-tag--sale">-${Math.round(((product.oldPrice-product.price)/product.oldPrice)*100)}%</span>`
            : (product.isNew ? `<span class="product-tag">Nuevo</span>` : '');
          const oldP = product.oldPrice ? `<span class="product-old-price">$${product.oldPrice.toLocaleString()}</span>` : '';
          col.innerHTML = `
            <div class="product-card" style="cursor:pointer;">
              <div class="product-img-wrap view-details" data-id="${product.id}">
                <img src="${product.image}" alt="${product.name}" class="product-img" loading="lazy" />
                <div class="product-actions" onclick="event.stopPropagation();">
                  <button class="product-action-btn btn-add-to-cart" data-id="${product.id}" aria-label="Añadir al carrito"><i class="bi bi-bag-plus"></i></button>
                </div>
                ${tag}
              </div>
              <div class="product-info view-details" data-id="${product.id}">
                <p class="product-category">${product.category.toUpperCase()}</p>
                <h4 class="product-name">${product.name}</h4>
                <p class="product-price">$${product.price.toLocaleString()} ${oldP}</p>
              </div>
            </div>`;
          productsContainer.appendChild(col);
        });
        initAddToCartListeners();
        initDetailListeners();
      })
      .catch(() => { productsContainer.innerHTML = `<p class="text-center text-danger my-5">Error al cargar productos.</p>`; });
  }

  /* CARRITO — añadir */
  function initAddToCartListeners() {
    document.querySelectorAll('.btn-add-to-cart').forEach(btn => {
      if (btn.dataset.listenerAdded) return;
      btn.dataset.listenerAdded = 'true';
      btn.addEventListener('click', (e) => {
        e.preventDefault(); e.stopPropagation();
        const id = parseInt(e.target.closest('.btn-add-to-cart').getAttribute('data-id'));
        let cart = getCartCookie();
        const item = cart.find(i => i.id === id);
        if (item) item.quantity += 1; else cart.push({ id, quantity: 1 });
        saveCartCookie(cart); updateCartBadge();
        showToast('Producto añadido al carrito', 'bi-bag-check');
      });
    });
  }

  /* MODAL — detalle producto */
  function initDetailListeners() {
    document.querySelectorAll('.view-details').forEach(el => {
      if (el.dataset.listenerAdded) return;
      el.dataset.listenerAdded = 'true';
      el.addEventListener('click', () => {
        const id = parseInt(el.getAttribute('data-id'));
        fetch(API_CONFIG.PRODUCTS_URL).then(r => r.json()).then(products => {
          const p = products.find(p => p.id === id);
          if (!p) return;
          document.getElementById('modalProductImg').src                   = p.image;
          document.getElementById('modalProductImg').alt                   = p.name;
          document.getElementById('modalProductCategory').textContent      = p.category.toUpperCase();
          document.getElementById('modalProductName').textContent          = p.name;
          document.getElementById('modalProductPrice').textContent         = `$${p.price.toLocaleString()}`;
          const desc = document.querySelector('#productDetailModal .modal-body p.text-muted');
          if (desc && p.description) desc.textContent = p.description;
          document.getElementById('modalBtnAddToCart')?.setAttribute('data-id', p.id);
          bootstrap.Modal.getOrCreateInstance(document.getElementById('productDetailModal')).show();
        });
      });
    });
  }

  /* MODAL — botón añadir */
  document.getElementById('modalBtnAddToCart')?.addEventListener('click', (e) => {
    const id = parseInt(e.currentTarget.getAttribute('data-id'));
    let cart = getCartCookie();
    const item = cart.find(i => i.id === id);
    if (item) item.quantity += 1; else cart.push({ id, quantity: 1 });
    saveCartCookie(cart); updateCartBadge();
    bootstrap.Modal.getInstance(document.getElementById('productDetailModal'))?.hide();
    showToast('Producto añadido al carrito', 'bi-bag-check');
  });

  /* 12. CARRITO */
  const cartTableBody = document.getElementById('cartTableBody');
  if (cartTableBody) renderCart();

  function renderCart() {
    const cart = getCartCookie();
    const empty = document.getElementById('emptyCartMessage');
    if (!cart.length) {
      if (cartTableBody) cartTableBody.innerHTML = '';
      empty?.classList.remove('d-none');
      document.getElementById('cartSubtotal').textContent = '$0';
      document.getElementById('cartTotal').textContent    = '$0';
      return;
    }
    empty?.classList.add('d-none');
    fetch(API_CONFIG.PRODUCTS_URL).then(r => r.json()).then(products => {
      if (!cartTableBody) return;
      cartTableBody.innerHTML = '';
      let total = 0;
      cart.forEach(item => {
        const p = products.find(p => p.id === item.id);
        if (!p) return;
        const itemTotal = p.price * item.quantity;
        total += itemTotal;
        const row = document.createElement('tr');
        row.innerHTML = `
          <td><div class="d-flex align-items-center">
            <img src="${p.image}" alt="${p.name}" style="width:60px;height:80px;object-fit:cover;" class="me-3">
            <div><h5 class="h6 mb-0">${p.name}</h5><small class="text-muted">${p.category.toUpperCase()}</small></div>
          </div></td>
          <td class="text-center">
            <div class="d-flex justify-content-center align-items-center">
              <button class="btn btn-sm btn-outline-secondary rounded-0 btn-qty-minus" data-id="${item.id}">-</button>
              <span class="mx-3">${item.quantity}</span>
              <button class="btn btn-sm btn-outline-secondary rounded-0 btn-qty-plus" data-id="${item.id}">+</button>
            </div>
          </td>
          <td class="text-end">$${itemTotal.toLocaleString()}</td>
          <td class="text-end"><button class="btn btn-link text-danger btn-delete-item" data-id="${item.id}"><i class="bi bi-trash"></i></button></td>`;
        cartTableBody.appendChild(row);
      });
      document.getElementById('cartSubtotal').textContent = `$${total.toLocaleString()}`;
      document.getElementById('cartTotal').textContent    = `$${total.toLocaleString()}`;
      initCartListeners();
    });
  }

  function initCartListeners() {
    let cart = getCartCookie();
    document.querySelectorAll('.btn-qty-minus').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.getAttribute('data-id'));
        const item = cart.find(i => i.id === id);
        if (item) { item.quantity -= 1; if (item.quantity <= 0) cart = cart.filter(i => i.id !== id); saveCartCookie(cart); updateCartBadge(); renderCart(); }
      });
    });
    document.querySelectorAll('.btn-qty-plus').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.getAttribute('data-id'));
        const item = cart.find(i => i.id === id);
        if (item) { item.quantity += 1; saveCartCookie(cart); updateCartBadge(); renderCart(); }
      });
    });
    document.querySelectorAll('.btn-delete-item').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.getAttribute('data-id'));
        cart = cart.filter(i => i.id !== id);
        saveCartCookie(cart); updateCartBadge(); renderCart();
        showToast('Producto removido del carrito', 'bi-trash');
      });
    });
    document.getElementById('btnCheckout')?.addEventListener('click', () => {
      showToast('¡Gracias por tu compra! Procesando pedido...', 'bi-credit-card');
      saveCartCookie([]); updateCartBadge();
      setTimeout(() => window.location.href = 'index.html', 2500);
    });
  }

});