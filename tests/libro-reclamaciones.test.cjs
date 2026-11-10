const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const crypto = require('node:crypto');

const source = fs.readFileSync(path.join(__dirname, '../integrations/libro-reclamaciones/Code.gs'), 'utf8');
function harness({ senderReady = true } = {}) {
  const rows = [Array(26).fill('')];
  const properties = {
    BOOK_SPREADSHEET_ID: 'private-sheet',
    BOOK_NEXT_NUMBER: '1',
    BOOK_SUPPLIER_ADDRESS: 'Av. José Leal n.º 375, Lima, Lima, Lima'
  };
  const sent = [];
  const failTo = new Set();
  let columns = 26;
  const sheet = {
    getMaxColumns() { return columns; },
    insertColumnsAfter(after, count) {
      assert.equal(after, columns);
      columns += count;
      rows.forEach(row => row.push(...Array(count).fill('')));
    },
    appendRow(values) {
      // Sheets can infer numeric types when a row is appended.
      rows.push(values.map(value => typeof value === 'string' && /^0\d+$/.test(value) ? Number(value) : value));
    },
    getLastRow() { return rows.length; },
    getRange(firstRow, firstCol, rowCount = 1, colCount = 1) {
      return {
        getValues() {
          return Array.from({ length: rowCount }, (_, r) =>
            Array.from({ length: colCount }, (_, c) => rows[firstRow - 1 + r][firstCol - 1 + c]));
        },
        getValue() { return rows[firstRow - 1][firstCol - 1]; },
        setNumberFormat() { return this; },
        setValue(value) {
          // A leading apostrophe makes Sheets store the remaining characters as text.
          rows[firstRow - 1][firstCol - 1] = typeof value === 'string' && value.startsWith("'")
            ? value.slice(1)
            : typeof value === 'string' && /^0\d+$/.test(value) ? Number(value) : value;
          return this;
        }
      };
    }
  };
  const context = {
    PropertiesService: { getScriptProperties: () => ({
      getProperty: key => properties[key] || null,
      setProperty: (key, value) => { properties[key] = value; }
    }) },
    LockService: { getScriptLock: () => ({ tryLock: () => true, releaseLock: () => {} }) },
    SpreadsheetApp: {
      openById: id => ({ getSheetByName: name => id === 'private-sheet' && name === 'Reclamaciones' ? sheet : null }),
      flush: () => {}
    },
    Utilities: {
      DigestAlgorithm: { SHA_256: 'sha256' },
      Charset: { UTF_8: 'utf8' },
      computeDigest: (algorithm, value) => [...crypto.createHash(algorithm).update(value).digest()],
      formatDate: (date, zone, format) => format === 'yyyy' ? '2026' : '09/11/2026 10:30:00'
    },
    Session: { getEffectiveUser: () => ({ getEmail: () => senderReady ? 'atencion.decokasa@checkazul.com.pe' : 'otra@example.com' }) },
    MailApp: { sendEmail: message => {
      if (failTo.has(message.to)) throw Error('mail unavailable');
      sent.push(message);
    } },
    HtmlService: { createHtmlOutput: content => ({ content }) },
    Logger: { log: () => {} }
  };
  vm.runInNewContext(source + '\nglobalThis.book = { doPost, reenviarPendientes, configurarLibro, questions: BOOK.additionalQuestions };', context);
  return { ...context.book, rows, properties, sent, failTo, sheet };
}

function request(overrides = {}) {
  return { parameter: {
    request_id: '123e4567-e89b-12d3-a456-426614174000', form_version: '2',
    name: 'Ana Prueba', document: '12345678', address: 'Calle de prueba 123',
    email: 'ana@example.com', phone: '999888777', minor: 'No', guardian: '',
    item_type: 'Producto', amount: '150.00', item_description: 'Mesa',
    purchase_date: '2026-10-02', order_number: '0000123', receipt_number: 'F001-0000456',
    type: 'Reclamo', details: 'El producto llegó dañado.', request: 'Solicito un cambio.',
    response_channel: 'Correo electrónico',
    ...Object.fromEntries(Array.from({ length: 35 }, (_, index) => ['q_' + (index + 1), 'No aplica'])),
    ...overrides
  } };
}

