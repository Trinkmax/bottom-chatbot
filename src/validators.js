/**
 * Módulo de validaciones
 * Valida todas las entradas del usuario
 */

import moment from 'moment-timezone';
import { SETTINGS } from '../config/settings.js';
import { BOT_STATE } from '../config/admin.js';

/**
 * Valida si una opción está dentro de las opciones válidas
 */
export function validarOpcion(input, opcionesValidas) {
  const inputTrim = input.trim();
  return opcionesValidas.includes(inputTrim);
}

/**
 * Valida y parsea una fecha en formato DD/MM
 * @param {string} fechaInput - Fecha en formato DD/MM
 * @returns {Object} { valido: boolean, fecha: moment|null, mensaje: string }
 */
export function validarFecha(fechaInput) {
  const inputTrim = fechaInput.trim();
  
  // Validar formato básico DD/MM
  const formatoRegex = /^(\d{1,2})\/(\d{1,2})$/;
  const match = inputTrim.match(formatoRegex);
  
  if (!match) {
    return {
      valido: false,
      fecha: null,
      mensaje: 'Formato inválido. Usa DD/MM (ejemplo: 25/12)'
    };
  }

  const dia = parseInt(match[1], 10);
  const mes = parseInt(match[2], 10);
  
  // Validar que sean números válidos
  if (dia < 1 || dia > 31 || mes < 1 || mes > 12) {
    return {
      valido: false,
      fecha: null,
      mensaje: 'Día o mes inválido'
    };
  }

  // Obtener el año actual y siguiente
  const ahora = moment().tz(SETTINGS.HORARIO_ATENCION.TIMEZONE);
  const mesActual = ahora.month() + 1; // moment usa 0-11
  let anio = ahora.year();

  // Si el mes ingresado es menor al actual y la diferencia es > 9 meses
  // asumimos que es el año siguiente
  if (mes < mesActual && (mesActual - mes) > 9) {
    anio = anio + 1;
  }

  // Crear fecha con moment
  const fecha = moment.tz(`${anio}-${mes.toString().padStart(2, '0')}-${dia.toString().padStart(2, '0')}`, SETTINGS.HORARIO_ATENCION.TIMEZONE);

  // Validar que la fecha sea válida (por ej. 31/02 no es válido)
  if (!fecha.isValid()) {
    return {
      valido: false,
      fecha: null,
      mensaje: 'Fecha inválida (verifica el día del mes)'
    };
  }

  // Validar que sea una fecha futura
  if (fecha.isBefore(ahora, 'day')) {
    return {
      valido: false,
      fecha: null,
      mensaje: 'La fecha debe ser futura'
    };
  }

  // Verificar si la fecha es una excepción (fechas específicas permitidas)
  const fechaFormato = `${dia}/${mes}`;
  if (BOT_STATE.fechasExcepcion.has(fechaFormato)) {
    // Esta fecha específica está permitida, permitir reserva
    return {
      valido: true,
      fecha: fecha,
      mensaje: 'Fecha válida (excepción)'
    };
  }

  // Validar que sea uno de los días permitidos (usar BOT_STATE en lugar de SETTINGS)
  const diaSemana = fecha.day();
  const diasPermitidos = BOT_STATE.diasPermitidos || SETTINGS.DIAS_PERMITIDOS;
  
  if (!diasPermitidos.includes(diaSemana)) {
    const nombreDia = fecha.format('dddd');
    const nombresDias = diasPermitidos.map(d => {
      const temp = moment().day(d);
      return temp.format('dddd');
    }).join(', ');
    
    return {
      valido: false,
      fecha: null,
      mensaje: `La fecha seleccionada es ${nombreDia}. Solo aceptamos reservas para: ${nombresDias}`
    };
  }

  return {
    valido: true,
    fecha: fecha,
    mensaje: 'Fecha válida'
  };
}

/**
 * Valida que la entrada sea un número positivo
 */
export function validarNumero(input) {
  const inputTrim = input.trim();
  const numero = parseInt(inputTrim, 10);
  
  if (isNaN(numero) || numero <= 0) {
    return {
      valido: false,
      numero: null,
      mensaje: 'Debe ser un número válido mayor a 0'
    };
  }

  return {
    valido: true,
    numero: numero,
    mensaje: 'Número válido'
  };
}

/**
 * Valida un número de teléfono
 * Acepta números con o sin espacios/guiones
 */
export function validarTelefono(input) {
  const inputTrim = input.trim();
  // Remover espacios, guiones, paréntesis
  const telefonoLimpio = inputTrim.replace(/[\s\-()]/g, '');
  
  // Validar que solo contenga números y tenga al menos 8 dígitos
  const regexTelefono = /^[0-9]{8,15}$/;
  
  if (!regexTelefono.test(telefonoLimpio)) {
    return {
      valido: false,
      telefono: null,
      mensaje: 'Número de teléfono inválido. Debe contener entre 8 y 15 dígitos'
    };
  }

  return {
    valido: true,
    telefono: telefonoLimpio,
    mensaje: 'Teléfono válido'
  };
}

/**
 * Valida y limpia un usuario de Instagram
 */
export function validarInstagram(input) {
  let inputTrim = input.trim();
  
  // Remover @ si existe al inicio
  if (inputTrim.startsWith('@')) {
    inputTrim = inputTrim.substring(1);
  }

  // Validar formato de usuario de Instagram
  // Puede contener letras, números, puntos y guiones bajos
  // Longitud: 1-30 caracteres
  const regexInstagram = /^[a-zA-Z0-9._]{1,30}$/;
  
  if (!regexInstagram.test(inputTrim)) {
    return {
      valido: false,
      instagram: null,
      mensaje: 'Usuario de Instagram inválido'
    };
  }

  return {
    valido: true,
    instagram: inputTrim,
    mensaje: 'Usuario válido'
  };
}

/**
 * Valida un texto genérico (nombre)
 * No debe estar vacío y debe tener longitud razonable
 */
export function validarTexto(input, minLength = 2, maxLength = 100) {
  const inputTrim = input.trim();
  
  if (inputTrim.length < minLength) {
    return {
      valido: false,
      texto: null,
      mensaje: `Debe tener al menos ${minLength} caracteres`
    };
  }

  if (inputTrim.length > maxLength) {
    return {
      valido: false,
      texto: null,
      mensaje: `Debe tener máximo ${maxLength} caracteres`
    };
  }

  return {
    valido: true,
    texto: inputTrim,
    mensaje: 'Texto válido'
  };
}

/**
 * Verifica si estamos dentro del horario de atención
 */
export function estaDentroDeHorario() {
  const ahora = moment().tz(SETTINGS.HORARIO_ATENCION.TIMEZONE);
  const hora = ahora.hour();
  const minuto = ahora.minute();

  const horaInicio = SETTINGS.HORARIO_ATENCION.HORA_INICIO;
  const horaFin = SETTINGS.HORARIO_ATENCION.HORA_FIN;
  const minutoFin = SETTINGS.HORARIO_ATENCION.MINUTO_FIN;

  // Fuera de horario: 22:30 a 05:00
  // Dentro de horario: 05:00 a 22:30
  
  // Si la hora actual es mayor o igual a la hora de fin
  if (hora > horaFin || (hora === horaFin && minuto >= minutoFin)) {
    return false;
  }

  // Si la hora actual es menor a la hora de inicio
  if (hora < horaInicio) {
    return false;
  }

  return true;
}

export default {
  validarOpcion,
  validarFecha,
  validarNumero,
  validarTelefono,
  validarInstagram,
  validarTexto,
  estaDentroDeHorario
};

