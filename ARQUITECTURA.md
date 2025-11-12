# 🏗️ Arquitectura del Proyecto - Bottom Chatbot

## 📂 Estructura de Archivos

```
Bottom-chatbot/
├── config/                      # Configuración centralizada
│   ├── messages.js             # Todos los mensajes del bot
│   └── settings.js             # Configuración general
├── src/                        # Código fuente principal
│   ├── bot.js                  # Conexión con Baileys
│   ├── flows.js                # Lógica de flujos conversacionales
│   ├── sessionManager.js       # Gestión de sesiones de usuario
│   └── validators.js           # Validaciones de entrada
├── media/                      # Archivos multimedia
│   ├── combos/                 # Imágenes de combos de cumpleaños
│   └── cartas/                 # PDFs de cartas
├── auth_info_baileys/          # Credenciales de WhatsApp (generado automáticamente)
├── index.js                    # Punto de entrada de la aplicación
├── server.js                   # Servidor web para el QR
├── package.json                # Dependencias del proyecto
├── .env                        # Variables de entorno (configuración)
├── env.example                 # Ejemplo de variables de entorno
├── .gitignore                  # Archivos ignorados por Git
├── README.md                   # Documentación principal
├── GUIA_RAPIDA.md             # Guía de inicio rápido
├── INSTRUCCIONES_CONFIGURACION.md  # Instrucciones detalladas
└── ARQUITECTURA.md            # Este archivo
```

---

## 🔄 Flujo de Ejecución

### 1. Inicio de la Aplicación

```
index.js
  ├── Inicia servidor web (server.js)
  │   └── Expone página con QR en puerto 3000
  └── Conecta bot de WhatsApp (src/bot.js)
      └── Genera QR para conexión
```

### 2. Conexión de WhatsApp

```
Usuario escanea QR
  ↓
Baileys autentica
  ↓
Credenciales guardadas en auth_info_baileys/
  ↓
Bot conectado y escuchando mensajes
```

### 3. Procesamiento de Mensajes

```
Usuario envía mensaje
  ↓
bot.js recibe mensaje
  ↓
Valida horario de atención (validators.js)
  ↓
¿Fuera de horario (21:30-5am)?
  ├── SÍ → procesarFueraDeHorario (flows.js)
  │         ├─ Muestra mensaje de reservas completas
  │         ├─ Usuario elige: 1 (Reservar) o 2 (No gracias)
  │         └─ Procesa respuesta
  └── NO → Obtiene/crea sesión (sessionManager.js)
            ↓
            Procesa según estado actual (flows.js)
            ↓
            Envía respuesta al usuario
```

---

## 🧩 Módulos y Responsabilidades

### `index.js` - Punto de Entrada
- Inicializa la aplicación
- Inicia el servidor web
- Conecta el bot de WhatsApp
- Maneja errores globales y señales de cierre

### `server.js` - Servidor Web
- Crea servidor Express en puerto configurado
- Genera y muestra código QR en página web
- Actualiza estado de conexión en tiempo real
- Auto-refresca cada 3 segundos

### `src/bot.js` - Conexión WhatsApp
- Establece conexión con Baileys
- Maneja reconexiones automáticas
- Escucha mensajes entrantes
- Valida horarios de atención
- Marca mensajes como leídos

### `src/sessionManager.js` - Gestión de Sesiones
- Almacena estado de conversación por usuario
- Mantiene datos temporales de reserva
- Limpia sesiones inactivas
- Estados posibles:
  - `MENU_PRINCIPAL`
  - `RESERVA_SEDE`
  - `RESERVA_FECHA`
  - `RESERVA_HORARIO`
  - `RESERVA_CANTIDAD`
  - `RESERVA_NOMBRE`
  - `RESERVA_TELEFONO`
  - `RESERVA_INSTAGRAM`
  - `RESERVA_CONFIRMACION`
  - `RESERVA_CAMBIOS`
  - `CUMPLE_PREGUNTA`
  - `DIRECCION_SELECCIONAR`
  - `CARTA_SELECCIONAR`
  - `FUERA_HORARIO_RESPUESTA` (Nuevo: maneja respuestas fuera de horario)

### `src/validators.js` - Validaciones
- `validarOpcion()` - Valida opciones del menú
- `validarFecha()` - Valida formato DD/MM y días permitidos
- `validarNumero()` - Valida números positivos
- `validarTelefono()` - Valida formato de teléfono
- `validarInstagram()` - Valida usuario de Instagram
- `validarTexto()` - Valida texto genérico
- `estaDentroDeHorario()` - Verifica horario de atención

