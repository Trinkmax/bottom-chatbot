/**
 * Módulo de flujos conversacionales
 * Maneja toda la lógica de navegación y respuestas del bot
 */

import fs from 'fs';
import path from 'path';
import { MESSAGES } from '../config/messages.js';
import { SETTINGS } from '../config/settings.js';
import * as validators from './validators.js';
import * as sessionManager from './sessionManager.js';

const { ESTADOS } = sessionManager;

/**
 * Procesa el mensaje del usuario según el estado actual
 */
export async function procesarMensaje(sock, userId, mensaje) {
  const sesion = sessionManager.obtenerSesion(userId);
  const estado = sesion.estado;
  const mensajeTexto = mensaje.trim();

  switch (estado) {
    case ESTADOS.MENU_PRINCIPAL:
      return await procesarMenuPrincipal(sock, userId, mensajeTexto);

    // Flujos de Reserva
    case ESTADOS.RESERVA_SEDE:
      return await procesarReservaSede(sock, userId, mensajeTexto);
    case ESTADOS.RESERVA_FECHA:
      return await procesarReservaFecha(sock, userId, mensajeTexto);
    case ESTADOS.RESERVA_HORARIO:
      return await procesarReservaHorario(sock, userId, mensajeTexto);
    case ESTADOS.RESERVA_CANTIDAD:
      return await procesarReservaCantidad(sock, userId, mensajeTexto);
    case ESTADOS.RESERVA_NOMBRE:
      return await procesarReservaNombre(sock, userId, mensajeTexto);
    case ESTADOS.RESERVA_TELEFONO:
      return await procesarReservaTelefono(sock, userId, mensajeTexto);
    case ESTADOS.RESERVA_INSTAGRAM:
      return await procesarReservaInstagram(sock, userId, mensajeTexto);
    case ESTADOS.RESERVA_CONFIRMACION:
      return await procesarReservaConfirmacion(sock, userId, mensajeTexto);
    case ESTADOS.RESERVA_CAMBIOS:
      return await procesarReservaCambios(sock, userId, mensajeTexto);

    // Flujos de Cumpleaños
    case ESTADOS.CUMPLE_PREGUNTA:
      return await procesarCumplePregunta(sock, userId, mensajeTexto);

    // Flujos de Dirección
    case ESTADOS.DIRECCION_SELECCIONAR:
      return await procesarDireccionSeleccionar(sock, userId, mensajeTexto);

    // Flujos de Carta
    case ESTADOS.CARTA_SELECCIONAR:
      return await procesarCartaSeleccionar(sock, userId, mensajeTexto);

    // Flujo fuera de horario
    case ESTADOS.FUERA_HORARIO_RESPUESTA:
      return await procesarRespuestaFueraDeHorario(sock, userId, mensajeTexto);

    default:
      return await mostrarMenuPrincipal(sock, userId);
  }
}

/**
 * Maneja los mensajes cuando el bot está fuera de horario (21:30 a 5am)
 */
export async function procesarFueraDeHorario(sock, userId, mensaje) {
  const sesion = sessionManager.obtenerSesion(userId);
  
  // Si ya está en el estado de respuesta fuera de horario, procesar la respuesta
  if (sesion.estado === ESTADOS.FUERA_HORARIO_RESPUESTA) {
    return await procesarRespuestaFueraDeHorario(sock, userId, mensaje);
  }
  
  // Primera vez que escribe fuera de horario, mostrar mensaje
  sessionManager.actualizarEstado(userId, ESTADOS.FUERA_HORARIO_RESPUESTA);
  return await enviarMensaje(sock, userId, MESSAGES.FUERA_HORARIO);
}

/**
 * Procesa la respuesta del usuario al mensaje de fuera de horario
 */
async function procesarRespuestaFueraDeHorario(sock, userId, mensaje) {
  const opcion = mensaje.trim();
  
  if (opcion === '1') {
    // Usuario quiere reservar para otro día
    sessionManager.actualizarEstado(userId, ESTADOS.RESERVA_SEDE);
    return await enviarMensaje(sock, userId, MESSAGES.RESERVA_SELECCIONAR_SEDE);
  } else if (opcion === '2') {
    // Usuario no quiere reservar
    await enviarMensaje(sock, userId, MESSAGES.NO_RESERVA_FUERA_HORARIO);
    sessionManager.reiniciarSesion(userId);
    return;
  } else {
    // Opción inválida
    await enviarMensaje(sock, userId, MESSAGES.ERROR_OPCION_INVALIDA);
    return await enviarMensaje(sock, userId, MESSAGES.FUERA_HORARIO);
  }
}

