import { STORAGE_KEYS } from './config.js';
import { applyTheme } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
  const storedTheme = localStorage.getItem(STORAGE_KEYS.THEME);
  if (storedTheme) applyTheme(storedTheme);

  const loginForm = document.getElementById('loginForm');
  const loginError = document.getElementById('loginError');

  const CREDENTIALS = {
    user: 'admin',
    pass: 'admin'
  };

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault(); 

    const inputUser = document.getElementById('adminUser').value.trim();
    const inputPass = document.getElementById('adminPassword').value;

    if (inputUser === CREDENTIALS.user && inputPass === CREDENTIALS.pass) {
      loginError.classList.add('d-none');

      sessionStorage.setItem('maison_admin_session', 'authenticated_token_xyz123');

      window.location.href = 'admin.html';
    } else {
      loginError.classList.remove('d-none');
    }
  });
});