### `src/flows.js` - Flujos Conversacionales
- `procesarMensaje()` - Punto de entrada principal
- `procesarMenuPrincipal()` - Maneja selección del menú
- `procesarReserva*()` - Serie de funciones para el flujo de reserva
- `procesarCumpleanos()` - Flujo de cumpleaños
- `procesarDireccion()` - Envío de ubicaciones
- `procesarCarta()` - Envío de PDFs
- Funciones auxiliares:
  - `enviarMensaje()` - Envía mensajes de texto
  - `enviarImagenesCombos()` - Envía imágenes
  - `enviarPDF()` - Envía documentos PDF
  - `enviarUbicacion()` - Envía coordenadas

### `config/messages.js` - Mensajes
- Centraliza todos los textos del bot
- Mensajes estáticos
- Mensajes dinámicos (funciones)
- Fácil edición y personalización
- Soporte para variables de entorno

### `config/settings.js` - Configuración
- Configuración del servidor (puerto)
- Horarios de atención
- Días permitidos para reservas
- Opciones de menú
- Rutas de archivos
- Configuración de Baileys

---

## 🔐 Gestión de Estados

### Máquina de Estados Simple

El bot utiliza una máquina de estados simple para cada usuario:

```
INICIO
  ↓
MENU_PRINCIPAL ←──────────────────────┐
  ↓                                    │
[Usuario selecciona opción]           │
  ↓                                    │
┌─────────────────────────────────┐   │
│ Opción 1 o 2: Reserva/Cumpleaños│   │
└─────────────────────────────────┘   │
  ↓                                    │
RESERVA_SEDE                           │
  ↓                                    │
RESERVA_FECHA                          │
  ↓                                    │
RESERVA_HORARIO                        │
  ↓                                    │
RESERVA_CANTIDAD                       │
  ↓                                    │
RESERVA_NOMBRE                         │
  ↓                                    │
RESERVA_TELEFONO                       │
  ↓                                    │
RESERVA_INSTAGRAM                      │
  ↓                                    │
RESERVA_CONFIRMACION                   │
  ├─ Confirmar ──→ FIN ──→ ┘          │
  ├─ Cambiar ───→ RESERVA_CAMBIOS     │
  └─ Cancelar ──→ FIN ──→ ┘           │
```

---

## 💾 Almacenamiento de Datos

### Sesiones de Usuario (Memoria)
- **Ubicación:** Variable `sessions` en `sessionManager.js`
- **Tipo:** Map de JavaScript
- **Persistencia:** Solo en memoria (se pierde al reiniciar)
- **Contenido:**
  ```javascript
  {
    userId: string,
    estado: ESTADOS,
    datos: {
      sede: string,
      fecha: string,
      horario: string,
      cantidadPersonas: number,
      nombre: string,
      telefono: string,
      instagram: string
    },
    ultimaActividad: timestamp,
    esCumpleanos: boolean
  }
  ```

### Credenciales de WhatsApp (Archivo)
- **Ubicación:** `auth_info_baileys/`
- **Tipo:** Archivos JSON generados por Baileys
- **Persistencia:** Permanente (hasta desconexión manual)
- **Contenido:** Keys de encriptación, información de dispositivo

---

## 📊 Diagrama de Flujo Completo

```
┌─────────────────────────────────────────────────────┐
│                   USUARIO ENVÍA MENSAJE              │
└──────────────────────┬──────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────┐
│              ¿Dentro de horario atención?           │
├──────────────────────┬──────────────────────────────┤
│         NO           │           SÍ                 │
↓                      ↓                              
[Mensaje fuera]    [Continuar]
[de horario]           ↓
                ┌──────────────────┐
                │ Obtener sesión   │
                └────────┬─────────┘
                         ↓
                ┌──────────────────────────┐
                │ ¿Cuál es el estado?      │
                └────────┬─────────────────┘
                         ↓
        ┌────────────────┼────────────────┐
        ↓                ↓                ↓
  [MENU_PRINCIPAL] [RESERVA_*]  [OTROS_ESTADOS]
        ↓                ↓                ↓
  [Mostrar menú]  [Procesar]     [Procesar]
        ↓                ↓                ↓
  [Cambiar         [Validar]       [Validar]
   estado]              ↓                ↓
                  [¿Válido?]       [¿Válido?]
                  ↓        ↓       ↓        ↓
              [SÍ]      [NO]   [SÍ]      [NO]
                ↓          ↓     ↓          ↓
          [Siguiente] [Repetir] [Enviar] [Error]
          [estado]    [mensaje] [dato]   [Repetir]
                ↓          ↓     ↓          ↓
          [Guardar]        └─────┴──────────┘
          [datos]                 ↓
                ↓            [Actualizar]
                └────────────[sesión]───────┘
                                  ↓
                          [Enviar respuesta]
                                  ↓
                          [FIN DEL CICLO]
```

