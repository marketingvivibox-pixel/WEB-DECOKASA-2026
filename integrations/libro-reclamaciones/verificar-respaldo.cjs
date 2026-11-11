'use strict';

// Comprueba la copia y avisa si cambian las piezas específicas del libro.
// Puede recibir otra raíz para verificar una copia de trabajo aislada.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const root = path.resolve(process.argv[2] || path.join(__dirname, '../..'));
const manifestPath = path.join(root, 'integrations/libro-reclamaciones/manifiesto-respaldo.json');
const errors = [];

function normalizedHash(filename) {
  const content = fs.readFileSync(filename, 'utf8').replace(/\r\n/g, '\n');
  return crypto.createHash('sha256').update(content, 'utf8').digest('hex');
}

try {
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  if (!Array.isArray(manifest.files) || manifest.files.length === 0) throw new Error('El manifiesto está vacío.');
  for (const entry of manifest.files) {
    try {
      if (normalizedHash(path.join(root, entry.copia)) !== entry.sha256) {
        errors.push(`La copia de ${entry.original} fue modificada o está dañada.`);
      }
      if (entry.compararOriginal && normalizedHash(path.join(root, entry.original)) !== entry.sha256) {
        errors.push(`Cambió ${entry.original}. Revisar el libro y crear un nuevo respaldo aprobado.`);
      }
    } catch (error) {
      errors.push(`No se pudo leer ${entry.original} o su copia: ${error.message}`);
    }
  }
  const layout = fs.readFileSync(path.join(root, 'layout/theme.liquid'), 'utf8');
  if (!/{%\s*render\s+['"]book-link['"]\s*%}/.test(layout)) {
    errors.push('Falta en el tema el enlace al Libro de Reclamaciones.');
  }
  if (!/template\.suffix\s*==\s*['"]libro-reclamaciones['"]/.test(layout)) {
    errors.push('Falta la condición que excluye el aviso de simulación en el libro.');
  }
} catch (error) {
  errors.push(`No se pudo comprobar el respaldo: ${error.message}`);
}

if (errors.length) {
  console.error(errors.map(error => `ERROR: ${error}`).join('\n'));
  process.exitCode = 1;
} else {
  console.log('Respaldo íntegro y componentes del Libro de Reclamaciones conservados.');
}
