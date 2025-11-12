/**
 * Bot principal de WhatsApp
 * Maneja la conexión con Baileys y procesa los mensajes
 */

import { 
  makeWASocket,
  DisconnectReason, 
  useMultiFileAuthState,
  fetchLatestBaileysVersion
} from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import pino from 'pino';
import { SETTINGS } from '../config/settings.js';
import { MESSAGES } from '../config/messages.js';
import * as validators from './validators.js';
import * as flows from './flows.js';
import * as sessionManager from './sessionManager.js';
import * as servidor from '../server.js';

// Logger de Baileys
const logger = pino({ level: 'silent' }); // 'silent' para producción, 'debug' para desarrollo

let sock = null;

/**
 * Conecta el bot a WhatsApp
 */
export async function conectarBot() {
  try {
    // Obtener la última versión de Baileys
    const { version } = await fetchLatestBaileysVersion();
    console.log(`📱 Usando Baileys versión: ${version.join('.')}`);

    // Cargar estado de autenticación
    const { state, saveCreds } = await useMultiFileAuthState(SETTINGS.RUTAS.AUTH);

    // Crear socket de WhatsApp con configuración robusta
    sock = makeWASocket({
      version,
      auth: state,
      logger,
      ...SETTINGS.BAILEYS_CONFIG,
      // Configuración específica para entornos de producción como Railway
      qrTimeout: 60000, // Timeout de QR aumentado
      connectTimeoutMs: 60000,
      defaultQueryTimeoutMs: undefined,
      retryRequestDelayMs: 250,
      maxMsgRetryCount: 5,
      keepAliveIntervalMs: 10000,
      // Manejo de errores de WebSocket
      options: {
        logger,
        browser: ['Bottom Bot', 'Chrome', '1.0.0']
      }
    });

    // Guardar credenciales cuando se actualicen
    sock.ev.on('creds.update', saveCreds);

    // Manejar actualizaciones de conexión
    sock.ev.on('connection.update', async (update) => {
      await manejarActualizacionConexion(update);
    });

    // Manejar mensajes entrantes
    sock.ev.on('messages.upsert', async (messageUpdate) => {
      await manejarMensajes(messageUpdate);
    });

    console.log('🤖 Bot iniciado correctamente');
    
    return sock;
  } catch (error) {
    console.error('❌ Error al iniciar el bot:', error);
    throw error;
  }
}

/**
 * Maneja las actualizaciones de conexión
 */
async function manejarActualizacionConexion(update) {
  const { connection, lastDisconnect, qr } = update;

  // Si hay un QR, mostrarlo
  if (qr) {
    console.log('📲 Nuevo código QR generado');
    servidor.actualizarQR(qr);
    servidor.actualizarEstadoConexion('Escanea el código QR con WhatsApp');
  }

  // Manejar estado de conexión
  if (connection === 'close') {
    const statusCode = lastDisconnect?.error?.output?.statusCode;
    const shouldReconnect = statusCode !== DisconnectReason.loggedOut;
    
    console.log('❌ Conexión cerrada. Status:', statusCode);
    console.log('Error completo:', lastDisconnect?.error);
    
    servidor.actualizarEstadoConexion('Desconectado. Intentando reconectar...');

    if (shouldReconnect) {
      console.log('🔄 Reconectando en 5 segundos...');
      
      // Limpiar socket anterior
      if (sock) {
        try {
          sock.ev.removeAllListeners();
        } catch (e) {
          console.log('Error al limpiar listeners:', e.message);
        }
        sock = null;
      }
      
      // Esperar más tiempo antes de reconectar (Railway necesita más tiempo)
      setTimeout(() => {
        console.log('🔄 Iniciando reconexión...');
        conectarBot().catch(err => {
          console.error('Error en reconexión:', err);
          setTimeout(() => conectarBot(), 10000);
        });
      }, 5000);
    } else {
      console.log('❌ Sesión cerrada. Por favor, escanea el código QR nuevamente.');
      servidor.actualizarEstadoConexion('Sesión cerrada. Escanea el código QR nuevamente.');
    }
  } else if (connection === 'open') {
    console.log('✅ Conexión establecida con WhatsApp');
    servidor.actualizarEstadoConexion('✅ Conectado correctamente a WhatsApp');
    
    // Iniciar limpieza periódica de sesiones (solo una vez)
    if (SETTINGS.SESSION_TIMEOUT > 0 && !global.sessionCleanerStarted) {
      global.sessionCleanerStarted = true;
      setInterval(() => {
        sessionManager.limpiarSesionesInactivas(SETTINGS.SESSION_TIMEOUT);
      }, 5 * 60 * 1000); // Cada 5 minutos
    }
  } else if (connection === 'connecting') {
    console.log('🔄 Conectando...');
    servidor.actualizarEstadoConexion('Conectando a WhatsApp...');
  }
}

/**
 * Maneja los mensajes entrantes
 */
async function manejarMensajes(messageUpdate) {
  const { messages, type } = messageUpdate;

  // Solo procesar mensajes nuevos
  if (type !== 'notify') return;

  for (const message of messages) {
    try {
      // Ignorar mensajes vacíos o del propio bot
      if (!message.message || message.key.fromMe) continue;

      // Obtener información del mensaje
      const remoteJid = message.key.remoteJid;
      const messageType = Object.keys(message.message)[0];
      
      // Extraer texto del mensaje
      let textoMensaje = '';
      if (message.message.conversation) {
        textoMensaje = message.message.conversation;
      } else if (message.message.extendedTextMessage) {
        textoMensaje = message.message.extendedTextMessage.text;
      } else {
        // Si es un mensaje de otro tipo (imagen, audio, etc.), ignorar
        continue;
      }

      console.log(`📨 Mensaje de ${remoteJid}: ${textoMensaje}`);

      // Marcar mensaje como leído
      await sock.readMessages([message.key]);

      // Verificar horario de atención
      if (!validators.estaDentroDeHorario()) {
        await flows.procesarFueraDeHorario(sock, remoteJid, textoMensaje);
        continue;
      }

      // Procesar el mensaje
      await flows.procesarMensaje(sock, remoteJid, textoMensaje);

    } catch (error) {
      console.error('❌ Error al procesar mensaje:', error);
    }
  }
}

/**
 * Obtiene el socket actual
 */
export function obtenerSocket() {
  return sock;
}

/**
 * Verifica si el bot está conectado
 */
export function estaConectado() {
  return sock !== null;
}

export default {
  conectarBot,
  obtenerSocket,
  estaConectado
};

