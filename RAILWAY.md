# Configuración para Railway

Este documento describe cómo configurar el bot en Railway.

## Variables de Entorno Requeridas

En el dashboard de Railway, ve a tu proyecto y agrega estas variables:

```
PORT=8080
NODE_ENV=production
```

## Variables de Entorno Opcionales

```
UBICACION_GUEMES=https://maps.google.com/?q=tu_ubicacion_guemes
UBICACION_CERRO=https://maps.google.com/?q=tu_ubicacion_cerro
```

## Configuración de Volumen (IMPORTANTE)

**⚠️ CRÍTICO:** Railway borra los datos en cada despliegue. Para mantener la sesión de WhatsApp, necesitas configurar un volumen persistente:

1. En tu proyecto de Railway, ve a la pestaña **"Settings"**
2. Busca la sección **"Volumes"**
3. Crea un nuevo volumen con:
   - **Mount Path**: `/app/auth_info_baileys`
   - **Size**: 1 GB es suficiente

Sin esto, tendrás que escanear el QR en cada despliegue.

## Solución de Problemas

### El bot se desconecta constantemente

1. Asegúrate de que el volumen persistente esté configurado correctamente
2. Verifica que no haya múltiples instancias del bot corriendo (puede causar conflictos)
3. Revisa los logs en Railway para ver errores específicos

### Error "Stream Errored (restart required)"

Este error es normal durante las reconexiones. El bot debería reconectarse automáticamente. Si persiste:

1. Borra el volumen de `auth_info_baileys` en Railway
2. Escanea el QR nuevamente
3. Asegúrate de que solo hay una instancia activa

### No se genera el QR

1. Verifica que el puerto esté configurado correctamente (Railway asigna automáticamente)
2. Revisa los logs para ver si hay errores de inicio
3. Asegúrate de que no haya sesión anterior guardada (borra el volumen si es necesario)

## Comandos Útiles

Para reiniciar el bot manualmente en Railway:
- Ve a tu proyecto
- Click en los tres puntos (...)
- Selecciona "Restart"

## Notas Importantes

- Railway reinicia el servicio automáticamente si hay errores
- Las reconexiones son normales y automáticas
- El primer despliegue puede tardar más tiempo
- Mantén solo una instancia activa para evitar conflictos