/**
 * MENÚ PRINCIPAL
 */
async function procesarMenuPrincipal(sock, userId, mensaje) {
  const opcion = mensaje.trim();

  switch (opcion) {
    case SETTINGS.OPCIONES_MENU.RESERVAR_MESA:
      sessionManager.actualizarEstado(userId, ESTADOS.RESERVA_SEDE);
      return await enviarMensaje(sock, userId, MESSAGES.RESERVA_SELECCIONAR_SEDE);

    case SETTINGS.OPCIONES_MENU.FESTEJAR_CUMPLE:
      sessionManager.marcarComoCumpleanos(userId, true);
      return await procesarCumpleanos(sock, userId);

    case SETTINGS.OPCIONES_MENU.VER_DIRECCION:
      sessionManager.actualizarEstado(userId, ESTADOS.DIRECCION_SELECCIONAR);
      return await enviarMensaje(sock, userId, MESSAGES.DIRECCION_SELECCIONAR);

    case SETTINGS.OPCIONES_MENU.VER_CARTA:
      sessionManager.actualizarEstado(userId, ESTADOS.CARTA_SELECCIONAR);
      return await enviarMensaje(sock, userId, MESSAGES.CARTA_SELECCIONAR);

    case SETTINGS.OPCIONES_MENU.QR_LISTAS:
      await enviarMensaje(sock, userId, MESSAGES.QR_LISTAS);
      return await mostrarMenuPrincipal(sock, userId);

    default:
      await enviarMensaje(sock, userId, MESSAGES.ERROR_OPCION_INVALIDA);
      return await mostrarMenuPrincipal(sock, userId);
  }
}

/**
 * FLUJO DE CUMPLEAÑOS
 */
async function procesarCumpleanos(sock, userId) {
  // Enviar mensaje de combos
  await enviarMensaje(sock, userId, MESSAGES.CUMPLE_COMBOS);

  // Enviar imágenes de combos
  await enviarImagenesCombos(sock, userId);

  // Preguntar si le interesa
  sessionManager.actualizarEstado(userId, ESTADOS.CUMPLE_PREGUNTA);
  return await enviarMensaje(sock, userId, MESSAGES.CUMPLE_PREGUNTA);
}

async function procesarCumplePregunta(sock, userId, mensaje) {
  const opcion = mensaje.trim();

  if (opcion === SETTINGS.OPCIONES_CUMPLE.SI || opcion === SETTINGS.OPCIONES_CUMPLE.NO) {
    // En ambos casos, continuar con el flujo de reserva
    sessionManager.actualizarEstado(userId, ESTADOS.RESERVA_SEDE);
    return await enviarMensaje(sock, userId, MESSAGES.RESERVA_SELECCIONAR_SEDE);
  } else {
    await enviarMensaje(sock, userId, MESSAGES.ERROR_OPCION_INVALIDA);
    return await enviarMensaje(sock, userId, MESSAGES.CUMPLE_PREGUNTA);
  }
}

/**
 * FLUJO DE RESERVA - SEDE
 */
async function procesarReservaSede(sock, userId, mensaje) {
  const opcion = mensaje.trim();

  if (validators.validarOpcion(opcion, Object.keys(SETTINGS.SEDES))) {
    const sede = SETTINGS.SEDES[opcion];
    sessionManager.actualizarDatos(userId, { sede: sede });
    sessionManager.actualizarEstado(userId, ESTADOS.RESERVA_FECHA);
    return await enviarMensaje(sock, userId, MESSAGES.RESERVA_INGRESAR_FECHA);
  } else {
    await enviarMensaje(sock, userId, MESSAGES.ERROR_OPCION_INVALIDA);
    return await enviarMensaje(sock, userId, MESSAGES.RESERVA_SELECCIONAR_SEDE);
  }
}

/**
 * FLUJO DE RESERVA - FECHA
 */
