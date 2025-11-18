# 📆 Guía de Gestión de Fechas y Días Permitidos

## 🎯 Resumen

Esta guía explica cómo controlar qué días y fechas están disponibles para reservas usando los comandos administrativos.

## 📋 Dos Tipos de Configuración

### 1. **Días de la Semana** (Regla General)
Configura qué días de la semana están permitidos de forma general.
- **Ejemplo:** Solo jueves, viernes y sábado

### 2. **Fechas Específicas** (Excepciones)
Permite reservas para fechas específicas, incluso si normalmente ese día no está permitido.
- **Ejemplo:** Permitir el domingo 23/11 aunque los domingos normalmente no están habilitados

---

## 🔢 Días de la Semana

Los días se representan con números:
- **0** = Domingo
- **1** = Lunes
- **2** = Martes
- **3** = Miércoles
- **4** = Jueves
- **5** = Viernes
- **6** = Sábado

---

## 📅 Comandos de Fechas Específicas

### Ver Fechas Habilitadas

```
/ver_fechas_permitidas
```

**Respuesta:**
```
📆 FECHAS ESPECÍFICAS HABILITADAS

Estas fechas están permitidas para reservas:

• 23/11

Usa /quitar_fecha <DD/MM> para deshabilitar una fecha
```

### Agregar una Fecha

**Sintaxis:**
```
/agregar_fecha <DD/MM>
```

**Ejemplos:**

Habilitar el domingo 23 de noviembre:
```
/agregar_fecha 23/11
```

Habilitar el 25 de diciembre (Navidad):
```
/agregar_fecha 25/12
```

Habilitar el 1 de enero (Año Nuevo):
```
/agregar_fecha 01/01
```

**Resultado:**
```
✅ Fecha permitida agregada

Fecha: 23/11

Ahora los usuarios pueden reservar para esta fecha específica.
```

### Quitar una Fecha

**Sintaxis:**
```
/quitar_fecha <DD/MM>
```

**Ejemplo:**
```
/quitar_fecha 23/11
```

**Resultado:**
```
✅ Fecha quitada

La fecha 23/11 ya no está habilitada para reservas.
```

---

## 📆 Comandos de Días de la Semana

### Ver Días Configurados

```
/ver_dias
```

**Respuesta:**
```
📆 DÍAS PERMITIDOS PARA RESERVAS

Días de la semana: jueves, viernes, sábado

Fechas específicas adicionales: 1
(Usa /ver_fechas_permitidas para verlas)

Usa /configurar_dias para cambiar los días permitidos
```

### Configurar Días Permitidos

**Sintaxis:**
```
/configurar_dias <números separados por comas>
```

**Ejemplos:**

Solo jueves, viernes y sábado (configuración por defecto):
```
/configurar_dias 4,5,6
```

Agregar domingo (viernes, sábado, domingo):
```
/configurar_dias 5,6,0
```

Solo fines de semana (viernes, sábado, domingo):
```
/configurar_dias 5,6,0
```

Todos los días:
```
/configurar_dias 0,1,2,3,4,5,6
```

Solo viernes y sábado:
```
/configurar_dias 5,6
```

**Resultado:**
```
✅ Días permitidos actualizados

Días configurados: viernes, sábado, domingo

Ahora solo se aceptarán reservas para estos días de la semana.
```

---

## 💡 Casos de Uso

### Caso 1: Habilitar Solo un Domingo Específico

**Necesitas:** Permitir reservas solo para el domingo 23/11, pero mantener la regla general (solo jueves, viernes, sábado).

**Solución:**
```
1. /admin tu_contraseña
2. /agregar_fecha 23/11
```

Ahora:
- Jueves, viernes, sábado → Siempre permitidos
- 23/11 (domingo) → Permitido solo ese día
- Otros domingos → NO permitidos

---

### Caso 2: Agregar Domingos Permanentemente

**Necesitas:** Permitir reservas todos los viernes, sábados Y domingos.

**Solución:**
```
1. /admin tu_contraseña
2. /configurar_dias 5,6,0
```

Ahora todos los viernes, sábados y domingos están permitidos.

---

### Caso 3: Fecha Especial (Navidad)

