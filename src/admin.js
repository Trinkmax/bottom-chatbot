/**
 * Módulo de comandos administrativos
 * Permite controlar el bot de forma remota mediante comandos de WhatsApp
 */

import { ADMIN_CONFIG, BOT_STATE, ADMIN_SESSIONS } from '../config/admin.js';
import * as sessionManager from './sessionManager.js';
import moment from 'moment-timezone';

/**
 * Verifica si un usuario es administrador autenticado
 */
export function esAdminAutenticado(userId) {
  const sesion = ADMIN_SESSIONS.get(userId);
  if (!sesion) return false;
  
  // Verificar si la sesión no ha expirado
  const ahora = Date.now();
  const tiempoExpiracion = ADMIN_CONFIG.TIMEOUT_SESION * 60 * 1000;
  
  if (ahora - sesion.timestamp > tiempoExpiracion) {
    ADMIN_SESSIONS.delete(userId);
    return false;
  }
  
  return true;
}

/**
 * Autentica un usuario como administrador
 */
export function autenticarAdmin(userId, password) {
  // Verificar contraseña
  if (password !== ADMIN_CONFIG.PASSWORD) {
    return false;
  }
  
  // Si hay números autorizados, verificar que el usuario esté en la lista
  if (ADMIN_CONFIG.NUMEROS_AUTORIZADOS.length > 0) {
    if (!ADMIN_CONFIG.NUMEROS_AUTORIZADOS.includes(userId)) {
      return false;
    }
  }
  
  // Crear sesión de admin
  ADMIN_SESSIONS.set(userId, {
    userId: userId,
    timestamp: Date.now(),
    autenticado: true
  });
  
  return true;
}

/**
 * Detecta si un mensaje es un comando de admin
 */
export function esComandoAdmin(mensaje) {
  return mensaje.trim().startsWith('/');
}

/**
 * Procesa comandos administrativos
 */
export async function procesarComandoAdmin(sock, userId, mensaje) {
  const comando = mensaje.trim();
  const partes = comando.split(' ');
  const cmd = partes[0].toLowerCase();
  const args = partes.slice(1);
  
  // Comando de autenticación (no requiere estar autenticado)
  if (cmd === '/admin') {
    return await comandoAutenticar(sock, userId, args);
  }
  
  // Verificar autenticación para otros comandos
  if (!esAdminAutenticado(userId)) {
    return await enviarMensaje(sock, userId, 
      '❌ *No autorizado*\n\n' +
      'Primero debes autenticarte usando:\n' +
      '`/admin <contraseña>`'
    );
  }
  
  // Actualizar timestamp de la sesión
  const sesion = ADMIN_SESSIONS.get(userId);
  if (sesion) {
    sesion.timestamp = Date.now();
  }
  
  // Procesar comandos
  switch (cmd) {
    case '/ayuda':
    case '/help':
      return await comandoAyuda(sock, userId);
    
    case '/pausar':
      return await comandoPausar(sock, userId, args);
    
    case '/activar':
    case '/reanudar':
      return await comandoActivar(sock, userId);
    
    case '/fecha_especial':
    case '/fecha':
      return await comandoFechaEspecial(sock, userId, args);
    
    case '/ver_fechas':
    case '/fechas':
      return await comandoVerFechas(sock, userId);
    
    case '/eliminar_fecha':
      return await comandoEliminarFecha(sock, userId, args);
    
    case '/estadisticas':
    case '/stats':
      return await comandoEstadisticas(sock, userId);
    
    case '/limpiar_sesiones':
      return await comandoLimpiarSesiones(sock, userId);
    
    case '/estado':
    case '/status':
      return await comandoEstado(sock, userId);
    
    case '/broadcast':
    case '/difusion':
      return await comandoBroadcast(sock, userId, args);
    
    case '/reiniciar_stats':
      return await comandoReiniciarEstadisticas(sock, userId);
    
    case '/cerrar_sesion':
    case '/logout':
      return await comandoCerrarSesion(sock, userId);
    
    case '/agregar_fecha':
      return await comandoAgregarFechaPermitida(sock, userId, args);
    
    case '/quitar_fecha':
      return await comandoQuitarFechaPermitida(sock, userId, args);
    
    case '/ver_fechas_permitidas':
    case '/fechas_permitidas':
      return await comandoVerFechasPermitidas(sock, userId);
    
    case '/configurar_dias':
    case '/dias':
      return await comandoConfigurarDias(sock, userId, args);
    
    case '/ver_dias':
      return await comandoVerDias(sock, userId);
    
    default:
      return await enviarMensaje(sock, userId, 
        '❌ *Comando no reconocido*\n\n' +
        'Escribe `/ayuda` para ver los comandos disponibles.'
      );
  }
}

