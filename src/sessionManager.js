/**
 * Gestor de sesiones de usuario
 * Mantiene el estado de la conversación de cada usuario
 */

// Almacenamiento en memoria de las sesiones
const sessions = new Map();

/**
 * Estados posibles del flujo
 */
export const ESTADOS = {
  INICIO: 'INICIO', // Primera interacción del usuario
  MENU_PRINCIPAL: 'MENU_PRINCIPAL',
  
  // Estados de Reserva de Mesa
  RESERVA_SEDE: 'RESERVA_SEDE',
  RESERVA_FECHA: 'RESERVA_FECHA',
  RESERVA_HORARIO: 'RESERVA_HORARIO',
  RESERVA_CANTIDAD: 'RESERVA_CANTIDAD',
  RESERVA_NOMBRE: 'RESERVA_NOMBRE',
  RESERVA_TELEFONO: 'RESERVA_TELEFONO',
  RESERVA_INSTAGRAM: 'RESERVA_INSTAGRAM',
  RESERVA_CONFIRMACION: 'RESERVA_CONFIRMACION',
  RESERVA_CAMBIOS: 'RESERVA_CAMBIOS',
  
  // Estados de Cumpleaños
  CUMPLE_VER_COMBOS: 'CUMPLE_VER_COMBOS',
  CUMPLE_SELECCIONAR_COMBO: 'CUMPLE_SELECCIONAR_COMBO',
  
  // Estados de Dirección
  DIRECCION_SELECCIONAR: 'DIRECCION_SELECCIONAR',
  
  // Estados de Carta
  CARTA_SELECCIONAR: 'CARTA_SELECCIONAR',
  
  // Estado fuera de horario
  FUERA_HORARIO_RESPUESTA: 'FUERA_HORARIO_RESPUESTA'
};

/**
 * Crea una nueva sesión para un usuario
 */
export function crearSesion(userId) {
  const sesion = {
    userId: userId,
    estado: ESTADOS.INICIO, // Empezar en INICIO para mostrar mensaje de bienvenida
    datos: {},
    ultimaActividad: Date.now(),
    esCumpleanos: false
  };
  
  sessions.set(userId, sesion);
  return sesion;
}

/**
 * Obtiene la sesión de un usuario
 * Si no existe, crea una nueva
 */
export function obtenerSesion(userId) {
  if (!sessions.has(userId)) {
    return crearSesion(userId);
  }
  
  const sesion = sessions.get(userId);
  sesion.ultimaActividad = Date.now();
  return sesion;
}

/**
 * Actualiza el estado de la sesión
 */
export function actualizarEstado(userId, nuevoEstado) {
  const sesion = obtenerSesion(userId);
  sesion.estado = nuevoEstado;
  sesion.ultimaActividad = Date.now();
  sessions.set(userId, sesion);
}

/**
 * Actualiza los datos de la sesión
 */
export function actualizarDatos(userId, datos) {
  const sesion = obtenerSesion(userId);
  sesion.datos = { ...sesion.datos, ...datos };
  sesion.ultimaActividad = Date.now();
  sessions.set(userId, sesion);
}

/**
 * Marca la sesión como cumpleaños
 */
export function marcarComoCumpleanos(userId, esCumple = true) {
  const sesion = obtenerSesion(userId);
  sesion.esCumpleanos = esCumple;
  sesion.ultimaActividad = Date.now();
  sessions.set(userId, sesion);
}

/**
 * Reinicia la sesión de un usuario al menú principal
 */
export function reiniciarSesion(userId) {
  const sesion = obtenerSesion(userId);
  sesion.estado = ESTADOS.MENU_PRINCIPAL;
  sesion.datos = {};
  sesion.esCumpleanos = false;
  sesion.ultimaActividad = Date.now();
  sessions.set(userId, sesion);
}

/**
 * Elimina la sesión de un usuario
 */
export function eliminarSesion(userId) {
  sessions.delete(userId);
}

/**
 * Limpia sesiones inactivas (opcional)
 * @param {number} timeoutMinutos - Tiempo de inactividad en minutos
 */
export function limpiarSesionesInactivas(timeoutMinutos = 30) {
  if (timeoutMinutos === 0) return; // No limpiar si timeout es 0
  
  const ahora = Date.now();
  const timeoutMs = timeoutMinutos * 60 * 1000;
  
  for (const [userId, sesion] of sessions.entries()) {
    if (ahora - sesion.ultimaActividad > timeoutMs) {
      sessions.delete(userId);
      console.log(`Sesión eliminada por inactividad: ${userId}`);
    }
  }
}

/**
 * Obtiene el número total de sesiones activas
 */
export function obtenerNumeroSesiones() {
  return sessions.size;
}

/**
 * Obtiene los datos de reserva de una sesión
 */
export function obtenerDatosReserva(userId) {
  const sesion = obtenerSesion(userId);
  return sesion.datos;
}

/**
 * Verifica si la sesión actual es de cumpleaños
 */
export function esSesionCumpleanos(userId) {
  const sesion = obtenerSesion(userId);
  return sesion.esCumpleanos;
}

export default {
  ESTADOS,
  crearSesion,
  obtenerSesion,
  actualizarEstado,
  actualizarDatos,
  marcarComoCumpleanos,
  reiniciarSesion,
  eliminarSesion,
  limpiarSesionesInactivas,
  obtenerNumeroSesiones,
  obtenerDatosReserva,
  esSesionCumpleanos
};

