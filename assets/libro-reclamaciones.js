(() => {
  const form = document.querySelector('[data-book-form]');
  if (!form) return;
  const id = form.querySelector('[data-book-request-id]');
  const minor = form.querySelector('[data-book-minor]');
  const guardian = form.querySelector('[data-book-guardian]');
  const channel = form.querySelector('[data-book-response-channel]');
  const address = form.querySelector('[data-book-address]');
  const email = form.querySelector('[data-book-email]');
  const geography = window.DECOKASA_UBIGEO || {};
  const department = form.querySelector('[data-book-location="department"]');
  const province = form.querySelector('[data-book-location="province"]');
  const district = form.querySelector('[data-book-location="district"]');
  const locationFields = [department, province, district];
  const otherValue = '__otro__';
  const addOption = (select, value, title) => {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = title;
    select.appendChild(option);
  };
  const populate = (select, names, prompt, enabled, forceOther) => {
    select.textContent = '';
    addOption(select, '', prompt);
    names.forEach(name => addOption(select, name, name));
    if (enabled) addOption(select, otherValue, 'Otro / no figura');
    select.disabled = !enabled;
    select.value = forceOther ? otherValue : '';
  };
  const syncOther = select => {
    const key = select.dataset.bookLocation;
    const label = form.querySelector('[data-book-other-label="' + key + '"]');
    const input = form.querySelector('[data-book-other="' + key + '"]');
    const enabled = !select.disabled && select.value === otherValue;
    label.hidden = !enabled;
    input.disabled = !enabled;
    input.required = enabled;
  };
  const updateDistricts = () => {
    const enabled = Boolean(department.value && province.value);
    const forced = enabled && (department.value === otherValue || province.value === otherValue);
    const names = !forced && geography[department.value] ? geography[department.value][province.value] || [] : [];
    populate(district, names, enabled ? 'Selecciona un distrito' : 'Selecciona primero una provincia', enabled, forced);
    syncOther(district);
  };
  const updateProvinces = () => {
    const enabled = Boolean(department.value);
    const forced = department.value === otherValue;
    const names = enabled && !forced ? Object.keys(geography[department.value] || {}) : [];
    populate(province, names, enabled ? 'Selecciona una provincia' : 'Selecciona primero un departamento', enabled, forced);
    syncOther(province);
    updateDistricts();
  };
  populate(department, Object.keys(geography), 'Selecciona un departamento', true, false);
  department.addEventListener('change', () => { syncOther(department); updateProvinces(); });
  province.addEventListener('change', () => { syncOther(province); updateDistricts(); });
  district.addEventListener('change', () => { syncOther(district); });
  updateProvinces();
  const receiptOwner = form.querySelector('[name="q_8"]');
  const holderDetails = form.querySelector('[data-book-holder-details]');
  const holderFields = form.querySelectorAll('[data-book-holder-field]');
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
    locationFields.forEach(field => { field.required = channel.value === 'Carta al domicilio'; });
  };
  channel.addEventListener('change', syncContact);
  syncContact();
  const syncHolder = () => {
    const needsHolder = receiptOwner.value === 'No';
    holderDetails.hidden = !needsHolder;
    holderFields.forEach(field => { field.disabled = !needsHolder; field.required = needsHolder; });
  };
  receiptOwner.addEventListener('change', syncHolder);
  syncHolder();
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