test('registra una sola ficha, envía las dos copias y la constancia es imprimible', () => {
  const h = harness();
  const result = h.doPost(request());
  assert.match(result.content, /Tu reclamación fue registrada/);
  assert.match(result.content, /LR-2026-000001/);
  assert.match(result.content, /window\.print/);
  assert.equal(h.rows.length, 2);
  assert.equal(h.rows[1][16], 'Pendiente');
  assert.equal(h.rows[1][17], 'Laiz Guerrero');
  assert.equal(h.rows[1][21], 'Enviado');
  assert.equal(h.rows[1][22], 'Enviado');
  assert.deepEqual(h.sent.map(mail => mail.to), ['ana@example.com', 'atencion.decokasa@checkazul.com.pe']);
  assert.ok(h.sent.every(mail => mail.replyTo === 'atencion.decokasa@checkazul.com.pe'));
  assert.match(h.sent[0].body, /Fecha y hora de registro \(Lima\): 09\/11\/2026 10:30:00/);
  assert.match(h.sent[1].body, /Solicito un cambio/);
  assert.match(h.sent[0].body, /Av\. José Leal/);
  assert.match(result.content, /Fecha de compra: 02\/10\/2026/);
  assert.match(h.sent[0].body, /Número de pedido: 0000123/);
  assert.match(h.sent[1].body, /Número de comprobante: F001-0000456/);
  assert.deepEqual(h.rows[0].slice(26), ['Fecha de compra', 'Número de pedido', 'Número de comprobante', 'Titular del comprobante', 'Documento del titular']);
  assert.deepEqual(Array.from(h.rows[1].slice(26)), ['2026-10-02', '0000123', 'F001-0000456', '', '']);
  const repeated = h.doPost(request());
  assert.match(repeated.content, /LR-2026-000001/);
  assert.equal(h.rows.length, 2);
  assert.equal(h.sent.length, 2);
});

test('no permite activar ni recibir reclamaciones sin el remitente de atención configurado', () => {
  const h = harness({ senderReady: false });
  assert.throws(() => h.configurarLibro(), /cuenta de atención/);
  assert.match(h.doPost(request()).content, /El libro todavía no está disponible/);
  assert.equal(h.rows.length, 1);
  assert.equal(h.sent.length, 0);
});

test('no acepta información distinta con el mismo identificador', () => {
  const h = harness();
  h.doPost(request());
  assert.match(h.doPost(request({ details: 'Cambió el contenido.' })).content, /La solicitud cambió/);
  assert.equal(h.rows.length, 2);
  assert.equal(h.sent.length, 2);
});

test('guarda el caso y reintenta la copia cuando falla el correo al cliente', () => {
  const h = harness();
  h.failTo.add('ana@example.com');
  const receipt = h.doPost(request());
  assert.match(receipt.content, /La copia por correo está pendiente/);
  assert.equal(h.rows[1][21], 'Pendiente');
  assert.equal(h.rows[1][22], 'Enviado');
  h.failTo.clear();
  h.reenviarPendientes();
  assert.equal(h.rows[1][21], 'Enviado');
  assert.equal(h.sent.filter(mail => mail.to === 'ana@example.com').length, 1);
  assert.equal(h.sent.filter(mail => mail.to === 'atencion.decokasa@checkazul.com.pe').length, 1);
});

test('rechaza datos incompletos, correo inválido y menores sin apoderado', () => {
  for (const values of [{ name: '' }, { email: 'invalido' }, { email: '' }, { address: '', response_channel: 'Carta al domicilio' }, { minor: 'Sí', guardian: '' }, { type: 'Otro' }, { q_1: '' }, { q_35: 'Quizás' }]) {
    const h = harness();
    assert.match(h.doPost(request(values)).content, /No pudimos confirmar el envío/);
    assert.equal(h.rows.length, 1);
    assert.equal(h.sent.length, 0);
  }
});

test('exige fecha real, número de pedido y comprobante en el formulario vigente', () => {
  for (const values of [{ form_version: '' }, { purchase_date: '' }, { purchase_date: '2026-02-30' }, { purchase_date: '2026-13-01' }, { order_number: '' }, { receipt_number: '' }]) {
    const h = harness();
    assert.match(h.doPost(request(values)).content, /No pudimos confirmar el envío/);
    assert.equal(h.rows.length, 1);
    assert.equal(h.sent.length, 0);
  }
});

