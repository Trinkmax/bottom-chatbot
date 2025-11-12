/**
 * Módulo de mensajes del bot
 * Todos los mensajes están centralizados aquí para facilitar su edición
 */

export const MESSAGES = {
  // Mensaje de bienvenida y menú principal
  MENU_PRINCIPAL: `¡Hola! Bienvenido a *Bottom Resto Bar* 💚

Por favor, selecciona una opción escribiendo el número:

1️⃣ Reservar mesa
2️⃣ Festejar cumpleaños
3️⃣ Ver dirección
4️⃣ Ver carta
5️⃣ QR/Listas

_Escribe el número de la opción que deseas_`,

  // Mensajes para Opción 1: Reservar Mesa
  RESERVA_SELECCIONAR_SEDE: `🪑 *RESERVAR MESA*

Selecciona la sede:

1️⃣ Güemes 🌃
2️⃣ Cerro 🌄

_Escribe el número de tu elección_`,

  RESERVA_INGRESAR_FECHA: `📅 *FECHA DE RESERVA*

Por favor, ingresa la fecha de tu reserva en formato *DD/MM*

Ejemplo: 25/12

⚠️ Solo aceptamos reservas para *jueves, viernes y sábado*`,

  RESERVA_SELECCIONAR_HORARIO: `⏰ *HORARIO*

Selecciona el horario de tu preferencia:

1️⃣ 21:30
2️⃣ 22:00
3️⃣ 22:30

_Escribe el número de tu elección_`,

  RESERVA_CANTIDAD_PERSONAS: `👥 *CANTIDAD DE PERSONAS*

¿Para cuántas personas es la reserva?

_Escribe el número de comensales_`,

  RESERVA_NOMBRE: `✍️ *NOMBRE*

¿A nombre de quién será la reserva?`,

  RESERVA_TELEFONO: `📱 *TELÉFONO*

Por favor, ingresa tu número de teléfono

_Escribe solo números, sin espacios ni guiones_`,

  RESERVA_INSTAGRAM: `📸 *INSTAGRAM*

Por último, ingresa tu usuario de Instagram

_Escribe tu @usuario (con o sin @)_`,

  // Mensajes para Opción 2: Festejar Cumpleaños
  CUMPLE_COMBOS: `🎂 *FESTEJAR CUMPLEAÑOS*

¡Tenemos combos especiales para tu celebración! 🎉

Estos son nuestros combos disponibles:`,

  CUMPLE_PREGUNTA: `¿Te interesa alguno de estos combos?

1️⃣ Sí, me interesa
2️⃣ No, solo quiero reservar

_Escribe el número de tu elección_`,

  // Mensajes para Opción 3: Ver Dirección
  DIRECCION_SELECCIONAR: `📍 *NUESTRAS SEDES*

Selecciona la sede para ver la ubicación:

1️⃣ Sede Güemes 🌃
2️⃣ Sede Cerro 🌄

_Escribe el número de tu elección_`,

  // Mensajes para Opción 4: Ver Carta
  CARTA_SELECCIONAR: `📋 *NUESTRA CARTA*

¿Qué carta deseas ver?

1️⃣ Carta antes de 00:00
2️⃣ Carta después de 00:00

_Escribe el número de tu elección_`,

  // Mensaje para Opción 5: QR/Listas
  // Este mensaje se configurará desde las variables de entorno
  QR_LISTAS: process.env.MENSAJE_QR_LISTAS || `🎊 *QR Y LISTAS DE BOTTOM*

Para ingresar a las listas o conseguir QR contactá a alguno de nuestros relacionistas:

• @juani.quinteross 3573435902
• @marttvillafanee
• @agus_moya16
• @jose.lopez1108
• @valencappello

💬 Enviales mensaje directo por Instagram

¡No te quedes afuera de la mejor noche!`,

  // Mensajes de confirmación de reserva
  RESERVA_CONFIRMACION: (datos) => `✅ *RESUMEN DE TU RESERVA*

📍 *Sede:* ${datos.sede}
📅 *Fecha:* ${datos.fecha}
⏰ *Horario:* ${datos.horario}
👥 *Cantidad de personas:* ${datos.cantidadPersonas}
✍️ *Nombre:* ${datos.nombre}
📱 *Teléfono:* ${datos.telefono}
📸 *Instagram:* @${datos.instagram}

Por favor, verifica que los datos sean correctos:

1️⃣ Confirmar reserva
2️⃣ Realizar cambios
3️⃣ Cancelar reserva

_Escribe el número de tu elección_`,

  RESERVA_QUE_CAMBIAR: `¿Qué dato deseas modificar?

1️⃣ Sede
2️⃣ Fecha
3️⃣ Horario
4️⃣ Cantidad de personas
5️⃣ Nombre
6️⃣ Teléfono
7️⃣ Instagram

_Escribe el número del campo a modificar_`,

  RESERVA_CONFIRMADA: (datos) => `🎉 *¡RESERVA CONFIRMADA!*

Tus datos de reserva:

📍 *Sede:* ${datos.sede}
📅 *Fecha:* ${datos.fecha}
⏰ *Horario:* ${datos.horario}
👥 *Cantidad de personas:* ${datos.cantidadPersonas}
✍️ *Nombre:* ${datos.nombre}
📱 *Teléfono:* ${datos.telefono}
📸 *Instagram:* @${datos.instagram}

¡Muchas gracias por tu reserva! 💙
Te esperamos en *Bottom Resto Bar*

_Ante cualquier cambio o cancelación, comunicate con nosotros._`,

  RESERVA_CANCELADA: `❌ *Reserva cancelada*

No hay problema. Si cambias de opinión, puedes iniciar una nueva reserva en cualquier momento.

¿Deseas volver al menú principal?

1️⃣ Sí, volver al menú
2️⃣ No, gracias`,

  // Mensajes de validación y error
  ERROR_OPCION_INVALIDA: `❌ Opción no válida. Por favor, selecciona una opción correcta escribiendo el número correspondiente.`,

  ERROR_FECHA_INVALIDA: `❌ *Fecha inválida*

La fecha debe:
• Estar en formato DD/MM
• Corresponder a jueves, viernes o sábado
• Ser una fecha futura

Por favor, intenta nuevamente.`,

  ERROR_NUMERO_INVALIDO: `❌ Por favor, ingresa un número válido.`,

  ERROR_TELEFONO_INVALIDO: `❌ Por favor, ingresa un número de teléfono válido (solo números).`,

  // Mensaje fuera de horario (21:30 a 5am - Reservas completas)
  // Este mensaje se configurará desde las variables de entorno
  FUERA_HORARIO: process.env.MENSAJE_FUERA_HORARIO || `‼️ *Reservas completas por hoy* ‼️

Para ingresar a las listas o conseguir QR contactá a alguno de nuestros relacionistas:

• @juani.quinteross 3573435902
• @marttvillafanee
• @agus_moya16
• @jose.lopez1108
• @valencappello

💬 Enviales mensaje directo por Instagram

No te quedes afuera! 🔥

¿Querés reservar para otro día?

1️⃣ Sí, reservar para otro día
2️⃣ No, gracias

👉 Respondé 1 o 2`,

  // Mensajes de direcciones (con placeholders)
  DIRECCION_GUEMES: (url) => `📍 *Bottom Resto Bar - Sede Güemes*

Aquí está nuestra ubicación:
${url}

¡Te esperamos! 🍽️`,

  DIRECCION_CERRO: (url) => `📍 *Bottom Resto Bar - Sede Cerro*

Aquí está nuestra ubicación:
${url}

¡Te esperamos! 🍽️`,

  // Mensajes de envío de archivos
  ENVIANDO_CARTA: `📄 Enviando carta...`,
  
  ERROR_ARCHIVO_NO_ENCONTRADO: `❌ Lo sentimos, no pudimos encontrar el archivo solicitado. Por favor, contacta con el restaurante.`,

  // Mensaje de vuelta al menú
  VOLVER_MENU: `Escribe cualquier mensaje para volver al menú principal 📱`,

  // Mensaje cuando el usuario no quiere reservar fuera de horario
  NO_RESERVA_FUERA_HORARIO: `¡Gracias por tu interés! 💙

Seguinos en Instagram @bottom.restobar para estar al tanto de todas nuestras novedades.

¡Nos vemos pronto! 🔥`
};

export default MESSAGES;

