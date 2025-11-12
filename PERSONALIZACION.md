# 🎨 Guía de Personalización - Bottom Chatbot

Esta guía te ayudará a personalizar fácilmente todos los aspectos del bot sin necesidad de conocimientos técnicos avanzados.

---

## 📝 Personalizar Mensajes

Todos los mensajes del bot están en el archivo `config/messages.js`.

### Cómo editar mensajes:

1. Abre el archivo `config/messages.js`
2. Busca el mensaje que quieres cambiar
3. Modifica el texto entre las comillas
4. Guarda el archivo
5. Reinicia el bot

### Ejemplo: Cambiar el menú principal

**Antes:**
```javascript
MENU_PRINCIPAL: `¡Hola! 👋 Bienvenido a *Bottom Resto Bar*

Por favor, selecciona una opción escribiendo el número:

1️⃣ Reservar mesa
2️⃣ Festejar cumpleaños
3️⃣ Ver dirección
4️⃣ Ver carta
5️⃣ QR/Listas

_Escribe el número de la opción que deseas_`,
```

**Después:**
```javascript
MENU_PRINCIPAL: `👋 ¡Hola! Bienvenido a *Bottom*

Selecciona una opción:

1️⃣ Hacer una reserva
2️⃣ Cumpleaños
3️⃣ ¿Dónde estamos?
4️⃣ Ver menú
5️⃣ Listas VIP

Escribe el número de tu opción`,
```

### Mensajes importantes a personalizar:

#### 1. Mensaje de QR/Listas
**Ubicación:** `.env`
```env
MENSAJE_QR_LISTAS=🎟️ *QR / LISTAS*\n\nEnvianos un DM a @bottom.restobar para entrar en la lista VIP 🎉
```

#### 2. Mensaje fuera de horario (21:30 a 5am)
**Ubicación:** `.env`

Este mensaje se muestra cuando los usuarios escriben fuera del horario de atención (21:30 a 5:00 AM).
El bot permite al usuario elegir si quiere reservar para otro día o no.

```env
MENSAJE_FUERA_HORARIO=‼️ *Reservas completas por hoy* ‼️\n\nPara ingresar a las listas o conseguir QR contactá a alguno de nuestros relacionistas:\n\n• @juani.quinteross 3573435902\n• @marttvillafanee\n• @agus_moya16\n• @jose.lopez1108\n• @valencappello\n\n💬 Enviales mensaje directo por Instagram\n\nNo te quedes afuera! 🔥\n\n¿Querés reservar para otro día?\n\n1️⃣ Sí, reservar para otro día\n2️⃣ No, gracias\n\n👉 Respondé 1 o 2
```

**Comportamiento:**
- Si el usuario responde **1**, el bot lo lleva al flujo de reservas normal
- Si el usuario responde **2**, el bot se despide y reinicia la sesión

#### 3. Mensaje de confirmación de reserva
**Ubicación:** `config/messages.js`
```javascript
RESERVA_CONFIRMADA: (datos) => `🎉 *¡RESERVA CONFIRMADA!*

Tus datos de reserva:

📍 *Sede:* ${datos.sede}
📅 *Fecha:* ${datos.fecha}
⏰ *Horario:* ${datos.horario}
👥 *Personas:* ${datos.cantidadPersonas}
✍️ *Nombre:* ${datos.nombre}
📱 *Teléfono:* ${datos.telefono}
📸 *Instagram:* @${datos.instagram}

¡Gracias por tu reserva! 💙
Te esperamos en *Bottom Resto Bar*`,
```

---

## ⚙️ Configurar Horarios y Opciones

Todas las configuraciones están en `config/settings.js`.

### 1. Cambiar horarios de reserva

```javascript
HORARIOS_RESERVA: {
  '1': '20:00',    // Primera opción
  '2': '21:00',    // Segunda opción
  '3': '22:00',    // Tercera opción
  '4': '23:00'     // Agregar cuarta opción
}
```

**Para agregar más horarios:**
1. Agrega una nueva línea con el siguiente número
2. Reinicia el bot
3. Los usuarios verán la nueva opción

### 2. Cambiar días permitidos para reservas

```javascript
// 0 = Domingo, 1 = Lunes, 2 = Martes, 3 = Miércoles,
// 4 = Jueves, 5 = Viernes, 6 = Sábado

DIAS_PERMITIDOS: [4, 5, 6],  // Jueves, Viernes, Sábado
```

**Ejemplos:**
- Solo fines de semana: `[5, 6, 0]` (Viernes, Sábado, Domingo)
- Toda la semana: `[0, 1, 2, 3, 4, 5, 6]`
- Solo viernes y sábado: `[5, 6]`

### 3. Cambiar horario de atención del bot

