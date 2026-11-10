(() => {
  const form = document.querySelector('[data-book-form]');
  if (!form) return;
  const id = form.querySelector('[data-book-request-id]');
  const minor = form.querySelector('[data-book-minor]');
  const guardian = form.querySelector('[data-book-guardian]');
  const channel = form.querySelector('[data-book-response-channel]');
  const address = form.querySelector('[data-book-address]');
  const email = form.querySelector('[data-book-email]');
  const newId = () => {
    if (window.crypto && window.crypto.randomUUID) return window.crypto.randomUUID();
    if (window.crypto && window.crypto.getRandomValues) {
      const bytes = window.crypto.getRandomValues(new Uint8Array(16));
      return Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
    }
    return '';
  };
  id.value = newId();
  minor.addEventListener('change', () => { guardian.required = minor.value === 'Sí'; });
  const syncContact = () => {
    address.required = channel.value === 'Carta al domicilio';
    email.required = channel.value === 'Correo electrónico';
  };
  channel.addEventListener('change', syncContact);
  syncContact();
  form.addEventListener('input', () => { if (form.dataset.submitted === '1') { id.value = newId(); delete form.dataset.submitted; } });
  form.addEventListener('submit', event => {
    if (!id.value) {
      event.preventDefault();
      window.alert('No fue posible proteger el envío. Por favor actualiza tu navegador e inténtalo nuevamente.');
      return;
    }
    form.dataset.submitted = '1';
  });
})();