async function procesarReservaFecha(sock, userId, mensaje) {
  const resultado = validators.validarFecha(mensaje);

  if (resultado.valido) {
    const fechaFormateada = resultado.fecha.format('DD/MM/YYYY');
    sessionManager.actualizarDatos(userId, { fecha: fechaFormateada });
    sessionManager.actualizarEstado(userId, ESTADOS.RESERVA_HORARIO);
    return await enviarMensaje(sock, userId, MESSAGES.RESERVA_SELECCIONAR_HORARIO);
  } else {
    await enviarMensaje(sock, userId, MESSAGES.ERROR_FECHA_INVALIDA);
    await enviarMensaje(sock, userId, `❌ ${resultado.mensaje}`);
    return await enviarMensaje(sock, userId, MESSAGES.RESERVA_INGRESAR_FECHA);
  }
}

/**
 * FLUJO DE RESERVA - HORARIO
 */
async function procesarReservaHorario(sock, userId, mensaje) {
  const opcion = mensaje.trim();

  if (validators.validarOpcion(opcion, Object.keys(SETTINGS.HORARIOS_RESERVA))) {
    const horario = SETTINGS.HORARIOS_RESERVA[opcion];
    sessionManager.actualizarDatos(userId, { horario: horario });
    sessionManager.actualizarEstado(userId, ESTADOS.RESERVA_CANTIDAD);
    return await enviarMensaje(sock, userId, MESSAGES.RESERVA_CANTIDAD_PERSONAS);
  } else {
    await enviarMensaje(sock, userId, MESSAGES.ERROR_OPCION_INVALIDA);
    return await enviarMensaje(sock, userId, MESSAGES.RESERVA_SELECCIONAR_HORARIO);
  }
}

/**
 * FLUJO DE RESERVA - CANTIDAD DE PERSONAS
 */
async function procesarReservaCantidad(sock, userId, mensaje) {
  const resultado = validators.validarNumero(mensaje);

  if (resultado.valido) {
    sessionManager.actualizarDatos(userId, { cantidadPersonas: resultado.numero });
    sessionManager.actualizarEstado(userId, ESTADOS.RESERVA_NOMBRE);
    return await enviarMensaje(sock, userId, MESSAGES.RESERVA_NOMBRE);
  } else {
    await enviarMensaje(sock, userId, MESSAGES.ERROR_NUMERO_INVALIDO);
    return await enviarMensaje(sock, userId, MESSAGES.RESERVA_CANTIDAD_PERSONAS);
  }
}

/**
 * FLUJO DE RESERVA - NOMBRE
 */
async function procesarReservaNombre(sock, userId, mensaje) {
  const resultado = validators.validarTexto(mensaje);

  if (resultado.valido) {
    sessionManager.actualizarDatos(userId, { nombre: resultado.texto });
    sessionManager.actualizarEstado(userId, ESTADOS.RESERVA_TELEFONO);
    return await enviarMensaje(sock, userId, MESSAGES.RESERVA_TELEFONO);
  } else {
    await enviarMensaje(sock, userId, `❌ ${resultado.mensaje}`);
    return await enviarMensaje(sock, userId, MESSAGES.RESERVA_NOMBRE);
  }
}

/**
 * FLUJO DE RESERVA - TELÉFONO
 */
async function procesarReservaTelefono(sock, userId, mensaje) {
  const resultado = validators.validarTelefono(mensaje);

  if (resultado.valido) {
    sessionManager.actualizarDatos(userId, { telefono: resultado.telefono });
    sessionManager.actualizarEstado(userId, ESTADOS.RESERVA_INSTAGRAM);
    return await enviarMensaje(sock, userId, MESSAGES.RESERVA_INSTAGRAM);
  } else {
    await enviarMensaje(sock, userId, MESSAGES.ERROR_TELEFONO_INVALIDO);
    return await enviarMensaje(sock, userId, MESSAGES.RESERVA_TELEFONO);
  }
}

/**
 * FLUJO DE RESERVA - INSTAGRAM
 */
async function procesarReservaInstagram(sock, userId, mensaje) {
  const resultado = validators.validarInstagram(mensaje);

  if (resultado.valido) {
    sessionManager.actualizarDatos(userId, { instagram: resultado.instagram });
    sessionManager.actualizarEstado(userId, ESTADOS.RESERVA_CONFIRMACION);
    
    // Mostrar resumen
    const datos = sessionManager.obtenerDatosReserva(userId);
    return await enviarMensaje(sock, userId, MESSAGES.RESERVA_CONFIRMACION(datos));
  } else {
    await enviarMensaje(sock, userId, `❌ ${resultado.mensaje}`);
    return await enviarMensaje(sock, userId, MESSAGES.RESERVA_INSTAGRAM);
  }
}