/**
 * Comando: /admin <contraseña>
 */
async function comandoAutenticar(sock, userId, args) {
  if (args.length === 0) {
    return await enviarMensaje(sock, userId,
      '🔐 *Autenticación de Administrador*\n\n' +
      'Uso: `/admin <contraseña>`\n\n' +
      'Ingresa la contraseña para acceder a los comandos de administración.'
    );
  }
  
  const password = args[0];
  
  if (autenticarAdmin(userId, password)) {
    return await enviarMensaje(sock, userId,
      '✅ *Autenticación exitosa*\n\n' +
      'Ahora tienes acceso a los comandos de administración.\n\n' +
      'Escribe `/ayuda` para ver los comandos disponibles.'
    );
  } else {
    return await enviarMensaje(sock, userId,
      '❌ *Autenticación fallida*\n\n' +
      'Contraseña incorrecta o usuario no autorizado.'
    );
  }
}

/**
 * Comando: /ayuda
 */
async function comandoAyuda(sock, userId) {
  const mensaje = `📋 *COMANDOS DE ADMINISTRACIÓN*

*🤖 Control del Bot:*
• \`/pausar [mensaje]\` - Pausar el bot
• \`/activar\` - Reactivar el bot
• \`/estado\` - Ver estado actual del bot

*📅 Fechas Especiales (mensajes):*
• \`/fecha_especial <DD/MM> <mensaje>\` - Configurar fecha especial
• \`/ver_fechas\` - Ver fechas configuradas
• \`/eliminar_fecha <DD/MM>\` - Eliminar fecha especial

*📆 Días y Fechas Permitidas (reservas):*
• \`/agregar_fecha <DD/MM>\` - Permitir reserva en fecha específica
• \`/quitar_fecha <DD/MM>\` - Quitar fecha permitida
• \`/ver_fechas_permitidas\` - Ver fechas específicas habilitadas
• \`/configurar_dias <0-6>\` - Configurar días permitidos
• \`/ver_dias\` - Ver días configurados

*📊 Estadísticas:*
• \`/estadisticas\` - Ver estadísticas del bot
• \`/reiniciar_stats\` - Reiniciar estadísticas

*🔧 Gestión:*
• \`/limpiar_sesiones\` - Limpiar todas las sesiones
• \`/broadcast <mensaje>\` - Enviar mensaje a usuarios activos

*🔐 Sesión:*
• \`/cerrar_sesion\` - Cerrar sesión de admin

_Los comandos son sensibles a mayúsculas/minúsculas_`;

  return await enviarMensaje(sock, userId, mensaje);
}

/**
 * Comando: /pausar [mensaje]
 */
async function comandoPausar(sock, userId, args) {
  if (BOT_STATE.pausado) {
    return await enviarMensaje(sock, userId, '⚠️ El bot ya está pausado.');
  }
  
  const mensajePersonalizado = args.join(' ') || 
    '⏸️ *Bot en mantenimiento*\n\nEl bot está temporalmente fuera de servicio. Por favor, intenta más tarde.';
  
  BOT_STATE.pausado = true;
  BOT_STATE.mensajePausa = mensajePersonalizado;
  
  return await enviarMensaje(sock, userId,
    '✅ *Bot pausado correctamente*\n\n' +
    '*Mensaje que verán los usuarios:*\n' +
    mensajePersonalizado
  );
}

/**
 * Comando: /activar
 */
