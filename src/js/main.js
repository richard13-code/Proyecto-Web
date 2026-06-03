/* =========================================
   MAIN.JS
========================================= */

import {
  STORAGE_KEYS,
  SCROLL_CONFIG,
  API_CONFIG
} from './config.js';

import {
  applyTheme,
  isValidEmail,
  triggerSettingsToast,
  showToast,
  getCartCookie,    
  saveCartCookie, 
  updateCartBadge
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

    /* =========================================
     10.5. CONTROLADOR DE DESTACADOS EN PÁGINA PRINCIPAL (HOME)
  ========================================= */
  const featuredContainer = document.getElementById('featuredProductsContainer');

  if (featuredContainer) {
    fetch(API_CONFIG.PRODUCTS_URL)
      .then(response => {
        if (!response.ok) throw new Error('Error al conectar con la base de datos de productos');
        return response.json();
      })
      .then(products => {
        featuredContainer.innerHTML = ''; // Quitamos el spinner de carga

        // Tomaremos únicamente los primeros 4 productos del JSON para la sección de destacados
        const featuredProducts = products.slice(0, 4);

        if (featuredProducts.length === 0) {
          featuredContainer.innerHTML = `<p class="text-center my-5">No hay productos destacados disponibles en este momento.</p>`;
          return;
        }

        // Renderizamos las tarjetas dinámicas con la misma estructura visual
        featuredProducts.forEach(product => {
          const cardCol = document.createElement('div');
          cardCol.className = 'col-6 col-lg-3';

          const tagHtml = product.oldPrice 
            ? `<span class="product-tag product-tag--sale">-${Math.round(((product.oldPrice - product.price)/product.oldPrice)*100)}%</span>`
            : (product.isNew ? `<span class="product-tag">Nuevo</span>` : '');

          const oldPriceHtml = product.oldPrice 
            ? `<span class="product-old-price">$${product.oldPrice.toLocaleString()}</span>` 
            : '';

          cardCol.innerHTML = `
            <div class="product-card" style="cursor: pointer;">
              <div class="product-img-wrap view-details" data-id="${product.id}">
                <img src="${product.image}" alt="${product.name}" class="product-img" loading="lazy" />
                <div class="product-actions" onclick="event.stopPropagation();">
                  <button class="product-action-btn btn-add-to-cart" data-id="${product.id}" aria-label="Añadir al carrito">
                    <i class="bi bi-bag-plus"></i>
                  </button>
                </div>
                ${tagHtml}
              </div>
              <div class="product-info view-details" data-id="${product.id}">
                <p class="product-category">${product.category.toUpperCase()}</p>
                <h4 class="product-name">${product.name}</h4>
                <p class="product-price">$${product.price.toLocaleString()} ${oldPriceHtml}</p>
              </div>
            </div>
          `;
          featuredContainer.appendChild(cardCol);
        });

        // Activamos los escuchadores para que funcionen las interacciones en el Home
        initAddToCartListeners();
        initDetailListeners();
      })
      .catch(error => {
        console.error('[MAISON Home API Error]:', error);
        featuredContainer.innerHTML = `<p class="text-center text-danger my-5">Hubo un problema al cargar los productos destacados.</p>`;
      });
  }


/* =========================================
     11. CONTROLADOR DE COLECCIÓN ÚNICA DINÁMICA (API REST)
  ========================================= */

  // Forzar actualización del número de la bolsa al entrar a cualquier página
  updateCartBadge();

  const productsContainer = document.getElementById('productsContainer');
  
  if (productsContainer) {
    // Leemos la variable "?cat=" de la barra de direcciones de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const categoryToFilter = urlParams.get('cat') || 'novedades'; 

    let pageTitle = '';
    let pageEyebrow = 'Descubre';

    // Cambiamos dinámicamente los textos de la cabecera según el parámetro
    switch (categoryToFilter) {
      case 'hombre':
        pageTitle = 'Colección Hombre';
        break;
      case 'mujer':
        pageTitle = 'Colección Mujer';
        break;
      case 'ninos':
        pageTitle = 'Colección Niños';
        break;
      case 'novedades':
      default:
        pageTitle = 'Últimas Novedades';
        pageEyebrow = 'Recién Llegado';
        break;
    }

    const titleEl = document.getElementById('collectionTitle');
    const eyebrowEl = document.getElementById('collectionEyebrow');
    if (titleEl) titleEl.textContent = pageTitle;
    if (eyebrowEl) eyebrowEl.textContent = pageEyebrow;

    // ─── CONSUMO DE LA API REST SIMULADA ───
    fetch(API_CONFIG.PRODUCTS_URL)
      .then(response => {
        if (!response.ok) throw new Error('Error al conectar con la base de datos de productos');
        return response.json();
      })
      .then(products => {
        // Filtrado de datos asíncronos de la API
        let filteredProducts = [];
        if (categoryToFilter === 'novedades') {
          filteredProducts = products.filter(p => p.isNew === true);
        } else {
          filteredProducts = products.filter(p => p.category === categoryToFilter);
        }

        // --- RENDERIZADO DINÁMICO EN HTML ---
        productsContainer.innerHTML = ''; // Limpiamos el spinner de carga

        if (filteredProducts.length === 0) {
          productsContainer.innerHTML = `<p class="text-center my-5">No hay productos disponibles en esta colección por el momento.</p>`;
          return;
        }

        // Construcción de tarjetas replicando tu diseño elegante
        filteredProducts.forEach(product => {
          const cardCol = document.createElement('div');
          cardCol.className = 'col-6 col-lg-3';

          const tagHtml = product.oldPrice 
            ? `<span class="product-tag product-tag--sale">-${Math.round(((product.oldPrice - product.price)/product.oldPrice)*100)}%</span>`
            : (product.isNew ? `<span class="product-tag">Nuevo</span>` : '');

          const oldPriceHtml = product.oldPrice 
            ? `<span class="product-old-price">$${product.oldPrice.toLocaleString()}</span>` 
            : '';

          cardCol.innerHTML = `
            <div class="product-card" style="cursor: pointer;">
              <div class="product-img-wrap view-details" data-id="${product.id}">
                <img src="${product.image}" alt="${product.name}" class="product-img" loading="lazy" />
                <div class="product-actions" onclick="event.stopPropagation();">
                  <button class="product-action-btn btn-add-to-cart" data-id="${product.id}" aria-label="Añadir al carrito">
                    <i class="bi bi-bag-plus"></i>
                  </button>
                </div>
                ${tagHtml}
              </div>
              <div class="product-info view-details" data-id="${product.id}">
                <p class="product-category">${product.category.toUpperCase()}</p>
                <h4 class="product-name">${product.name}</h4>
                <p class="product-price">$${product.price.toLocaleString()} ${oldPriceHtml}</p>
              </div>
            </div>
          `;
          productsContainer.appendChild(cardCol);
        });

        // ¡ACTIVAMOS AMBOS ESCUCHADORES AL TERMINAR DE RENDERIZAR!
        initAddToCartListeners();
        initDetailListeners();
      })
      .catch(error => {
        console.error('[MAISON API Error]:', error);
        productsContainer.innerHTML = `<p class="text-center text-danger my-5">Hubo un problema al cargar los productos. Por favor intenta más tarde.</p>`;
      });
  }

  // Lógica corregida para manejar el click en la tarjeta e insertar datos en la Cookie
  function initAddToCartListeners() {
    document.querySelectorAll('.btn-add-to-cart').forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation(); // Evitamos que abra el modal por accidente
        
        // Buscamos el data-id de forma segura en el botón contenedor mas cercano
        const targetBtn = e.target.closest('.btn-add-to-cart');
        const productId = parseInt(targetBtn.getAttribute('data-id'));
        
        let cart = getCartCookie();
        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
          existingItem.quantity += 1;
        } else {
          cart.push({ id: productId, quantity: 1 });
        }
        
        saveCartCookie(cart);
        updateCartBadge();
        showToast('Producto añadido al carrito con éxito', 'bi-bag-check');
      });
    });
  }

  // Abre el Modal rellenando dinámicamente la información desde el JSON
  function initDetailListeners() {
    document.querySelectorAll('.view-details').forEach(element => {
      element.addEventListener('click', () => {
        const productId = parseInt(element.getAttribute('data-id'));
        
        fetch(API_CONFIG.PRODUCTS_URL)
          .then(res => res.json())
          .then(products => {
            const product = products.find(p => p.id === productId);
            if (!product) return;

            document.getElementById('modalProductImg').src = product.image;
            document.getElementById('modalProductImg').alt = product.name;
            document.getElementById('modalProductCategory').textContent = product.category.toUpperCase();
            document.getElementById('modalProductName').textContent = product.name;
            document.getElementById('modalProductPrice').textContent = `$${product.price.toLocaleString()}`;       

            const modalDescription = document.querySelector('#productDetailModal .modal-body p.text-muted');
            const modalBtn = document.getElementById('modalBtnAddToCart'); 

            if (modalDescription) modalDescription.textContent = product.description;
         
            if (modalBtn) modalBtn.setAttribute('data-id', product.id);

            const modalEl = document.getElementById('productDetailModal');
            if (modalEl) {
              const detailModal = bootstrap.Modal.getOrCreateInstance(modalEl);
              detailModal.show();
            }
          });
      });
    });
  }

  // Evento para el botón interno que está DENTRO del modal de detalles
  const modalBtnAddToCart = document.getElementById('modalBtnAddToCart');
  if (modalBtnAddToCart) {
    modalBtnAddToCart.addEventListener('click', (e) => {
      const productId = parseInt(e.currentTarget.getAttribute('data-id'));
      
      let cart = getCartCookie();
      const existingItem = cart.find(item => item.id === productId);
      
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.push({ id: productId, quantity: 1 });
      }
      
      saveCartCookie(cart);
      updateCartBadge();
      
      const modalEl = document.getElementById('productDetailModal');
      if (modalEl) {
        const detailModal = bootstrap.Modal.getInstance(modalEl);
        detailModal?.hide();
      }
      
      showToast('Producto añadido al carrito con éxito', 'bi-bag-check');
    });
  }

  /* =========================================
     12. CONTROLADOR DE LA VISTA DEL CARRITO
  ========================================= */
  const cartTableBody = document.getElementById('cartTableBody');
  
  if (cartTableBody) {
    renderCart();
  }

  function renderCart() {
    const cart = getCartCookie();
    const emptyCartMessage = document.getElementById('emptyCartMessage');
    
    if (cart.length === 0) {
      if (cartTableBody) cartTableBody.innerHTML = '';
      emptyCartMessage?.classList.remove('d-none');
      document.getElementById('cartSubtotal').textContent = '$0';
      document.getElementById('cartTotal').textContent = '$0';
      return;
    }
    
    emptyCartMessage?.classList.add('d-none');

    fetch(API_CONFIG.PRODUCTS_URL)
      .then(res => res.json())
      .then(products => {
        if (!cartTableBody) return;
        cartTableBody.innerHTML = '';
        let totalCuenta = 0;

        cart.forEach(item => {
          const productData = products.find(p => p.id === item.id);
          
          if (productData) {
            const itemTotal = productData.price * item.quantity;
            totalCuenta += itemTotal;

            const row = document.createElement('tr');
            row.innerHTML = `
              <td>
                <div class="d-flex align-items-center">
                  <img src="${productData.image}" alt="${productData.name}" style="width: 60px; height: 80px; object-fit: cover;" class="me-3">
                  <div>
                    <h5 class="h6 mb-0">${productData.name}</h5>
                    <small class="text-muted">${productData.category.toUpperCase()}</small>
                  </div>
                </div>
              </td>
              <td class="text-center">
                <div class="d-flex justify-content-center align-items-center">
                  <button class="btn btn-sm btn-outline-secondary rounded-0 btn-qty-minus" data-id="${item.id}">-</button>
                  <span class="mx-3">${item.quantity}</span>
                  <button class="btn btn-sm btn-outline-secondary rounded-0 btn-qty-plus" data-id="${item.id}">+</button>
                </div>
              </td>
              <td class="text-end">$${itemTotal.toLocaleString()}</td>
              <td class="text-end">
                <button class="btn btn-link text-danger btn-delete-item" data-id="${item.id}">
                  <i class="bi bi-trash"></i>
                </button>
              </td>
            `;
            cartTableBody.appendChild(row);
          }
        });

        document.getElementById('cartSubtotal').textContent = `$${totalCuenta.toLocaleString()}`;
        document.getElementById('cartTotal').textContent = `$${totalCuenta.toLocaleString()}`;
        
        initCartActionsListeners();
      });
  }

  function initCartActionsListeners() {
    let cart = getCartCookie();

    document.querySelectorAll('.btn-qty-minus').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.getAttribute('data-id'));
        const item = cart.find(i => i.id === id);
        if (item) {
          item.quantity -= 1;
          if (item.quantity <= 0) {
            cart = cart.filter(i => i.id !== id);
          }
          saveCartCookie(cart);
          updateCartBadge();
          renderCart();
        }
      });
    });

    document.querySelectorAll('.btn-qty-plus').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.getAttribute('data-id'));
        const item = cart.find(i => i.id === id);
        if (item) {
          item.quantity += 1;
          saveCartCookie(cart);
          updateCartBadge();
          renderCart();
        }
      });
    });

    document.querySelectorAll('.btn-delete-item').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.getAttribute('data-id'));
        cart = cart.filter(i => i.id !== id);
        saveCartCookie(cart);
        updateCartBadge();
        renderCart();
        showToast('Producto removido del carrito', 'bi-trash');
      });
    });

    document.getElementById('btnCheckout')?.addEventListener('click', () => {
      showToast('¡Gracias por tu compra! Procesando pedido...', 'bi-credit-card');
      saveCartCookie([]);
      updateCartBadge();
      setTimeout(() => window.location.href = 'index.html', 2500);
    });
  }

}); 