/**
 * FLUJO DE RESERVA - CONFIRMACIÓN
 */
async function procesarReservaConfirmacion(sock, userId, mensaje) {
  const opcion = mensaje.trim();

  if (opcion === SETTINGS.OPCIONES_CONFIRMACION.CONFIRMAR) {
    // Confirmar reserva
    const datos = sessionManager.obtenerDatosReserva(userId);
    await enviarMensaje(sock, userId, MESSAGES.RESERVA_CONFIRMADA(datos));
    
    // Reiniciar sesión
    sessionManager.reiniciarSesion(userId);
    return;
  } else if (opcion === SETTINGS.OPCIONES_CONFIRMACION.CAMBIAR) {
    // Permitir cambios
    sessionManager.actualizarEstado(userId, ESTADOS.RESERVA_CAMBIOS);
    return await enviarMensaje(sock, userId, MESSAGES.RESERVA_QUE_CAMBIAR);
  } else if (opcion === SETTINGS.OPCIONES_CONFIRMACION.CANCELAR) {
    // Cancelar reserva
    await enviarMensaje(sock, userId, MESSAGES.RESERVA_CANCELADA);
    sessionManager.reiniciarSesion(userId);
    return;
  } else {
    await enviarMensaje(sock, userId, MESSAGES.ERROR_OPCION_INVALIDA);
    const datos = sessionManager.obtenerDatosReserva(userId);
    return await enviarMensaje(sock, userId, MESSAGES.RESERVA_CONFIRMACION(datos));
  }
}

/**
 * FLUJO DE RESERVA - CAMBIOS
 */
async function procesarReservaCambios(sock, userId, mensaje) {
  const opcion = mensaje.trim();

  if (validators.validarOpcion(opcion, Object.keys(SETTINGS.CAMPOS_RESERVA))) {
    const campo = SETTINGS.CAMPOS_RESERVA[opcion];

    // Cambiar al estado correspondiente
    switch (campo) {
      case 'sede':
        sessionManager.actualizarEstado(userId, ESTADOS.RESERVA_SEDE);
        return await enviarMensaje(sock, userId, MESSAGES.RESERVA_SELECCIONAR_SEDE);
      case 'fecha':
        sessionManager.actualizarEstado(userId, ESTADOS.RESERVA_FECHA);
        return await enviarMensaje(sock, userId, MESSAGES.RESERVA_INGRESAR_FECHA);
      case 'horario':
        sessionManager.actualizarEstado(userId, ESTADOS.RESERVA_HORARIO);
        return await enviarMensaje(sock, userId, MESSAGES.RESERVA_SELECCIONAR_HORARIO);
      case 'cantidadPersonas':
        sessionManager.actualizarEstado(userId, ESTADOS.RESERVA_CANTIDAD);
        return await enviarMensaje(sock, userId, MESSAGES.RESERVA_CANTIDAD_PERSONAS);
      case 'nombre':
        sessionManager.actualizarEstado(userId, ESTADOS.RESERVA_NOMBRE);
        return await enviarMensaje(sock, userId, MESSAGES.RESERVA_NOMBRE);
      case 'telefono':
        sessionManager.actualizarEstado(userId, ESTADOS.RESERVA_TELEFONO);
        return await enviarMensaje(sock, userId, MESSAGES.RESERVA_TELEFONO);
      case 'instagram':
        sessionManager.actualizarEstado(userId, ESTADOS.RESERVA_INSTAGRAM);
        return await enviarMensaje(sock, userId, MESSAGES.RESERVA_INSTAGRAM);
    }
  } else {
    await enviarMensaje(sock, userId, MESSAGES.ERROR_OPCION_INVALIDA);
    return await enviarMensaje(sock, userId, MESSAGES.RESERVA_QUE_CAMBIAR);
  }
}

/**
 * FLUJO DE DIRECCIÓN
 */