async function comandoActivar(sock, userId) {
  if (!BOT_STATE.pausado) {
    return await enviarMensaje(sock, userId, '⚠️ El bot ya está activo.');
  }
  
  BOT_STATE.pausado = false;
  BOT_STATE.mensajePausa = null;
  
  return await enviarMensaje(sock, userId,
    '✅ *Bot reactivado correctamente*\n\n' +
    'El bot está funcionando normalmente.'
  );
}

/**
 * Comando: /fecha_especial <DD/MM> <mensaje>
 */
async function comandoFechaEspecial(sock, userId, args) {
  if (args.length < 2) {
    return await enviarMensaje(sock, userId,
      '❌ *Uso incorrecto*\n\n' +
      'Uso: `/fecha_especial <DD/MM> <mensaje>`\n\n' +
      '*Ejemplo:*\n' +
      '`/fecha_especial 25/12 ¡Feliz Navidad! 🎄 Hoy estamos cerrados.`'
    );
  }
  
  const fecha = args[0];
  const mensaje = args.slice(1).join(' ');
  
  // Validar formato de fecha
  if (!/^\d{1,2}\/\d{1,2}$/.test(fecha)) {
    return await enviarMensaje(sock, userId,
      '❌ *Formato de fecha inválido*\n\n' +
      'Usa el formato DD/MM\n' +
      '*Ejemplo:* `25/12`'
    );
  }
  
  BOT_STATE.fechasEspeciales.set(fecha, mensaje);
  
  return await enviarMensaje(sock, userId,
    '✅ *Fecha especial configurada*\n\n' +
    `*Fecha:* ${fecha}\n` +
    `*Mensaje:* ${mensaje}\n\n` +
    'Los usuarios verán este mensaje en esa fecha.'
  );
}

/**
 * Comando: /ver_fechas
 */
async function comandoVerFechas(sock, userId) {
  if (BOT_STATE.fechasEspeciales.size === 0) {
    return await enviarMensaje(sock, userId,
      'ℹ️ No hay fechas especiales configuradas.\n\n' +
      'Usa `/fecha_especial <DD/MM> <mensaje>` para agregar una.'
    );
  }
  
  let mensaje = '📅 *FECHAS ESPECIALES CONFIGURADAS*\n\n';
  
  for (const [fecha, texto] of BOT_STATE.fechasEspeciales) {
    mensaje += `*${fecha}*\n${texto}\n\n`;
  }
  
  mensaje += '_Usa `/eliminar_fecha <DD/MM>` para eliminar una fecha_';
  
  return await enviarMensaje(sock, userId, mensaje);
}

/**
 * Comando: /eliminar_fecha <DD/MM>
 */
async function comandoEliminarFecha(sock, userId, args) {
  if (args.length === 0) {
    return await enviarMensaje(sock, userId,
      '❌ *Uso incorrecto*\n\n' +
      'Uso: `/eliminar_fecha <DD/MM>`\n\n' +
      '*Ejemplo:*\n' +
      '`/eliminar_fecha 25/12`'
    );
  }
  
  const fecha = args[0];
  
  if (!BOT_STATE.fechasEspeciales.has(fecha)) {
    return await enviarMensaje(sock, userId,
      `❌ No existe una fecha especial configurada para ${fecha}`
    );
  }
  
  BOT_STATE.fechasEspeciales.delete(fecha);
  
  return await enviarMensaje(sock, userId,
    `✅ *Fecha especial eliminada*\n\nLa fecha ${fecha} ha sido eliminada.`
  );
}

/**
 * Comando: /estadisticas
 */
async function comandoEstadisticas(sock, userId) {
  const stats = BOT_STATE.estadisticas;
  const tiempoActivo = Date.now() - stats.inicioBot;
  const horas = Math.floor(tiempoActivo / (1000 * 60 * 60));
  const minutos = Math.floor((tiempoActivo % (1000 * 60 * 60)) / (1000 * 60));
  
  const sesionesActivas = sessionManager.obtenerNumeroSesiones();
  
  const mensaje = `📊 *ESTADÍSTICAS DEL BOT*

*Tiempo activo:* ${horas}h ${minutos}m
*Sesiones activas:* ${sesionesActivas}
*Mensajes recibidos:* ${stats.mensajesRecibidos}
*Reservas completadas:* ${stats.reservasCompletadas}

*Estado:* ${BOT_STATE.pausado ? '⏸️ Pausado' : '✅ Activo'}
*Fechas especiales:* ${BOT_STATE.fechasEspeciales.size}
*Admins conectados:* ${ADMIN_SESSIONS.size}

_Estadísticas desde: ${moment(stats.inicioBot).format('DD/MM/YYYY HH:mm')}_`;

  return await enviarMensaje(sock, userId, mensaje);
}

