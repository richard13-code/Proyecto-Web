/* =========================================
   UTILS.JS
========================================= */

import { TOAST_CONFIG } from './config.js';


/* =========================
   APPLY THEME
========================= */

export function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
}


/* =========================
   EMAIL VALIDATION
========================= */

export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}


/* =========================
   SETTINGS TOAST
========================= */

export function triggerSettingsToast() {

  const toastEl = document.getElementById('settingsToast');

  if (!toastEl) return;

  const toast = bootstrap.Toast.getOrCreateInstance(toastEl, {
    delay: TOAST_CONFIG.DEFAULT_DELAY
  });

  toast.show();
}


/* =========================
   CUSTOM TOAST
========================= */

export function showToast(message, icon = 'bi-check-circle') {

  const toastEl = document.getElementById('settingsToast');

  if (!toastEl) return;

  const body = toastEl.querySelector('.toast-body');

  if (body) {
    body.innerHTML = `
      <i class="bi ${icon} me-2"></i>${message}
    `;
  }

  const toast = bootstrap.Toast.getOrCreateInstance(toastEl, {
    delay: TOAST_CONFIG.SEARCH_DELAY
  });

  toast.show();

  // Restore default message after toast closes
  toastEl.addEventListener('hidden.bs.toast', () => {

    if (body) {
      body.innerHTML = `
        <i class="bi bi-check-circle me-2"></i>
        Cambios guardados correctamente.
      `;
    }

  }, { once: true });
}

/* =========================================
   MANEJO DE COOKIES PARA EL CARRITO
========================================= */

import { COOKIE_CONFIG } from './config.js';

// 1. Guardar el carrito en una cookie (Convierte el array a String de texto)
export function saveCartCookie(cartArray) {
  const d = new Date();
  d.setTime(d.getTime() + (COOKIE_CONFIG.DAYS_TO_EXPIRE * 24 * 60 * 60 * 1000));
  const expires = "expires=" + d.toUTCString();
  
  // Guardamos el array serializado en formato JSON string
  document.cookie = `${COOKIE_CONFIG.CART_NAME}=${JSON.stringify(cartArray)};${expires};path=/;SameSite=Strict`;
}

// 2. Obtener el carrito desde la cookie (Convierte el texto de vuelta a Array)
export function getCartCookie() {
  const name = COOKIE_CONFIG.CART_NAME + "=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(';');
  
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i].trim();
    if (c.indexOf(name) === 0) {
      const cookieData = c.substring(name.length, c.length);
      try {
        return JSON.parse(cookieData); // Retorna el array de productos
      } catch (e) {
        return [];
      }
    }
  }
  return []; // Si no existe la cookie, retorna un carrito vacío
}

// 3. Actualizar dinámicamente los contadores de la interfaz (.cart-badge)
export function updateCartBadge() {
  const cart = getCartCookie();
  // Sumamos la cantidad de todos los productos en el carrito
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  
  // Tu HTML tiene badges tanto para la vista móvil como para escritorio
  document.querySelectorAll('.cart-badge').forEach(badge => {
    badge.textContent = totalItems;
  });
}


