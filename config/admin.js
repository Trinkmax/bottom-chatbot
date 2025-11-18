/**
 * Configuración de administración del bot
 */

export const ADMIN_CONFIG = {
  // Contraseña para acceder a comandos de admin (cámbiala por seguridad)
  PASSWORD: process.env.ADMIN_PASSWORD || 'admin123',
  
  // Lista de números autorizados (formato: 549XXXXXXXXXX@s.whatsapp.net)
  // Puedes agregar números específicos aquí para mayor seguridad
  NUMEROS_AUTORIZADOS: process.env.ADMIN_NUMBERS ? 
    process.env.ADMIN_NUMBERS.split(',').map(n => `${n}@s.whatsapp.net`) : 
    [],
  
  // Tiempo de sesión de admin (en minutos)
  TIMEOUT_SESION: 30
};

/**
 * Estado global del bot
 */
export const BOT_STATE = {
  pausado: false,
  mensajePausa: null,
  fechasEspeciales: new Map(),
  // Excepciones de fechas específicas que se pueden reservar (formato DD/MM)
  fechasExcepcion: new Set(['23/11']), // Domingo 23/11 habilitado
  // Días de la semana permitidos (0=Domingo, 1=Lunes, ..., 6=Sábado)
  diasPermitidos: [4, 5, 6], // Por defecto: Jueves, Viernes, Sábado
  estadisticas: {
    mensajesRecibidos: 0,
    reservasCompletadas: 0,
    sesionesActivas: 0,
    inicioBot: Date.now()
  }
};

/**
 * Sesiones de administrador activas
 */
export const ADMIN_SESSIONS = new Map();

export default {
  ADMIN_CONFIG,
  BOT_STATE,
  ADMIN_SESSIONS
};