/**
 * Comando: /limpiar_sesiones
 */
async function comandoLimpiarSesiones(sock, userId) {
  const cantidad = sessionManager.obtenerNumeroSesiones();
  
  if (cantidad === 0) {
    return await enviarMensaje(sock, userId, 'ℹ️ No hay sesiones activas para limpiar.');
  }
  
  // Limpiar todas las sesiones excepto las de admin
  sessionManager.limpiarSesionesInactivas(0);
  
  return await enviarMensaje(sock, userId,
    `✅ *Sesiones limpiadas*\n\nSe limpiaron ${cantidad} sesiones.`
  );
}

/**
 * Comando: /estado
 */
async function comandoEstado(sock, userId) {
  const sesionesActivas = sessionManager.obtenerNumeroSesiones();
  const fechaHoy = moment().tz('America/Argentina/Buenos_Aires').format('DD/MM');
  const fechaEspecialHoy = BOT_STATE.fechasEspeciales.get(fechaHoy);
  
  let mensaje = `🤖 *ESTADO DEL BOT*

*Estado general:* ${BOT_STATE.pausado ? '⏸️ Pausado' : '✅ Activo'}
*Sesiones activas:* ${sesionesActivas}
*Fecha de hoy:* ${fechaHoy}`;

  if (fechaEspecialHoy) {
    mensaje += `\n\n*⚠️ Fecha especial activa:*\n${fechaEspecialHoy}`;
  }
  
  if (BOT_STATE.pausado && BOT_STATE.mensajePausa) {
    mensaje += `\n\n*Mensaje de pausa:*\n${BOT_STATE.mensajePausa}`;
  }
  
  return await enviarMensaje(sock, userId, mensaje);
}

/**
 * Comando: /broadcast <mensaje>
 */
async function comandoBroadcast(sock, userId, args) {
  if (args.length === 0) {
    return await enviarMensaje(sock, userId,
      '❌ *Uso incorrecto*\n\n' +
      'Uso: `/broadcast <mensaje>`\n\n' +
      'Envía un mensaje a todos los usuarios con sesiones activas.'
    );
  }
  
  const mensaje = args.join(' ');
  const sesionesActivas = sessionManager.obtenerNumeroSesiones();
  
  if (sesionesActivas === 0) {
    return await enviarMensaje(sock, userId,
      'ℹ️ No hay usuarios activos para enviar el mensaje.'
    );
  }
  
  // Esta funcionalidad requiere acceso a las sesiones
  // Por ahora solo confirmamos el comando
  return await enviarMensaje(sock, userId,
    `✅ *Broadcast preparado*\n\n` +
    `*Mensaje:* ${mensaje}\n` +
    `*Destinatarios:* ${sesionesActivas} usuarios activos\n\n` +
    '⚠️ _Nota: Esta función enviará el mensaje en la próxima actualización_'
  );
}

/**
 * Comando: /reiniciar_stats
 */
async function comandoReiniciarEstadisticas(sock, userId) {
  BOT_STATE.estadisticas = {
    mensajesRecibidos: 0,
    reservasCompletadas: 0,
    sesionesActivas: 0,
    inicioBot: Date.now()
  };
  
  return await enviarMensaje(sock, userId,
    '✅ *Estadísticas reiniciadas*\n\n' +
    'Los contadores han sido reseteados a cero.'
  );
}

/**
 * Comando: /cerrar_sesion
 */
