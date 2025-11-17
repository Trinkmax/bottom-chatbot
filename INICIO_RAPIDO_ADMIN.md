# 🚀 Inicio Rápido - Comandos de Administración

Esta guía te ayudará a comenzar a usar los comandos administrativos del bot en 5 minutos.

## 📝 Paso 1: Configurar Contraseña

### En Railway (Producción)

1. Ve a tu proyecto en Railway
2. Haz clic en "Variables"
3. Agrega una nueva variable:
   - **Nombre:** `ADMIN_PASSWORD`
   - **Valor:** Tu contraseña segura (ej: `Bottom@Admin2025`)

### En Local (.env)

Crea o edita tu archivo `.env`:

```env
ADMIN_PASSWORD=tu_contraseña_segura
```

**⚠️ IMPORTANTE:** No uses `admin123` en producción.

## 🔐 Paso 2: Autenticarte

Abre WhatsApp y envía al bot:

```
/admin tu_contraseña
```

**Ejemplo:**
```
/admin Bottom@Admin2025
```

Si sale bien, verás:
```
✅ Autenticación exitosa

Ahora tienes acceso a los comandos de administración.

Escribe /ayuda para ver los comandos disponibles.
```

## 🎯 Paso 3: Usa los Comandos

### Ver comandos disponibles
```
/ayuda
```

### Ver estado del bot
```
/estado
```

### Pausar el bot
```
/pausar El bot está en mantenimiento. Volvemos pronto.
```

### Reactivar el bot
```
/activar
```

### Configurar Navidad
```
/fecha_especial 25/12 🎄 ¡Feliz Navidad! Hoy estamos cerrados.
```

### Ver estadísticas
```
/estadisticas
```

## 📅 Comandos Más Usados

### Para Fechas Especiales

**Navidad:**
```
/fecha_especial 24/12 🎄 ¡Nochebuena! Menú especial disponible.
/fecha_especial 25/12 🎄 ¡Feliz Navidad! Hoy estamos cerrados.
```

**Año Nuevo:**
```
/fecha_especial 31/12 🎊 ¡Fin de Año! Reservá tu mesa para la cena especial.
/fecha_especial 01/01 🎊 ¡Feliz Año Nuevo! Abrimos desde las 18:00.
```

**San Valentín:**
```
/fecha_especial 14/02 💖 ¡San Valentín! Menú romántico especial.
```

### Para Mantenimiento

**Cerrar por mantenimiento:**
```
/pausar 🔧 Mantenimiento del sistema. Volvemos en 2 horas. Gracias por tu paciencia.
```

**Reabrir:**
```
/activar
```

### Para Monitoreo

**Ver estado:**
```
/estado
```

**Ver estadísticas:**
```
/estadisticas
```

**Ver fechas configuradas:**
```
/ver_fechas
```

## 🔒 Seguridad Adicional (Opcional)

Si quieres que **solo ciertos números** puedan usar comandos de admin:

1. En Railway, agrega la variable `ADMIN_NUMBERS`
2. Usa formato: `5493512345678,5493519876543` (sin espacios, sin @)

```env
ADMIN_NUMBERS=5493512345678,5493519876543
```

Así solo esos números podrán acceder, incluso con la contraseña correcta.

## ❓ Problemas Comunes

### "No autorizado"
- Verifica que escribiste bien la contraseña
- Si configuraste `ADMIN_NUMBERS`, verifica que tu número esté en la lista

### "Comando no reconocido"
- Los comandos empiezan con `/` (ej: `/ayuda`)
- Primero debes autenticarte con `/admin contraseña`

### "La sesión expiró"
- Las sesiones expiran después de 30 minutos
- Vuelve a autenticarte con `/admin contraseña`

## 📖 Documentación Completa

Para ver todos los comandos y ejemplos detallados:
👉 [COMANDOS_ADMIN.md](./COMANDOS_ADMIN.md)

## 💡 Tips

1. **Guarda tu contraseña segura** - No la compartas
2. **Cierra sesión cuando termines** - Usa `/cerrar_sesion`
3. **Configura fechas especiales con anticipación** - Navidad, Año Nuevo, etc.
4. **Revisa estadísticas regularmente** - Usa `/estadisticas`
5. **Usa `/estado` antes de pausar** - Para ver cuántos usuarios hay activos

## ✅ Checklist de Configuración

- [ ] Configuré `ADMIN_PASSWORD` en Railway/local
- [ ] (Opcional) Configuré `ADMIN_NUMBERS` para mayor seguridad
- [ ] Me autentiqué correctamente con `/admin`
- [ ] Probé los comandos básicos (`/estado`, `/ayuda`)
- [ ] Configuré fechas especiales importantes
- [ ] Leí la documentación completa en `COMANDOS_ADMIN.md`

---

¡Listo! Ya puedes controlar tu bot remotamente desde WhatsApp 🎉

