# 📋 Changelog - Sistema de Comandos Administrativos

## 🎉 Versión 1.1.0 - Comandos Administrativos

### ✨ Nuevas Características

#### 🔐 Sistema de Autenticación
- Sistema de autenticación por contraseña para acceder a comandos de admin
- Opción de restringir acceso solo a números autorizados
- Sesiones temporales con expiración automática (30 minutos)
- Comando `/cerrar_sesion` para cerrar sesión manualmente

#### 🤖 Control del Bot
- **`/pausar [mensaje]`** - Pausar el bot con mensaje personalizado
- **`/activar`** - Reactivar el bot
- **`/estado`** - Ver estado actual del bot (activo/pausado, sesiones, etc.)

#### 📅 Fechas Especiales
- **`/fecha_especial <DD/MM> <mensaje>`** - Configurar mensajes automáticos para fechas específicas
- **`/ver_fechas`** - Listar todas las fechas especiales configuradas
- **`/eliminar_fecha <DD/MM>`** - Eliminar una fecha especial
- Detección automática de fechas especiales (ej: Navidad, Año Nuevo)
- Los usuarios ven automáticamente el mensaje configurado en esa fecha

#### 📊 Estadísticas en Tiempo Real
- Contador de mensajes recibidos
- Contador de reservas completadas
- Número de sesiones activas
- Tiempo de actividad del bot
- Número de administradores conectados
- Número de fechas especiales configuradas

#### 🔧 Gestión y Mantenimiento
- **`/limpiar_sesiones`** - Limpiar todas las sesiones activas
- **`/reiniciar_stats`** - Reiniciar contadores de estadísticas
- **`/broadcast <mensaje>`** - Preparar mensaje para difusión masiva (en desarrollo)
- **`/ayuda`** - Ver lista completa de comandos disponibles

### 📁 Archivos Nuevos

1. **`config/admin.js`**
   - Configuración de administración
   - Estado global del bot
   - Gestión de sesiones de admin

2. **`src/admin.js`**
   - Lógica de comandos administrativos
   - Sistema de autenticación
   - Procesamiento de comandos
   - Funciones de estadísticas

3. **`COMANDOS_ADMIN.md`**
   - Documentación completa de comandos
   - Ejemplos de uso detallados
   - Guía de seguridad
   - Preguntas frecuentes

4. **`INICIO_RAPIDO_ADMIN.md`**
   - Guía rápida de inicio en 5 minutos
   - Comandos más usados
   - Checklist de configuración

5. **`configuracion.ejemplo.txt`**
   - Plantilla de variables de entorno
   - Incluye nuevas variables de administración

### 🔄 Archivos Modificados

1. **`src/bot.js`**
   - Importación del módulo de administración
   - Detección de comandos administrativos
   - Verificación de bot pausado
   - Verificación de fechas especiales
   - Incremento de estadísticas de mensajes

2. **`src/flows.js`**
   - Importación del módulo de administración
   - Incremento de estadísticas de reservas completadas

3. **`README.md`**
   - Nuevas características en la lista principal
   - Sección completa de comandos de administración
   - Ejemplos de uso rápido
   - Estructura de archivos actualizada

### 🔐 Variables de Entorno Nuevas

```env
# Contraseña para comandos de administración
ADMIN_PASSWORD=admin123

# Números autorizados (opcional)
ADMIN_NUMBERS=5493512345678,5493519876543
```

### 🎯 Casos de Uso

#### Caso 1: Mantenimiento Programado
```
/admin contraseña
/pausar 🔧 Sistema en mantenimiento. Volvemos a las 18:00.
```

#### Caso 2: Configurar Fechas Festivas
```
/admin contraseña
/fecha_especial 25/12 🎄 ¡Feliz Navidad! Hoy estamos cerrados.
/fecha_especial 31/12 🎊 ¡Fin de Año! Menú especial disponible.
```

#### Caso 3: Monitoreo Regular
```
/admin contraseña
/estado
/estadisticas
```

### 🔒 Seguridad

- ✅ Sistema de autenticación por contraseña
- ✅ Opción de lista blanca de números autorizados
- ✅ Sesiones con expiración automática
- ✅ Comandos solo en chats privados (no grupos)
- ✅ Contraseña configurable vía variables de entorno

### 📊 Métricas Rastreadas

- Mensajes recibidos totales
- Reservas completadas exitosamente
- Sesiones de usuario activas
- Tiempo de actividad del bot
- Administradores conectados
- Fechas especiales configuradas

### 🚀 Prioridad de Respuestas

El bot ahora procesa mensajes en este orden:

1. **Comandos de Admin** - Procesados primero
2. **Bot Pausado** - Si está pausado, muestra mensaje de pausa
3. **Fecha Especial** - Si hay fecha especial, muestra mensaje especial
4. **Fuera de Horario** - Si está fuera de horario, muestra mensaje de horario
5. **Flujo Normal** - Procesa el flujo conversacional normal

### 📝 Comandos Disponibles

#### Control
- `/admin <contraseña>` - Autenticarse
- `/pausar [mensaje]` - Pausar bot
- `/activar` - Activar bot
- `/estado` - Ver estado

#### Fechas
- `/fecha_especial <DD/MM> <mensaje>` - Configurar fecha
- `/ver_fechas` - Ver fechas
- `/eliminar_fecha <DD/MM>` - Eliminar fecha

#### Estadísticas
- `/estadisticas` - Ver estadísticas
- `/reiniciar_stats` - Reiniciar estadísticas

#### Gestión
- `/limpiar_sesiones` - Limpiar sesiones
- `/broadcast <mensaje>` - Difusión (próximamente)
- `/ayuda` - Ver ayuda
- `/cerrar_sesion` - Cerrar sesión admin

### 🐛 Correcciones

- ✅ El bot no procesa comandos de admin como mensajes normales
- ✅ Las estadísticas se incrementan correctamente
- ✅ Las sesiones de admin expiran automáticamente
- ✅ Los comandos solo funcionan en chats privados

### 📚 Documentación

- ✅ README actualizado con nueva sección de comandos
- ✅ Documentación completa en COMANDOS_ADMIN.md
- ✅ Guía de inicio rápido en INICIO_RAPIDO_ADMIN.md
- ✅ Ejemplos de configuración en configuracion.ejemplo.txt

### ⚠️ Notas Importantes

1. **Cambia la contraseña por defecto** antes de usar en producción
2. Las estadísticas se resetean al reiniciar el bot (en memoria)
3. Las fechas especiales se pierden al reiniciar el bot (en memoria)
4. Los comandos solo funcionan en chats privados, no en grupos
5. Las sesiones de admin expiran después de 30 minutos de inactividad

### 🔮 Próximas Mejoras (Futuras)

- [ ] Persistencia de estadísticas en base de datos
- [ ] Persistencia de fechas especiales en archivo JSON
- [ ] Comando `/broadcast` completamente funcional
- [ ] Comando `/backup` para exportar configuración
- [ ] Comando `/usuarios_activos` para ver lista de usuarios
- [ ] Dashboard web para administración visual
- [ ] Notificaciones push para eventos importantes
- [ ] Logs de comandos ejecutados

---

**Fecha de implementación:** Noviembre 2025  
**Autor:** Asistente de IA  
**Versión:** 1.1.0