async function comandoCerrarSesion(sock, userId) {
  ADMIN_SESSIONS.delete(userId);
  
  return await enviarMensaje(sock, userId,
    '👋 *Sesión cerrada*\n\n' +
    'Tu sesión de administrador ha sido cerrada.\n' +
    'Usa `/admin <contraseña>` para volver a autenticarte.'
  );
}

/**
 * Verifica si hay una fecha especial para hoy
 */
export function verificarFechaEspecial() {
  const fechaHoy = moment().tz('America/Argentina/Buenos_Aires').format('DD/MM');
  return BOT_STATE.fechasEspeciales.get(fechaHoy);
}

/**
 * Verifica si el bot está pausado
 */
export function estaPausado() {
  return BOT_STATE.pausado;
}

/**
 * Obtiene el mensaje de pausa
 */
export function obtenerMensajePausa() {
  return BOT_STATE.mensajePausa;
}

/**
 * Incrementa el contador de mensajes
 */
export function incrementarMensajes() {
  BOT_STATE.estadisticas.mensajesRecibidos++;
}

/**
 * Incrementa el contador de reservas
 */
export function incrementarReservas() {
  BOT_STATE.estadisticas.reservasCompletadas++;
}

/**
 * Comando: /agregar_fecha <DD/MM>
 */
async function comandoAgregarFechaPermitida(sock, userId, args) {
  if (args.length === 0) {
    return await enviarMensaje(sock, userId,
      '❌ *Uso incorrecto*\n\n' +
      'Uso: `/agregar_fecha <DD/MM>`\n\n' +
      '*Ejemplo:*\n' +
      '`/agregar_fecha 23/11` - Permite reservas para el 23/11\n\n' +
      'Esto permite reservar en una fecha específica, incluso si ese día de la semana normalmente no está permitido.'
    );
  }
  
  const fecha = args[0];
  
  // Validar formato de fecha
  if (!/^\d{1,2}\/\d{1,2}$/.test(fecha)) {
    return await enviarMensaje(sock, userId,
      '❌ *Formato de fecha inválido*\n\n' +
      'Usa el formato DD/MM\n' +
      '*Ejemplo:* `23/11`'
    );
  }
  
  // Agregar fecha a las excepciones
  BOT_STATE.fechasExcepcion.add(fecha);
  
  return await enviarMensaje(sock, userId,
    '✅ *Fecha permitida agregada*\n\n' +
    `*Fecha:* ${fecha}\n\n` +
    'Ahora los usuarios pueden reservar para esta fecha específica.\n\n' +
    '_Usa `/ver_fechas_permitidas` para ver todas las fechas habilitadas._'
  );
}

/**
 * Comando: /quitar_fecha <DD/MM>
 */
async function comandoQuitarFechaPermitida(sock, userId, args) {
  if (args.length === 0) {
    return await enviarMensaje(sock, userId,
      '❌ *Uso incorrecto*\n\n' +
      'Uso: `/quitar_fecha <DD/MM>`\n\n' +
      '*Ejemplo:*\n' +
      '`/quitar_fecha 23/11`'
    );
  }
  
  const fecha = args[0];
  
  if (!BOT_STATE.fechasExcepcion.has(fecha)) {
    return await enviarMensaje(sock, userId,
      `❌ La fecha ${fecha} no está en la lista de fechas permitidas.\n\n` +
      'Usa `/ver_fechas_permitidas` para ver las fechas configuradas.'
    );
  }
  
  BOT_STATE.fechasExcepcion.delete(fecha);
  
  return await enviarMensaje(sock, userId,
    `✅ *Fecha quitada*\n\nLa fecha ${fecha} ya no está habilitada para reservas.`
  );
}

/**
 * Comando: /ver_fechas_permitidas
 */