async function procesarDireccionSeleccionar(sock, userId, mensaje) {
  const opcion = mensaje.trim();

  if (opcion === '1') {
    await enviarUbicacion(sock, userId, SETTINGS.UBICACIONES.GUEMES);
    await enviarMensaje(sock, userId, MESSAGES.DIRECCION_GUEMES(SETTINGS.UBICACIONES.GUEMES));
    return await mostrarMenuPrincipal(sock, userId);
  } else if (opcion === '2') {
    await enviarUbicacion(sock, userId, SETTINGS.UBICACIONES.CERRO);
    await enviarMensaje(sock, userId, MESSAGES.DIRECCION_CERRO(SETTINGS.UBICACIONES.CERRO));
    return await mostrarMenuPrincipal(sock, userId);
  } else {
    await enviarMensaje(sock, userId, MESSAGES.ERROR_OPCION_INVALIDA);
    return await enviarMensaje(sock, userId, MESSAGES.DIRECCION_SELECCIONAR);
  }
}

/**
 * FLUJO DE CARTA
 */
async function procesarCartaSeleccionar(sock, userId, mensaje) {
  const opcion = mensaje.trim();

  if (validators.validarOpcion(opcion, Object.keys(SETTINGS.CARTAS))) {
    const nombreCarta = SETTINGS.CARTAS[opcion];
    await enviarMensaje(sock, userId, MESSAGES.ENVIANDO_CARTA);
    await enviarPDF(sock, userId, nombreCarta);
    return await mostrarMenuPrincipal(sock, userId);
  } else {
    await enviarMensaje(sock, userId, MESSAGES.ERROR_OPCION_INVALIDA);
    return await enviarMensaje(sock, userId, MESSAGES.CARTA_SELECCIONAR);
  }
}

/**
 * FUNCIONES AUXILIARES
 */

async function mostrarMenuPrincipal(sock, userId) {
  sessionManager.reiniciarSesion(userId);
  return await enviarMensaje(sock, userId, MESSAGES.MENU_PRINCIPAL);
}

async function enviarMensaje(sock, userId, texto) {
  try {
    await sock.sendMessage(userId, { text: texto });
  } catch (error) {
    console.error(`Error al enviar mensaje a ${userId}:`, error);
  }
}

async function enviarImagenesCombos(sock, userId) {
  try {
    const rutaCombos = SETTINGS.RUTAS.COMBOS;
    
    if (!fs.existsSync(rutaCombos)) {
      console.log('Carpeta de combos no existe, creándola...');
      fs.mkdirSync(rutaCombos, { recursive: true });
      return;
    }

    const archivos = fs.readdirSync(rutaCombos);
    const imagenes = archivos.filter(archivo => {
      const ext = path.extname(archivo).toLowerCase();
      return ['.jpg', '.jpeg', '.png', '.gif'].includes(ext);
    });

    if (imagenes.length === 0) {
      console.log('No hay imágenes de combos disponibles');
      return;
    }

    // Enviar hasta 3 imágenes
    for (let i = 0; i < Math.min(3, imagenes.length); i++) {
      const rutaImagen = path.join(rutaCombos, imagenes[i]);
      await sock.sendMessage(userId, {
        image: { url: rutaImagen },
        caption: `Combo ${i + 1}`
      });
    }
  } catch (error) {
    console.error('Error al enviar imágenes de combos:', error);
  }
}

async function enviarPDF(sock, userId, nombreArchivo) {
  try {
    const rutaPDF = path.join(SETTINGS.RUTAS.CARTAS, nombreArchivo);

    if (!fs.existsSync(rutaPDF)) {
      await enviarMensaje(sock, userId, MESSAGES.ERROR_ARCHIVO_NO_ENCONTRADO);
      console.error(`PDF no encontrado: ${rutaPDF}`);
      return;
    }

    await sock.sendMessage(userId, {
      document: { url: rutaPDF },
      mimetype: 'application/pdf',
      fileName: nombreArchivo
    });
  } catch (error) {
    console.error('Error al enviar PDF:', error);
    await enviarMensaje(sock, userId, MESSAGES.ERROR_ARCHIVO_NO_ENCONTRADO);
  }
}

async function enviarUbicacion(sock, userId, urlMaps) {
  try {
    // Baileys puede enviar ubicación con coordenadas
    // Extraer lat/long del URL si es posible
    const match = urlMaps.match(/q=([-\d.]+),([-\d.]+)/);
    
    if (match) {
      const lat = parseFloat(match[1]);
      const lon = parseFloat(match[2]);
      
      await sock.sendMessage(userId, {
        location: {
          degreesLatitude: lat,
          degreesLongitude: lon
        }
      });
    }
  } catch (error) {
    console.error('Error al enviar ubicación:', error);
  }
}

export default {
  procesarMensaje,
  mostrarMenuPrincipal
};

