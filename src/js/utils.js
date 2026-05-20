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