---

## 🚀 Optimizaciones para Railway

### Consumo Mínimo de Recursos

1. **Logger en modo silencioso**
   ```javascript
   const logger = pino({ level: 'silent' });
   ```

2. **Sin historial completo**
   ```javascript
   syncFullHistory: false
   ```

3. **Sin marcar online automáticamente**
   ```javascript
   markOnlineOnConnect: false
   ```

4. **Sesiones en memoria (sin DB)**
   - No requiere base de datos externa
   - Reduce latencia y costos

5. **Limpieza automática de sesiones**
   - Elimina sesiones inactivas cada 5 minutos
   - Libera memoria automáticamente

### Variables de Entorno en Railway

Configurar en el panel de Railway:
- `PORT` - Puerto del servidor
- `UBICACION_GUEMES` - URL de Google Maps
- `UBICACION_CERRO` - URL de Google Maps
- `MENSAJE_QR_LISTAS` - Mensaje personalizado
- `MENSAJE_FUERA_HORARIO` - Mensaje personalizado

---

## 🔒 Seguridad

### Datos Sensibles
- Credenciales de WhatsApp en `auth_info_baileys/` (no subir a Git)
- Variables de entorno en `.env` (no subir a Git)

### Validaciones
- Todas las entradas del usuario son validadas
- Formato de fechas verificado
- Números de teléfono sanitizados
- Usuarios de Instagram validados

### Límites
- Timeout de sesión configurable (30 min por defecto)
- Timeout de mensajes de Baileys (60 segundos)

---

## 🧪 Testing Manual

### Flujo de Reserva
1. Enviar cualquier mensaje → Debe mostrar menú
2. Enviar "1" → Debe pedir sede
3. Enviar "1" → Debe pedir fecha
4. Enviar fecha inválida → Debe rechazar
5. Enviar fecha válida → Debe pedir horario
6. Continuar flujo hasta confirmación
7. Verificar que todos los datos estén correctos

### Flujo de Cumpleaños
1. Enviar "2" → Debe mostrar combos e imágenes
2. Debe preguntar si le interesa
3. Continuar con flujo de reserva

### Flujo de Dirección
1. Enviar "3" → Debe pedir sede
2. Enviar "1" o "2" → Debe enviar ubicación

### Flujo de Carta
1. Enviar "4" → Debe pedir tipo de carta
2. Enviar "1" o "2" → Debe enviar PDF

### Fuera de Horario
1. Cambiar hora del sistema a fuera de horario
2. Enviar mensaje → Debe responder con mensaje automático

---

## 📈 Escalabilidad Futura

### Base de Datos
Para agregar persistencia de reservas:
1. Instalar SQLite/PostgreSQL
2. Crear tabla de reservas
3. Modificar `flows.js` para guardar en DB
4. Agregar endpoint de consulta de reservas

### Notificaciones
Para enviar confirmaciones a un número específico:
1. Agregar variable `NUMERO_ADMIN` en `.env`
2. En `flows.js`, al confirmar reserva, enviar copia al admin

### Analytics
Para registrar métricas:
1. Agregar logger con archivos
2. Registrar eventos importantes
3. Crear dashboard de métricas

### Multi-idioma
Para soportar múltiples idiomas:
1. Crear `config/messages.es.js` y `config/messages.en.js`
2. Detectar idioma del usuario
3. Cargar mensajes correspondientes

---

## 🛠️ Mantenimiento

### Actualizar Baileys
```bash
npm update @whiskeysockets/baileys
```

### Limpiar sesión de WhatsApp
```bash
rm -rf auth_info_baileys/
```

### Ver logs en Railway
```bash
railway logs
```

### Backup de configuración
```bash
cp .env .env.backup
cp -r auth_info_baileys/ auth_backup/
```

---

## 📚 Recursos y Referencias

- **Baileys Documentation:** https://whiskeysockets.github.io/Baileys/
- **Baileys GitHub:** https://github.com/WhiskeySockets/Baileys
- **Express.js:** https://expressjs.com/
- **Moment.js Timezone:** https://momentjs.com/timezone/
- **Railway Deployment:** https://docs.railway.app/

---

**Versión:** 1.0.0  
**Fecha:** Noviembre 2024  
**Autor:** Desarrollado para Bottom Resto Bar