```javascript
HORARIO_ATENCION: {
  HORA_INICIO: 5,   // 05:00 AM
  HORA_FIN: 22,     // 22:30 PM
  MINUTO_FIN: 30,
  TIMEZONE: 'America/Argentina/Buenos_Aires'
}
```

**Para cambiar el horario:**
- `HORA_INICIO`: Hora de inicio (formato 24h)
- `HORA_FIN`: Hora de fin (formato 24h)
- `MINUTO_FIN`: Minutos de la hora de fin

**Ejemplos:**
- 08:00 a 23:59:
  ```javascript
  HORA_INICIO: 8,
  HORA_FIN: 23,
  MINUTO_FIN: 59
  ```

- 10:00 a 20:00:
  ```javascript
  HORA_INICIO: 10,
  HORA_FIN: 20,
  MINUTO_FIN: 0
  ```

### 4. Cambiar nombres de sedes

```javascript
SEDES: {
  '1': 'Centro',      // Cambiar "Güemes" por "Centro"
  '2': 'Norte'        // Cambiar "Cerro" por "Norte"
}
```

**Importante:** Si cambias los nombres aquí, también cámbialos en los mensajes.

---

## 📍 Actualizar Ubicaciones

### Paso 1: Obtener coordenadas

1. Ve a Google Maps: https://maps.google.com
2. Busca tu ubicación
3. Haz clic derecho en el punto exacto
4. Copia las coordenadas

### Paso 2: Actualizar en .env

```env
# Formato: https://www.google.com/maps?q=LATITUD,LONGITUD
UBICACION_GUEMES=https://www.google.com/maps?q=-38.7183,-62.2663
UBICACION_CERRO=https://www.google.com/maps?q=-38.7200,-62.2700
```

**Ejemplo real:**
```env
UBICACION_GUEMES=https://www.google.com/maps?q=-38.7183637,-62.2663479
```

---

## 🖼️ Agregar/Cambiar Imágenes de Combos

### Paso 1: Preparar las imágenes
- Formato: JPG, PNG o GIF
- Tamaño recomendado: máximo 2MB por imagen
- Cantidad: hasta 3 imágenes

### Paso 2: Agregar a la carpeta
1. Ve a `media/combos/`
2. Elimina las imágenes antiguas (si las hay)
3. Copia tus nuevas imágenes
4. Nómbralas:
   - `combo_1.jpg`
   - `combo_2.jpg`
   - `combo_3.jpg`

### Paso 3: Reiniciar el bot
```bash
npm start
```

---

## 📄 Actualizar Cartas en PDF

### Paso 1: Preparar los PDFs
- Formato: PDF
- Tamaño recomendado: máximo 10MB

### Paso 2: Agregar a la carpeta
1. Ve a `media/cartas/`
2. Reemplaza los PDFs existentes
3. **Nombres exactos requeridos:**
   - `carta_antes_00.pdf`
   - `carta_despues_00.pdf`

**Importante:** Los nombres deben ser exactamente estos, de lo contrario el bot no encontrará los archivos.

### Si quieres cambiar los nombres de las cartas:

1. Edita `config/settings.js`:
   ```javascript
   CARTAS: {
     '1': 'menu_dia.pdf',      // Cambiar nombre
     '2': 'menu_noche.pdf'     // Cambiar nombre
   }
   ```

2. Renombra tus archivos en `media/cartas/` con esos nombres

3. Actualiza los mensajes en `config/messages.js`:
   ```javascript
   CARTA_SELECCIONAR: `📋 *NUESTRA CARTA*

   ¿Qué carta deseas ver?

   1️⃣ Menú del día
   2️⃣ Menú de la noche`,
   ```

---

## 🎨 Agregar Emojis

Puedes agregar emojis a cualquier mensaje para hacerlo más atractivo.

### Dónde conseguir emojis:
- https://emojipedia.org/
- https://getemoji.com/

### Ejemplos de uso:

```javascript
// Antes
RESERVA_NOMBRE: `Nombre

¿A nombre de quién será la reserva?`,

// Después
RESERVA_NOMBRE: `✍️ *NOMBRE*

¿A nombre de quién será la reserva? 📝`,
```

---

## 🔢 Cambiar Formato de Fechas

### Formato actual: DD/MM/YYYY

Si quieres cambiar cómo se muestra la fecha:

Edita `src/validators.js`, línea donde se formatea la fecha:

```javascript
// Formato actual
const fechaFormateada = resultado.fecha.format('DD/MM/YYYY');

// Formato alternativo
const fechaFormateada = resultado.fecha.format('dddd DD [de] MMMM');
// Resultado: "Viernes 25 de Diciembre"
```

---

## 📞 Agregar Campo de Comentarios

Si quieres que los usuarios puedan agregar comentarios adicionales:

### Paso 1: Agregar estado
En `src/sessionManager.js`:
```javascript
RESERVA_COMENTARIOS: 'RESERVA_COMENTARIOS',
```

