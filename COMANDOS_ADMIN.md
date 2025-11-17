# 🔐 Comandos de Administración - Bottom Chatbot

Este documento explica cómo usar los comandos administrativos del bot de WhatsApp.

## 📋 Índice

- [Configuración Inicial](#configuración-inicial)
- [Autenticación](#autenticación)
- [Comandos Disponibles](#comandos-disponibles)
- [Ejemplos de Uso](#ejemplos-de-uso)
- [Seguridad](#seguridad)

---

## 🔧 Configuración Inicial

### Variables de Entorno

Configura las siguientes variables en tu archivo `.env` o en Railway:

```env
# Contraseña de administración (obligatorio para producción)
ADMIN_PASSWORD=tu_contraseña_segura_aqui

# Números autorizados (opcional, separados por comas, sin @s.whatsapp.net)
ADMIN_NUMBERS=5493512345678,5493519876543
```

**⚠️ IMPORTANTE:** 
- Cambia `ADMIN_PASSWORD` por una contraseña segura antes de usar en producción
- Si defines `ADMIN_NUMBERS`, solo esos números podrán usar comandos de admin
- Si no defines `ADMIN_NUMBERS`, cualquiera con la contraseña podrá acceder

---

## 🔐 Autenticación

### Iniciar Sesión

Primero debes autenticarte enviando:

```
/admin tu_contraseña
```

**Ejemplo:**
```
/admin admin123
```

Si la autenticación es exitosa, verás:
```
✅ Autenticación exitosa

Ahora tienes acceso a los comandos de administración.

Escribe /ayuda para ver los comandos disponibles.
```

### Cerrar Sesión

Para cerrar tu sesión de administrador:

```
/cerrar_sesion
```

**Nota:** Las sesiones expiran automáticamente después de 30 minutos de inactividad.

---

## 📋 Comandos Disponibles

### 🤖 Control del Bot

#### `/pausar [mensaje]`
Pausa el bot temporalmente. Los usuarios verán un mensaje personalizado.

**Ejemplos:**
```
/pausar
```
Mensaje por defecto: "Bot en mantenimiento"

```
/pausar 🔧 Estamos actualizando el sistema. Volvemos en 1 hora.
```
Mensaje personalizado.

#### `/activar` o `/reanudar`
Reactiva el bot después de estar pausado.

```
/activar
```

#### `/estado` o `/status`
Muestra el estado actual del bot.

```
/estado
```

Respuesta:
```
🤖 ESTADO DEL BOT

Estado general: ✅ Activo
Sesiones activas: 5
Fecha de hoy: 17/11

⚠️ Fecha especial activa:
¡Feliz Navidad! 🎄 Hoy estamos cerrados.
```

---

### 📅 Fechas Especiales

Las fechas especiales permiten configurar mensajes automáticos para días específicos (Navidad, Año Nuevo, etc.).

#### `/fecha_especial <DD/MM> <mensaje>`
Configura un mensaje especial para una fecha.

**Ejemplos:**
```
/fecha_especial 25/12 🎄 ¡Feliz Navidad! Hoy estamos cerrados. Abrimos el 26/12.
```

```
/fecha_especial 01/01 🎊 ¡Feliz Año Nuevo! Reservas abiertas desde el 02/01.
```

```
/fecha_especial 14/02 💖 ¡San Valentín! Reserva tu mesa romántica hoy mismo.
```

#### `/ver_fechas` o `/fechas`
Lista todas las fechas especiales configuradas.

```
/ver_fechas
```

Respuesta:
```
📅 FECHAS ESPECIALES CONFIGURADAS

25/12
🎄 ¡Feliz Navidad! Hoy estamos cerrados.

01/01
🎊 ¡Feliz Año Nuevo! Reservas desde el 02/01.

Usa /eliminar_fecha <DD/MM> para eliminar una fecha
```

#### `/eliminar_fecha <DD/MM>`
Elimina una fecha especial configurada.

**Ejemplo:**
```
/eliminar_fecha 25/12
```

---

### 📊 Estadísticas

#### `/estadisticas` o `/stats`
Muestra estadísticas detalladas del bot.

```
/estadisticas
```

Respuesta:
```
📊 ESTADÍSTICAS DEL BOT

Tiempo activo: 48h 32m
Sesiones activas: 12
Mensajes recibidos: 1,247
Reservas completadas: 89

Estado: ✅ Activo
Fechas especiales: 3
Admins conectados: 1

Estadísticas desde: 15/11/2025 10:30
```

#### `/reiniciar_stats`
Reinicia todos los contadores de estadísticas a cero.

```
/reiniciar_stats
```

⚠️ **Advertencia:** Esta acción no se puede deshacer.

---

### 🔧 Gestión

#### `/limpiar_sesiones`
Limpia todas las sesiones de usuario activas. Útil para liberar memoria.

```
/limpiar_sesiones
```

Los usuarios deberán empezar desde el menú principal en su próxima interacción.

#### `/broadcast <mensaje>`
Envía un mensaje a todos los usuarios con sesiones activas.

```
/broadcast 🎉 ¡Nueva promoción! 2x1 en bebidas todos los jueves.
```

**Nota:** Esta función está en desarrollo y actualmente solo muestra una confirmación.

---

### 📚 Ayuda

#### `/ayuda` o `/help`
Muestra la lista completa de comandos disponibles.

```
/ayuda
```

---

## 💡 Ejemplos de Uso

### Caso 1: Cerrado por Mantenimiento

Necesitas cerrar el local por mantenimiento:

```
1. /admin tu_contraseña
2. /pausar 🔧 Estamos en mantenimiento. Volvemos mañana a las 18:00.
```

Todos los mensajes que lleguen mostrarán ese mensaje.

Cuando termines:
```
3. /activar
```

---

### Caso 2: Navidad

Configura mensajes especiales para fechas importantes:

```
1. /admin tu_contraseña
2. /fecha_especial 24/12 🎄 ¡Feliz Nochebuena! Reservas disponibles. Menú especial navideño.
3. /fecha_especial 25/12 🎄 ¡Feliz Navidad! Hoy estamos cerrados. Te esperamos el 26/12.
4. /fecha_especial 31/12 🎊 ¡Fin de Año! Reserva tu mesa para la cena especial.
```

Los mensajes se mostrarán automáticamente en esas fechas.

---

### Caso 3: Monitoreo

Revisa el estado y estadísticas del bot:

```
1. /admin tu_contraseña
2. /estado
3. /estadisticas
4. /ver_fechas
```

---

### Caso 4: Limpieza de Fin de Mes

Al final del mes, reinicia estadísticas y limpia sesiones:

```
1. /admin tu_contraseña
2. /estadisticas  (guardar datos si es necesario)
3. /reiniciar_stats
4. /limpiar_sesiones
```

---

## 🔒 Seguridad

### Mejores Prácticas

1. **Contraseña Segura**
   - No uses contraseñas obvias como "admin123"
   - Usa combinación de letras, números y símbolos
   - Mínimo 12 caracteres

2. **Números Autorizados**
   - Define `ADMIN_NUMBERS` en producción
   - Solo incluye números de confianza
   - Formato: sin espacios, sin guiones, sin @ (ej: `5493512345678`)

3. **Sesiones**
   - Cierra sesión cuando termines: `/cerrar_sesion`
   - Las sesiones expiran automáticamente en 30 minutos

4. **Comandos Sensibles**
   - `/pausar` - Úsalo solo cuando sea necesario
   - `/reiniciar_stats` - No se puede deshacer
   - `/limpiar_sesiones` - Los usuarios perderán su progreso

### Configuración Recomendada para Producción

En Railway o tu servidor, configura:

```env
# Contraseña segura (ejemplo)
ADMIN_PASSWORD=B0tt0m#Adm1n$2025!Secure

# Solo números autorizados (administradores del local)
ADMIN_NUMBERS=5493512345678,5493519876543
```

---

## ❓ Preguntas Frecuentes

### ¿Puedo tener múltiples administradores?

Sí, define varios números en `ADMIN_NUMBERS`:
```env
ADMIN_NUMBERS=5493512345678,5493519876543,5493511111111
```

### ¿Qué pasa si olvido la contraseña?

Debes cambiarla en las variables de entorno de Railway o en tu archivo `.env` local.

### ¿Los comandos son case-sensitive?

No, puedes escribir `/PAUSAR`, `/pausar` o `/Pausar` y funcionará igual.

### ¿Las fechas especiales se activan automáticamente?

Sí, el bot verifica la fecha actual y muestra el mensaje configurado automáticamente.

### ¿Qué pasa si el bot está pausado y hay una fecha especial?

El bot pausado tiene prioridad. Los usuarios verán el mensaje de pausa, no el de fecha especial.

### ¿Cómo pruebo los comandos sin afectar producción?

Ejecuta el bot en local y usa tu número personal para probar todos los comandos.

---

## 🆘 Soporte

Si tienes problemas con los comandos:

1. Verifica que estés autenticado: `/admin contraseña`
2. Revisa los logs del servidor en Railway
3. Consulta este documento
4. Verifica las variables de entorno

---

## 📝 Notas Adicionales

- Los comandos solo funcionan en chats privados (no en grupos)
- Los mensajes de admin no se cuentan en las estadísticas
- Las fechas especiales usan formato DD/MM (día/mes)
- El bot continúa funcionando incluso si cierras la sesión de admin

---

**Última actualización:** Noviembre 2025  
**Versión del bot:** 1.0.0

