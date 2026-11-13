function showToast(message, type = 'success', duration = 3000) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message; // textContent, not innerHTML, to avoid XSS
  container.appendChild(toast);

  // next frame so the CSS transition runs
  requestAnimationFrame(() => toast.classList.add('show'));

  setTimeout(() => {
    toast.classList.remove('show');
    toast.addEventListener('transitionend', () => toast.remove(), { once: true });
  }, duration);
}

// Show a toast if the URL has ?toast=...&type=...
const params = new URLSearchParams(window.location.search);
if (params.has('toast')) {
  showToast(params.get('toast'), params.get('type') || 'success');
  // clean the URL so a refresh doesn't show it again
  history.replaceState({}, '', window.location.pathname);
}