async function comandoVerFechasPermitidas(sock, userId) {
  if (BOT_STATE.fechasExcepcion.size === 0) {
    return await enviarMensaje(sock, userId,
      'ℹ️ No hay fechas específicas habilitadas.\n\n' +
      'Las reservas solo están permitidas para los días de la semana configurados.\n\n' +
      'Usa `/agregar_fecha <DD/MM>` para habilitar una fecha específica.'
    );
  }
  
  let mensaje = '📆 *FECHAS ESPECÍFICAS HABILITADAS*\n\n';
  mensaje += 'Estas fechas están permitidas para reservas:\n\n';
  
  const fechasArray = Array.from(BOT_STATE.fechasExcepcion).sort();
  for (const fecha of fechasArray) {
    mensaje += `• ${fecha}\n`;
  }
  
  mensaje += '\n_Usa `/quitar_fecha <DD/MM>` para deshabilitar una fecha_';
  
  return await enviarMensaje(sock, userId, mensaje);
}

/**
 * Comando: /configurar_dias <días>
 */
async function comandoConfigurarDias(sock, userId, args) {
  if (args.length === 0) {
    return await enviarMensaje(sock, userId,
      '❌ *Uso incorrecto*\n\n' +
      'Uso: `/configurar_dias <días separados por comas>`\n\n' +
      '*Días de la semana:*\n' +
      '0 = Domingo\n' +
      '1 = Lunes\n' +
      '2 = Martes\n' +
      '3 = Miércoles\n' +
      '4 = Jueves\n' +
      '5 = Viernes\n' +
      '6 = Sábado\n\n' +
      '*Ejemplos:*\n' +
      '`/configurar_dias 4,5,6` - Jueves, Viernes, Sábado\n' +
      '`/configurar_dias 5,6,0` - Viernes, Sábado, Domingo\n' +
      '`/configurar_dias 0,1,2,3,4,5,6` - Todos los días'
    );
  }
  
  const diasInput = args[0];
  const dias = diasInput.split(',').map(d => parseInt(d.trim(), 10));
  
  // Validar que sean números entre 0 y 6
  const invalidos = dias.filter(d => isNaN(d) || d < 0 || d > 6);
  if (invalidos.length > 0) {
    return await enviarMensaje(sock, userId,
      '❌ *Días inválidos*\n\n' +
      'Los días deben ser números entre 0 (domingo) y 6 (sábado).\n\n' +
      '*Ejemplo:* `/configurar_dias 4,5,6`'
    );
  }
  
  // Actualizar días permitidos
  BOT_STATE.diasPermitidos = dias;
  
  const nombresDias = dias.map(d => {
    const temp = moment().day(d);
    return temp.format('dddd');
  }).join(', ');
  
  return await enviarMensaje(sock, userId,
    '✅ *Días permitidos actualizados*\n\n' +
    `*Días configurados:* ${nombresDias}\n\n` +
    'Ahora solo se aceptarán reservas para estos días de la semana.\n\n' +
    '_Usa `/agregar_fecha <DD/MM>` para permitir fechas específicas adicionales._'
  );
}

/**
 * Comando: /ver_dias
 */
async function comandoVerDias(sock, userId) {
  const dias = BOT_STATE.diasPermitidos;
  
  const nombresDias = dias.map(d => {
    const temp = moment().day(d);
    return temp.format('dddd');
  }).join(', ');
  
  let mensaje = '📆 *DÍAS PERMITIDOS PARA RESERVAS*\n\n';
  mensaje += `*Días de la semana:* ${nombresDias}\n\n`;
  
  if (BOT_STATE.fechasExcepcion.size > 0) {
    mensaje += `*Fechas específicas adicionales:* ${BOT_STATE.fechasExcepcion.size}\n`;
    mensaje += '(Usa `/ver_fechas_permitidas` para verlas)\n\n';
  }
  
  mensaje += '_Usa `/configurar_dias` para cambiar los días permitidos_';
  
  return await enviarMensaje(sock, userId, mensaje);
}

/**
 * Función auxiliar para enviar mensajes
 */
async function enviarMensaje(sock, userId, texto) {
  try {
    await sock.sendMessage(userId, { text: texto });
  } catch (error) {
    console.error(`Error al enviar mensaje a ${userId}:`, error);
  }
}

export default {
  esAdminAutenticado,
  autenticarAdmin,
  esComandoAdmin,
  procesarComandoAdmin,
  verificarFechaEspecial,
  estaPausado,
  obtenerMensajePausa,
  incrementarMensajes,
  incrementarReservas
};

