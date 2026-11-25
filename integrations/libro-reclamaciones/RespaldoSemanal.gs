/* Proyecto independiente del receptor: no modificar el formulario ni su numeración. */
const RESPALDO_LIBRO = Object.freeze({
  cuenta: 'atencion.decokasa@checkazul.com.pe',
  hoja: 'DECOKASA - Libro de Reclamaciones (preparación privada)',
  carpeta: 'Respaldos privados - Libro de Reclamaciones DECOKASA',
  zona: 'America/Lima',
  funcion: 'respaldarLibroSemanal'
});

function comprobarCuentaRespaldo_() {
  if (Session.getEffectiveUser().getEmail().toLowerCase() !== RESPALDO_LIBRO.cuenta) {
    throw new Error('El respaldo debe ejecutarse con la cuenta de Atención.');
  }
}

function unicoPropio_(elementos, nombre, clase) {
  const encontrados = [];
  while (elementos.hasNext()) {
    const elemento = elementos.next();
    const propietario = elemento.getOwner();
    if (propietario && propietario.getEmail().toLowerCase() === RESPALDO_LIBRO.cuenta && !elemento.isTrashed()) {
      encontrados.push(elemento);
    }
  }
  if (encontrados.length !== 1) {
    throw new Error('Debe existir exactamente ' + clase + ' de Atención con el nombre: ' + nombre);
  }
  return encontrados[0];
}

function comprobarCarpetaRespaldo_(carpeta) {
  const propietario = carpeta.getOwner();
  if (!propietario || propietario.getEmail().toLowerCase() !== RESPALDO_LIBRO.cuenta ||
      carpeta.isTrashed() || carpeta.getSharingAccess() !== DriveApp.Access.PRIVATE) {
    throw new Error('La carpeta de respaldo debe ser privada y pertenecer a Atención.');
  }
  const otrasPersonas = carpeta.getEditors().concat(carpeta.getViewers())
    .filter(usuario => usuario.getEmail().toLowerCase() !== RESPALDO_LIBRO.cuenta);
  if (otrasPersonas.length) throw new Error('La carpeta de respaldo tiene acceso compartido.');
}

/** Ejecutar una vez con la cuenta de Atención para probar y programar el respaldo. */
function configurarRespaldoSemanal() {
  comprobarCuentaRespaldo_();
  const hoja = unicoPropio_(DriveApp.getFilesByName(RESPALDO_LIBRO.hoja), RESPALDO_LIBRO.hoja, 'una hoja');
  if (hoja.getMimeType() !== 'application/vnd.google-apps.spreadsheet') throw new Error('El origen no es una hoja de Google.');
  const carpeta = unicoPropio_(DriveApp.getFoldersByName(RESPALDO_LIBRO.carpeta), RESPALDO_LIBRO.carpeta, 'una carpeta');
  comprobarCarpetaRespaldo_(carpeta);
  PropertiesService.getScriptProperties().setProperties({
    RESPALDO_LIBRO_ORIGEN: hoja.getId(),
    RESPALDO_LIBRO_CARPETA: carpeta.getId()
  });

  // Primera prueba antes de instalar el activador; nunca altera la hoja original.
  respaldarLibroSemanal();
  if (!ScriptApp.getProjectTriggers().some(t => t.getHandlerFunction() === RESPALDO_LIBRO.funcion)) {
    ScriptApp.newTrigger(RESPALDO_LIBRO.funcion).timeBased()
      .onWeekDay(ScriptApp.WeekDay.SUNDAY).atHour(2).inTimezone(RESPALDO_LIBRO.zona).create();
  }
  console.log('Respaldo probado y activador semanal configurado para el domingo entre 2 y 3 a. m. de Lima.');
}

/** Google ejecuta esta función semanalmente con los permisos de Atención. */
function respaldarLibroSemanal() {
  comprobarCuentaRespaldo_();
  const propiedades = PropertiesService.getScriptProperties();
  const origenId = propiedades.getProperty('RESPALDO_LIBRO_ORIGEN');
  const carpetaId = propiedades.getProperty('RESPALDO_LIBRO_CARPETA');
  if (!origenId || !carpetaId) throw new Error('Falta configurar el origen o la carpeta de respaldo.');
  const hoja = DriveApp.getFileById(origenId);
  const propietario = hoja.getOwner();
  if (!propietario || propietario.getEmail().toLowerCase() !== RESPALDO_LIBRO.cuenta ||
      hoja.isTrashed() || hoja.getMimeType() !== 'application/vnd.google-apps.spreadsheet') {
    throw new Error('La hoja de origen ya no es válida o no pertenece a Atención.');
  }
  const carpeta = DriveApp.getFolderById(carpetaId);
  comprobarCarpetaRespaldo_(carpeta);
  const fecha = Utilities.formatDate(new Date(), RESPALDO_LIBRO.zona, 'yyyy-MM-dd_HH-mm-ss');
  const copia = hoja.makeCopy('Libro de Reclamaciones DECOKASA - Respaldo ' + fecha, carpeta);
  console.log('Copia creada: ' + copia.getName());
}