test('exige y conserva los datos del titular distinto en hoja, constancia y ambas copias', () => {
  for (const values of [{ q_8: 'No' }, { q_8: 'No', receipt_holder_name: 'Titular Prueba' }, { q_8: 'No', receipt_holder_document: '00123456' }]) {
    const h = harness();
    assert.match(h.doPost(request(values)).content, /No pudimos confirmar el envío/);
    assert.equal(h.rows.length, 1);
  }
  const h = harness();
  const result = h.doPost(request({ q_8: 'No', receipt_holder_name: 'Titular Prueba', receipt_holder_document: '00123456', receipt_number: '00000005' }));
  assert.match(result.content, /Titular del comprobante: Titular Prueba/);
  assert.match(result.content, /Documento del titular: 00123456/);
  assert.deepEqual(Array.from(h.rows[1].slice(26)), ['2026-10-02', '0000123', '00000005', 'Titular Prueba', '00123456']);
  for (const mail of h.sent) {
    assert.match(mail.body, /Titular del comprobante: Titular Prueba/);
    assert.match(mail.body, /Documento del titular: 00123456/);
  }
});

test('ignora datos residuales del titular cuando el comprobante sí está a nombre del reclamante', () => {
  const h = harness();
  const receipt = h.doPost(request({ q_8: 'Sí', receipt_holder_name: 'Dato anterior', receipt_holder_document: '999' }));
  assert.doesNotMatch(receipt.content, /Titular del comprobante: Dato anterior/);
  assert.deepEqual(Array.from(h.rows[1].slice(29)), ['', '']);
});

test('evita ocupar columnas adicionales que ya contienen datos o encabezados ajenos', () => {
  for (const conflict of ['header', 'data']) {
    const h = harness();
    h.sheet.insertColumnsAfter(26, 5);
    if (conflict === 'header') h.rows[0][26] = 'Otra información';
    else { h.rows.push(Array(31).fill('')); h.rows[1][26] = 'Conservar'; }
    const before = JSON.stringify(h.rows);
    assert.match(h.doPost(request()).content, /No pudimos confirmar el envío/);
    assert.equal(JSON.stringify(h.rows), before);
    assert.equal(h.sent.length, 0);
  }
});

test('reintenta las copias de reclamaciones antiguas aunque no tengan datos de compra nuevos', () => {
  const h = harness();
  h.doPost(request());
  const previous = JSON.parse(h.rows[1][25]);
  for (const key of ['purchaseDate', 'orderNumber', 'receiptNumber', 'receiptHolderName', 'receiptHolderDocument']) delete previous[key];
  h.rows[1][25] = JSON.stringify(previous);
  h.rows[1][21] = 'Pendiente';
  h.sent.length = 0;
  h.reenviarPendientes();
  assert.equal(h.rows[1][21], 'Enviado');
  assert.equal(h.sent.length, 1);
  assert.doesNotMatch(h.sent[0].body, /undefined/);
  assert.doesNotMatch(h.sent[0].body, /Fecha de compra:/);
});

test('acepta el teléfono vacío y conserva las 35 respuestas adicionales en ambas copias', () => {
  const h = harness();
  const result = h.doPost(request({ phone: '', q_1: 'Sí', q_35: 'No sé' }));
  assert.match(result.content, /Tu reclamación fue registrada/);
  assert.match(result.content, /Teléfono: No indicado/);
  const original = JSON.parse(h.rows[1][25]);
  assert.equal(original.additional.length, 35);
  assert.equal(original.additional[0].answer, 'Sí');
  assert.equal(original.additional[34].answer, 'No sé');
  for (const mail of h.sent) {
    assert.match(mail.body, /¿La compra se realizó en la web de DECOKASA\? Sí/);
    assert.match(mail.body, /¿Solicitas otra solución distinta a las anteriores\? No sé/);
  }
});

test('la página y el receptor usan las mismas 35 preguntas y mantienen el teléfono opcional', () => {
  const page = fs.readFileSync(path.join(__dirname, '../sections/libro-reclamaciones.liquid'), 'utf8');
  const match = page.match(/assign book_questions = '([^']+)' \| split: '\|'/);
  assert.ok(match);
  assert.deepEqual(match[1].split('|'), Array.from(harness().questions));
  assert.equal(match[1].split('|').length, 35);
  assert.match(page, /name="q_{{ forloop.index }}" required/);
  assert.match(page, /<input name="phone"[^>]*>/);
  assert.doesNotMatch(page.match(/<input name="phone"[^>]*>/)[0], /required/);
});

