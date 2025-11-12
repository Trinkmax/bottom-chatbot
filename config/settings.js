/**
 * Configuración general del bot
 */

export const SETTINGS = {
  // Configuración del servidor web
  PORT: process.env.PORT || 3000,

  // Horarios de atención (hora de Argentina - ART: UTC-3)
  HORARIO_ATENCION: {
    HORA_INICIO: 5,  // 05:00
    HORA_FIN: 22,    // 22:30
    MINUTO_FIN: 30,
    TIMEZONE: 'America/Argentina/Buenos_Aires'
  },

  // Días permitidos para reservas (0 = Domingo, 6 = Sábado)
  DIAS_PERMITIDOS: [4, 5, 6], // Jueves, Viernes, Sábado

  // Opciones del menú principal
  OPCIONES_MENU: {
    RESERVAR_MESA: '1',
    FESTEJAR_CUMPLE: '2',
    VER_DIRECCION: '3',
    VER_CARTA: '4',
    QR_LISTAS: '5'
  },

  // Opciones de sedes
  SEDES: {
    '1': 'Güemes',
    '2': 'Cerro'
  },

  // Ubicaciones (URLs de Google Maps)
  UBICACIONES: {
    GUEMES: process.env.UBICACION_GUEMES || 'https://www.google.com/maps?q=-38.0,57.5',
    CERRO: process.env.UBICACION_CERRO || 'https://www.google.com/maps?q=-38.0,57.5'
  },

  // Horarios de reserva disponibles
  HORARIOS_RESERVA: {
    '1': '21:30',
    '2': '22:00',
    '3': '22:30'
  },

  // Opciones de confirmación de reserva
  OPCIONES_CONFIRMACION: {
    CONFIRMAR: '1',
    CAMBIAR: '2',
    CANCELAR: '3'
  },

  // Campos modificables de la reserva
  CAMPOS_RESERVA: {
    '1': 'sede',
    '2': 'fecha',
    '3': 'horario',
    '4': 'cantidadPersonas',
    '5': 'nombre',
    '6': 'telefono',
    '7': 'instagram'
  },

  // Opciones de cumpleaños
  OPCIONES_CUMPLE: {
    SI: '1',
    NO: '2'
  },

  // Opciones de cartas
  CARTAS: {
    '1': 'carta_antes_00.pdf',
    '2': 'carta_despues_00.pdf'
  },

  // Rutas de archivos
  RUTAS: {
    COMBOS: './media/combos/',
    CARTAS: './media/cartas/',
    AUTH: './auth_info_baileys'
  },

  // Configuración de Baileys
  BAILEYS_CONFIG: {
    printQRInTerminal: false, // No mostrar QR en terminal, usaremos la web
    browser: ['Bottom Bot', 'Chrome', '1.0.0'],
    syncFullHistory: false,
    markOnlineOnConnect: false,
    defaultQueryTimeoutMs: 60000
  },

  // Tiempo de timeout de sesión en minutos (opcional, 0 = sin timeout)
  SESSION_TIMEOUT: 30
};

export default SETTINGS;

