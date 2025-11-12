# 🚂 Guía de Despliegue en Railway

## Cambios Realizados

Se han implementado las siguientes mejoras para solucionar el error "Stream Errored" y otros problemas en Railway:

### 1. **Polyfill de Crypto** (`index.js`)
- Agregado polyfill para el módulo `crypto` que faltaba en el entorno de Railway
- Soluciona el error: `ReferenceError: crypto is not defined`

### 2. **Configuración de Baileys Optimizada** (`config/settings.js`)
- Timeouts eliminados (`undefined`) para evitar cortes en Railway
- Keep-alive más frecuente (10 segundos)
- Queries de inicialización desactivadas
- Transacciones con más reintentos
- Configuración específica para producción

### 3. **Manejo Robusto de Reconexiones** (`src/bot.js`)
- Limpieza de listeners antes de reconectar
- Delays más largos entre reconexiones (5 segundos)
- Mejor logging de errores
- Prevención de múltiples interval timers

### 4. **Servidor Optimizado para Railway** (`server.js`)
- Binding a `0.0.0.0` en Railway (necesario)
- Timeouts de keep-alive extendidos (120 segundos)
- Headers timeout configurado
- Mejor manejo de errores de puerto

### 5. **Archivos de Configuración Railway**
- `railway.json`: Configuración de build y deploy
- `.railwayignore`: Archivos a excluir del despliegue
- `RAILWAY.md`: Documentación específica para Railway

---

## 📋 Pasos para Desplegar

### Paso 1: Hacer Commit y Push

```bash
git add .
git commit -m "Fix: Solucionado error de conexión en Railway con crypto polyfill y configuración optimizada"
git push origin main
```

### Paso 2: Configurar Volumen Persistente en Railway (CRÍTICO)

**⚠️ IMPORTANTE:** Sin esto, tendrás que escanear el QR en cada despliegue.

1. Ve a tu proyecto en Railway
2. Haz click en tu servicio
3. Ve a la pestaña **"Settings"**
4. Scroll hasta **"Volumes"**
5. Click en **"+ New Volume"**
6. Configura:
   ```
   Mount Path: /app/auth_info_baileys
   Size: 1 GB
   ```
7. Click en **"Add"**

### Paso 3: Configurar Variables de Entorno (Opcional)

En la pestaña **"Variables"** de Railway, agrega:

```
PORT=8080
NODE_ENV=production
```

Variables opcionales para ubicaciones:
```
UBICACION_GUEMES=https://maps.google.com/?q=tu_direccion
UBICACION_CERRO=https://maps.google.com/?q=tu_direccion
```

### Paso 4: Esperar el Despliegue

Railway automáticamente:
1. Detectará los cambios en GitHub
2. Iniciará un nuevo build
3. Desplegará el bot

Monitorea los logs en Railway.

### Paso 5: Conectar WhatsApp

1. Una vez desplegado, abre la URL de Railway (la encontrarás en el dashboard)
2. Verás la página con el código QR
3. Abre WhatsApp en tu teléfono
4. Ve a **Configuración > Dispositivos vinculados**
5. Escanea el código QR
6. ¡Listo! El bot debería conectarse

---

## 🔍 Solución de Problemas

### Error: "Stream Errored (restart required)"

**Es NORMAL** ver este error ocasionalmente. El bot se reconectará automáticamente. Si se repite constantemente:

1. **Verifica el volumen persistente:**
   - Debe estar montado en `/app/auth_info_baileys`
   - Si no existe, créalo (ver Paso 2)

2. **Revisa instancias duplicadas:**
   - Solo debe haber UNA instancia del bot activa
   - Si tienes múltiples despliegues, pausa los que no uses

3. **Borra la sesión y reconecta:**
   - En Railway, ve a tu servicio
   - Click en los 3 puntos (...) > Restart
   - O borra el contenido del volumen y escanea de nuevo el QR

### No se genera el código QR

1. Revisa los logs en Railway para ver errores específicos
2. Verifica que el servidor esté escuchando en el puerto correcto
3. Asegúrate de que la URL de Railway sea accesible
4. Puede tomar 30-60 segundos después del despliegue

### El bot se desconecta después de escanear el QR

Este era el problema original. Con los cambios realizados:

1. El bot ahora tiene timeouts más largos
2. Keep-alive más frecuente para mantener la conexión
3. Reconexión automática más robusta

Si persiste:
- Verifica que el volumen persistente esté montado
- Revisa que solo haya una instancia activa
- Chequea los logs por errores específicos

### Error de Puerto (EADDRINUSE)

Railway asigna el puerto automáticamente. Si ves este error:
1. No configures manualmente el puerto
2. Usa la variable `PORT` que Railway proporciona (ya configurado)
3. Reinicia el servicio

---

## 📊 Monitoreo

### Logs Importantes a Observar

✅ **Logs normales (todo bien):**
```
🚀 Iniciando Bottom Chatbot...
📡 Iniciando servidor web...
✅ Servidor web iniciado
🤖 Conectando bot de WhatsApp...
📱 Usando Baileys versión: 2.3000.xxx
🤖 Bot iniciado correctamente
✨ Bottom Chatbot está funcionando correctamente
📱 Para conectar WhatsApp, accede a: https://tu-app.railway.app
📲 Nuevo código QR generado
✅ Conexión establecida con WhatsApp
```

⚠️ **Logs de reconexión (normales ocasionalmente):**
```
❌ Conexión cerrada. Status: 515
🔄 Reconectando en 5 segundos...
🔄 Iniciando reconexión...
🔄 Conectando...
✅ Conexión establecida con WhatsApp
```

❌ **Logs problemáticos:**
```
❌ Error fatal al iniciar la aplicación
ReferenceError: crypto is not defined
EADDRINUSE: address already in use
```

---

## 🎯 Checklist Final

Antes de reportar problemas, verifica:

- [ ] Commit y push realizados
- [ ] Volumen persistente configurado en `/app/auth_info_baileys`
- [ ] Solo una instancia del bot activa
- [ ] Variables de entorno configuradas (PORT y NODE_ENV)
- [ ] Logs revisados en Railway
- [ ] URL de Railway accesible en el navegador
- [ ] WhatsApp Web disponible en tu teléfono

---

## 📞 Soporte Adicional

Si después de seguir todos estos pasos el problema persiste:

1. Copia los logs completos de Railway
2. Verifica la configuración del volumen
3. Intenta con una sesión nueva (borra el volumen y escanea de nuevo)
4. Revisa que tu cuenta de Railway no tenga límites alcanzados

---

## 🔄 Actualizar el Bot en el Futuro

Para futuras actualizaciones:

```bash
git add .
git commit -m "Descripción de los cambios"
git push origin main
```

Railway automáticamente desplegará los cambios. La sesión de WhatsApp se mantendrá gracias al volumen persistente.