**Necesitas:** El 25/12 es martes, pero quieres permitir reservas ese día.

**Solución:**
```
1. /admin tu_contraseña
2. /agregar_fecha 25/12
```

El 25/12 estará habilitado, aunque normalmente los martes no están permitidos.

---

### Caso 4: Evento Especial (Varios Días)

**Necesitas:** Evento especial del 10/12 al 12/12 (lunes, martes, miércoles).

**Solución:**
```
1. /admin tu_contraseña
2. /agregar_fecha 10/12
3. /agregar_fecha 11/12
4. /agregar_fecha 12/12
```

---

### Caso 5: Temporada Alta (Todos los Días)

**Necesitas:** En diciembre aceptar reservas todos los días.

**Solución:**
```
1. /admin tu_contraseña
2. /configurar_dias 0,1,2,3,4,5,6
```

En enero, volver a la configuración normal:
```
1. /admin tu_contraseña
2. /configurar_dias 4,5,6
```

---

## 🔄 Flujo de Trabajo Recomendado

### Para Tu Necesidad Actual (23/11)

```bash
# 1. Autenticarte
/admin tu_contraseña

# 2. Ver estado actual
/ver_dias
/ver_fechas_permitidas

# 3. Agregar el domingo 23/11
/agregar_fecha 23/11

# 4. Verificar que se agregó
/ver_fechas_permitidas

# 5. Probar haciendo una reserva para 23/11
```

### Para Gestión Regular

```bash
# Cada semana/mes, revisar:
/admin tu_contraseña
/ver_dias
/ver_fechas_permitidas

# Agregar fechas especiales según necesites:
/agregar_fecha <DD/MM>

# Limpiar fechas pasadas (opcional):
/quitar_fecha <DD/MM>
```

---

## ⚠️ Notas Importantes

1. **Prioridad:** Las fechas específicas tienen prioridad sobre las reglas de días de la semana.

2. **Formato:** Siempre usa DD/MM (ej: 23/11, no 23/11/2025)

3. **Persistencia:** 
   - ⚠️ Las configuraciones se pierden al reiniciar el bot
   - Necesitarás volver a configurarlas después de reiniciar

4. **Validación:** El bot valida que la fecha sea futura y válida (no 31/02).

5. **Compatibilidad:** Los comandos funcionan junto con las fechas especiales (`/fecha_especial`) que son para MENSAJES, no para permisos de reserva.

---

## 📊 Diferencia Entre Comandos

### `/fecha_especial` vs `/agregar_fecha`

| Comando | Propósito | Resultado |
|---------|-----------|-----------|
| `/fecha_especial 25/12 🎄 Cerrado` | Mostrar **mensaje** en esa fecha | El usuario ve el mensaje, NO puede reservar |
| `/agregar_fecha 25/12` | **Permitir reservas** en esa fecha | El usuario PUEDE reservar ese día |

**Puedes usar ambos juntos:**
```
/fecha_especial 25/12 🎄 Menú especial navideño disponible
/agregar_fecha 25/12
```
Resultado: El usuario ve el mensaje Y puede hacer reserva.

---

## 🆘 Solución de Problemas

### "La fecha seleccionada es domingo. Solo aceptamos reservas para..."

**Problema:** Intentaste reservar pero el día no está permitido.

**Solución:**
```
/admin tu_contraseña
/agregar_fecha <DD/MM>
```

### "No hay fechas específicas habilitadas"

**Normal:** Significa que solo funcionan los días de la semana configurados.

### Quiero quitar una fecha pero olvidé cuál agregué

```
/ver_fechas_permitidas
/quitar_fecha <DD/MM>
```

---

## ✅ Checklist de Implementación

Para habilitar el 23/11 ahora mismo:

- [ ] Autenticarte: `/admin tu_contraseña`
- [ ] Verificar estado: `/ver_fechas_permitidas`
- [ ] Agregar fecha: `/agregar_fecha 23/11`
- [ ] Confirmar: `/ver_fechas_permitidas`
- [ ] Probar reserva desde otro número para 23/11

---

**¡Listo!** Ahora puedes gestionar fechas y días permitidos fácilmente desde WhatsApp.

