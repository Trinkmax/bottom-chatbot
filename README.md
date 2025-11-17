# Bottom Chatbot - Bot de WhatsApp para Restaurante

Bot de WhatsApp automatizado para el restaurante Bottom, que gestiona reservas, información de ubicaciones, cartas y más.

## 🚀 Características

- ✅ Reservas de mesa con validación de fechas y horarios
- 🎂 Paquetes especiales para cumpleaños
- 📍 Información de ubicaciones (sedes Güemes y Cerro)
- 📄 Envío de cartas en PDF
- 🎟️ Información sobre QR/Listas
- ⏰ Respuestas automáticas fuera del horario de atención
- 💬 Flujo conversacional intuitivo
- 🔐 **Comandos administrativos** para control remoto del bot
- 📊 Sistema de estadísticas en tiempo real
- 📅 Configuración de fechas especiales (Navidad, Año Nuevo, etc.)
- ⏸️ Pausar/activar el bot remotamente

## 📋 Requisitos

- Node.js 18 o superior
- Una cuenta de WhatsApp que no esté en uso (para el bot)

## 🔧 Instalación

1. Clona el repositorio:
\`\`\`bash
git clone <url-del-repo>
cd Bottom-chatbot
\`\`\`

2. Instala las dependencias:
\`\`\`bash
npm install
\`\`\`

3. Configura las variables de entorno:
\`\`\`bash
cp .env.example .env
\`\`\`

4. Edita el archivo `.env` con tus datos:
   - Agrega las coordenadas de las ubicaciones
   - Personaliza los mensajes

5. Agrega los archivos multimedia:
   - Coloca las imágenes de combos en `media/combos/`
   - Coloca las cartas PDF en `media/cartas/`

## 📁 Estructura de Archivos

\`\`\`
Bottom-chatbot/
├── config/
│   ├── messages.js          # Todos los mensajes del bot
│   ├── settings.js          # Configuración general
│   └── admin.js            # Configuración de administración (nuevo)
├── src/
│   ├── bot.js              # Lógica principal del bot
│   ├── flows.js            # Manejo de flujos conversacionales
│   ├── sessionManager.js   # Gestión de sesiones de usuario
│   ├── validators.js       # Validaciones de entrada
│   └── admin.js            # Comandos administrativos (nuevo)
├── media/
│   ├── combos/             # Imágenes de combos (agregar manualmente)
│   └── cartas/             # PDFs de cartas (agregar manualmente)
├── server.js               # Servidor web para mostrar QR
├── index.js                # Punto de entrada
├── COMANDOS_ADMIN.md       # Documentación de comandos admin (nuevo)
├── configuracion.ejemplo.txt # Ejemplo de configuración (nuevo)
└── package.json
\`\`\`

## 🎯 Uso

1. Inicia el bot:
\`\`\`bash
npm start
\`\`\`

2. Accede a `http://localhost:3000` para ver el código QR

3. Escanea el código QR con WhatsApp:
   - Abre WhatsApp en tu teléfono
   - Ve a Configuración > Dispositivos vinculados
   - Toca "Vincular un dispositivo"
   - Escanea el código QR mostrado en el navegador

## 📱 Flujo del Bot

### Menú Principal
1. 🪑 Reservar mesa
2. 🎂 Festejar cumpleaños
3. 📍 Ver dirección
4. 📋 Ver carta
5. 🎟️ QR/Listas

### Flujo de Reserva
1. Selección de sede (Güemes/Cerro)
2. Ingreso de fecha (DD/MM)
3. Selección de horario (21:30, 22:00, 22:30)
4. Cantidad de personas
5. Nombre para la reserva
6. Número de teléfono
7. Usuario de Instagram
8. Confirmación de datos

## 🚀 Deploy en Railway

1. Crea un nuevo proyecto en [Railway](https://railway.app)
2. Conecta tu repositorio de GitHub
3. Configura las variables de entorno en Railway
4. Railway detectará automáticamente el `package.json` y ejecutará `npm start`

### Variables de Entorno en Railway
Asegúrate de configurar todas las variables del archivo `.env.example` en el panel de Railway.

## 🔐 Comandos de Administración

El bot incluye un sistema completo de comandos administrativos que te permite controlarlo remotamente desde WhatsApp.

### Configuración Inicial

1. Configura la contraseña de admin en Railway o en tu `.env`:
```env
ADMIN_PASSWORD=tu_contraseña_segura
```

2. (Opcional) Define números autorizados:
```env
ADMIN_NUMBERS=5493512345678,5493519876543
```

### Uso Rápido

**Autenticarse:**
```
/admin tu_contraseña
```

**Comandos principales:**
- `/pausar [mensaje]` - Pausar el bot
- `/activar` - Reactivar el bot
- `/fecha_especial 25/12 🎄 Mensaje` - Configurar fecha especial
- `/estadisticas` - Ver estadísticas del bot
- `/estado` - Ver estado actual
- `/ayuda` - Ver todos los comandos

📖 **Documentación completa:** Ver [COMANDOS_ADMIN.md](./COMANDOS_ADMIN.md)

### Ejemplos de Uso

**Pausar por mantenimiento:**
```
/pausar 🔧 Mantenimiento del sistema. Volvemos en 2 horas.
```

**Configurar Navidad:**
```
/fecha_especial 25/12 🎄 ¡Feliz Navidad! Hoy estamos cerrados.
```

**Ver estadísticas:**
```
/estadisticas
```

## 🛠️ Personalización

### Modificar Mensajes
Todos los mensajes están en `config/messages.js`. Puedes editarlos fácilmente sin tocar la lógica del bot.

### Cambiar Horarios
Los horarios de atención y opciones se configuran en `config/settings.js`.

## 📝 Notas Importantes

- El bot valida que las fechas sean jueves, viernes o sábado
- Las fechas deben ser futuras
- **Horario fuera de atención (21:30 a 05:00 ART):** El bot muestra un mensaje de "Reservas completas" con información de relacionistas y permite al usuario elegir si quiere reservar para otro día
- Las sesiones se almacenan en memoria (se pierden al reiniciar el bot)

## 🐛 Solución de Problemas

### El QR no se muestra
- Verifica que el puerto 3000 esté disponible
- Revisa los logs en la consola

### El bot no responde
- Verifica que la conexión con WhatsApp esté activa
- Revisa los logs de conexión en la consola

### Error al enviar archivos
- Verifica que los archivos existan en las carpetas `media/combos/` y `media/cartas/`
- Comprueba que los nombres de archivo coincidan con la configuración

## 📄 Licencia

ISC

## 👥 Soporte

Para soporte o consultas, contacta al desarrollador.