### Paso 2: Agregar mensaje
En `config/messages.js`:
```javascript
RESERVA_COMENTARIOS: `💬 *COMENTARIOS*

¿Tienes algún comentario o solicitud especial?

_Escribe tu comentario o "NO" para continuar_`,
```

### Paso 3: Agregar flujo
En `src/flows.js`, después del Instagram, agregar:
```javascript
case ESTADOS.RESERVA_COMENTARIOS:
  return await procesarReservaComentarios(sock, userId, mensajeTexto);
```

Y crear la función:
```javascript
async function procesarReservaComentarios(sock, userId, mensaje) {
  const comentarios = mensaje.trim();
  sessionManager.actualizarDatos(userId, { comentarios: comentarios });
  sessionManager.actualizarEstado(userId, ESTADOS.RESERVA_CONFIRMACION);
  
  const datos = sessionManager.obtenerDatosReserva(userId);
  return await enviarMensaje(sock, userId, MESSAGES.RESERVA_CONFIRMACION(datos));
}
```

---

## 🌐 Cambiar Puerto del Servidor

Si el puerto 3000 está ocupado:

### Opción 1: En .env
```env
PORT=8080
```

### Opción 2: En config/settings.js
```javascript
PORT: process.env.PORT || 8080,
```

---

## 🔄 Agregar Nueva Opción al Menú

### Ejemplo: Agregar opción "Ver eventos"

#### Paso 1: Agregar en settings.js
```javascript
OPCIONES_MENU: {
  RESERVAR_MESA: '1',
  FESTEJAR_CUMPLE: '2',
  VER_DIRECCION: '3',
  VER_CARTA: '4',
  QR_LISTAS: '5',
  VER_EVENTOS: '6'  // Nueva opción
}
```

#### Paso 2: Agregar mensaje en messages.js
```javascript
MENU_PRINCIPAL: `¡Hola! 👋 Bienvenido a *Bottom Resto Bar*

Por favor, selecciona una opción escribiendo el número:

1️⃣ Reservar mesa
2️⃣ Festejar cumpleaños
3️⃣ Ver dirección
4️⃣ Ver carta
5️⃣ QR/Listas
6️⃣ Ver eventos próximos

_Escribe el número de la opción que deseas_`,
```

#### Paso 3: Agregar lógica en flows.js
```javascript
case SETTINGS.OPCIONES_MENU.VER_EVENTOS:
  await enviarMensaje(sock, userId, "📅 Próximos eventos:\n\n• Viernes 15: Música en vivo\n• Sábado 16: DJ Set");
  return await mostrarMenuPrincipal(sock, userId);
```

---

## ⏰ Cambiar Tiempo de Inactividad

Por defecto, las sesiones expiran después de 30 minutos de inactividad.

En `config/settings.js`:
```javascript
SESSION_TIMEOUT: 30  // minutos

// Para cambiar a 60 minutos
SESSION_TIMEOUT: 60

// Para desactivar la expiración
SESSION_TIMEOUT: 0
```

---

## 📊 Tips de Personalización

### 1. Usa formato Markdown de WhatsApp
- `*texto*` = **negrita**
- `_texto_` = _cursiva_
- `~texto~` = ~tachado~
- `` `texto` `` = `monoespaciado`

### 2. Organiza los mensajes con líneas
```javascript
`━━━━━━━━━━━━━━━━━━
      TÍTULO
━━━━━━━━━━━━━━━━━━`
```

### 3. Usa saltos de línea estratégicamente
```javascript
`Línea 1

Línea 2 (con espacio arriba)

Línea 3`
```

### 4. Emojis para cada sección
- 🪑 Reservas
- 🎂 Cumpleaños
- 📍 Ubicación
- 📋 Menú
- 🎟️ Listas

---

## 🔍 Verificar Cambios

Después de hacer cambios:

1. **Guarda todos los archivos**
2. **Cierra el bot** (Ctrl+C)
3. **Inicia nuevamente** (`npm start`)
4. **Prueba** enviando un mensaje al bot

---

## 🆘 Problemas Comunes

### Los cambios no se reflejan
- Asegúrate de haber guardado el archivo
- Reinicia el bot completamente
- Verifica que no haya errores de sintaxis

### Error de sintaxis
- Verifica que todas las comillas estén cerradas
- Verifica que todas las comas estén en su lugar
- Usa un editor de código con resaltado de sintaxis

### El bot no responde después de cambios
- Revisa los logs en la terminal
- Deshaz los últimos cambios
- Verifica la sintaxis JavaScript

---

## 📚 Recursos Útiles

- **Emojis:** https://emojipedia.org/
- **Formato WhatsApp:** https://faq.whatsapp.com/539178204879377
- **Moment.js Formatos:** https://momentjs.com/docs/#/displaying/format/

---

**¡Personaliza tu bot y hazlo único!** 🎨

