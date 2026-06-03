/* =========================================
   CONFIG.JS
========================================= */

export const STORAGE_KEYS = {
  THEME: 'maisonTheme',
  LANGUAGE: 'maisonLang',
  CURRENCY: 'maisonCurrency'
};

export const TOAST_CONFIG = {
  DEFAULT_DELAY: 3000,
  SEARCH_DELAY: 2500
};

export const SCROLL_CONFIG = {
  NAVBAR_SCROLL: 20,
  BACK_TO_TOP_SCROLL: 400
};

// Configuración de la API y el Carrito por Cookies
export const API_CONFIG = {
  PRODUCTS_URL: 'src/js/productos.json'
};

export const COOKIE_CONFIG = {
  CART_NAME: 'maison_cart',
  DAYS_TO_EXPIRE: 7
};