test('admite carta sin correo y conserva una constancia imprimible sin reintentos al cliente', () => {
  const h = harness();
  const result = h.doPost(request({ email: '', response_channel: 'Carta al domicilio' }));
  assert.match(result.content, /Tu reclamación fue registrada/);
  assert.match(result.content, /No se indicó un correo/);
  assert.match(result.content, /window\.print/);
  assert.equal(h.rows[1][21], 'No indicado');
  assert.equal(h.rows[1][22], 'Enviado');
  assert.deepEqual(h.sent.map(mail => mail.to), ['atencion.decokasa@checkazul.com.pe']);
  assert.match(h.sent[0].body, /Correo: No indicado/);
  h.reenviarPendientes();
  assert.equal(h.sent.length, 1);
});

test('admite respuesta por correo sin domicilio y entrega una copia por correo', () => {
  const h = harness();
  const result = h.doPost(request({ address: '' }));
  assert.match(result.content, /Tu reclamación fue registrada/);
  assert.match(result.content, /Domicilio: No indicado/);
  assert.deepEqual(h.sent.map(mail => mail.to), ['ana@example.com', 'atencion.decokasa@checkazul.com.pe']);
});

test('conserva los ceros iniciales del documento y teléfono en la hoja', () => {
  const h = harness();
  const result = h.doPost(request({ document: '00123456', phone: '090011122' }));
  assert.match(result.content, /Tu reclamación fue registrada/);
  assert.equal(h.rows[1][4], '00123456');
  assert.equal(h.rows[1][7], '090011122');
});

test('guarda los identificadores que parecen fórmulas como texto literal', () => {
  const h = harness();
  const result = h.doPost(request({ document: '=1+1', phone: '+0001234' }));
  assert.match(result.content, /Tu reclamación fue registrada/);
  assert.equal(h.rows[1][4], '=1+1');
  assert.equal(h.rows[1][7], '+0001234');
});

test('protege las celdas contra fórmulas y escapa HTML en la constancia', () => {
  const h = harness();
  const result = h.doPost(request({ name: '=1+2', details: '<script>alert(1)</script>' }));
  assert.equal(h.rows[1][3], "'=1+2");
  assert.doesNotMatch(result.content, /<script>alert/);
  assert.match(result.content, /&lt;script&gt;alert/);
  assert.match(h.sent[0].body, /<script>alert/);
});

test('no registra solicitudes si falta configuración o identificador seguro', () => {
  const h = harness();
  delete h.properties.BOOK_SUPPLIER_ADDRESS;
  assert.match(h.doPost(request()).content, /No pudimos confirmar el envío/);
  assert.equal(h.rows.length, 1);
  h.properties.BOOK_SUPPLIER_ADDRESS = 'Dirección de prueba';
  assert.match(h.doPost(request({ request_id: '' })).content, /No pudimos confirmar el envío/);
  assert.equal(h.rows.length, 1);
});

test('el formulario solicita manualmente la compra y pide el titular solo cuando corresponde', () => {
  const { parseHTML } = require('linkedom');
  const { window, document } = parseHTML(fs.readFileSync(path.join(__dirname, '../preview/libro-reclamaciones.html'), 'utf8'));
  const owner = document.querySelector('[name="q_8"]');
  let value = '';
  Object.defineProperty(owner, 'value', { get: () => value, set: selected => { value = selected; } });
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../assets/libro-reclamaciones.js'), 'utf8'), { window, document, Uint8Array });
  for (const name of ['purchase_date', 'order_number', 'receipt_number']) {
    assert.ok(document.querySelector('[name="' + name + '"]').hasAttribute('required'), name);
  }
  const block = document.querySelector('[data-book-holder-details]');
  const fields = [...block.querySelectorAll('[data-book-holder-field]')];
  assert.equal(fields.length, 2);
  assert.equal(block.hidden, true);
  assert.ok(fields.every(field => field.disabled && !field.required));
  owner.value = 'No';
  owner.dispatchEvent(new window.Event('change'));
  assert.equal(block.hidden, false);
  assert.ok(fields.every(field => !field.disabled && field.required));
  owner.value = 'Sí';
  owner.dispatchEvent(new window.Event('change'));
  assert.equal(block.hidden, true);
  assert.ok(fields.every(field => field.disabled && !field.required));
});
