# TierraMia Frontend - Plan de Implementación

> Documento generado: 2026-04-13
> Estado del proyecto: Backend COMPLETO, Frontend en desarrollo

---

## Resumen Ejecutivo

El backend está **100% completo** con todos los módulos implementados y 174 tests pasando. El frontend tiene una estructura base sólida pero requiere trabajo para completar el flujo de usuario comprador y mejorar las funcionalidades existentes.

---

## Estado Actual del Frontend

### ✅ Implementado

| Página/Componente | Estado | Descripción |
|-------------------|--------|-------------|
| `index.html` | ✅ Funcional | Home con hero, categorías, productos destacados |
| `catalogo.html` | ✅ Funcional | Lista de productos con filtros y paginación |
| `producto.html` | ✅ Funcional | Detalle de producto con reseñas |
| `categorias.html` | ✅ Funcional | Vista jerárquica de categorías |
| `login.html` | ✅ Funcional | Formulario de login |
| `registro.html` | ✅ Funcional | Formulario de registro con selector de rol |
| `carrito.html` | ✅ Funcional | UI completa con sincronización con backend |
| `checkout.html` | ✅ Funcional | Formulario de checkout con envío y pago |
| `pedido-confirmado.html` | ✅ Funcional | Confirmación de pedido creado |
| `admin.html` | ✅ Funcional | Panel admin con tabs (usuarios, productos, pedidos, categorías) |
| `vendedor.html` | ⚠️ Parcial | Dashboard vendedor, carga productos por userId |
| `mis-pedidos.html` | ✅ Funcional | Lista de pedidos con filtros por estado |
| `perfil.html` | ❌ Placeholder | Solo muestra mensaje "en desarrollo" |
| `mis-productos.html` | ❌ Placeholder | No existe aún |
| `js/api.js` | ✅ Funcional | Cliente API con todos los endpoints del backend |
| `js/store.js` | ✅ Funcional | Store con sincronización a backend |
| `js/app.js` | ✅ Funcional | Helpers de renderizado |
| `css/styles.css` | ✅ Funcional | Estilos de marca TierraMia |

---

## Problemas Identificados

### Críticos (Bloquean flujo de usuario) - ✅ RESUELTOS

1. ✅ **Carrito no sincroniza con backend** - RESUELTO: store.js ahora sincroniza con backend
2. ✅ **Checkout no implementado** - RESUELTO: checkout.html creado con formulario completo
3. ✅ **Mis Pedidos vacío** - RESUELTO: mis-pedidos.html muestra pedidos reales
4. ❌ **Mi Perfil vacío** - PENDIENTE
5. ✅ **Carrito local vs backend** - RESUELTO: Sync bidireccional implementado

### Importantes (Afectan UX)

1. ⚠️ **Header dinámico incompleto** - Parcialmente resuelto, dropdown básico existe
2. ✅ **Badge de carrito no actualiza** - RESUELTO: Header se actualiza al sincronizar
3. ✅ **Store local vs backend** - RESUELTO
4. ⚠️ **Vendedor dashboard** - Stats no cargan datos reales

### Menores (Mejoras)

1. ✅ **Toast notifications** - RESUELTO: showToast conectado en checkout
2. ✅ **Error handling inconsistente** - RESUELTO en páginas nuevas
3. ⚠️ **Responsive** - Verificar

---

## Plan de Implementación

### Fase 1: Core Flows (Críticos) - **Prioridad Alta**

#### 1.1 Sincronización Carrito-Backend
**Archivos a modificar:**
- `js/store.js` - Reemplazar almacenamiento local con llamadas a API
- `js/header.js` - Actualizar badge desde API
- `carrito.html` - Asegurar sincronización en tiempo real

**Cambios:**
```javascript
// store.js - Nuevo flujo
async syncWithBackend() {
  if (!api.isAuthenticated()) return;
  
  try {
    const serverCart = await api.getCart();
    if (serverCart.data?.items) {
      // Reemplazar carrito local con datos del servidor
      this.cart = serverCart.data.items.map(item => ({
        product: {
          id: item.productId,
          name: item.productName,
          price: item.unitPrice,
          mainImageUrl: item.productImageUrl
        },
        quantity: item.quantity,
        priceAtAddition: item.unitPrice
      }));
      this.saveCart();
    }
  } catch (error) {
    console.log('Error sincronizando carrito');
  }
}
```

**Responsable:** Backend ya tiene endpoints funcionando

#### 1.2 Checkout Completo
**Archivos a modificar:**
- `carrito.html` - Implementar flujo de checkout
- `js/api.js` - Endpoint `POST /orders` ya existe

**Nuevo archivo:** `checkout.html`

**Flujo:**
1. Usuario hace clic en "Proceder al Pago"
2. Verificar autenticación → redirigir a login si no
3. Mostrar formulario de envío (dirección, ciudad, teléfono)
4. Mostrar método de pago (PSE, Nequi, etc.)
5. Confirmar pedido → `POST /orders`
6. Mostrar confirmación con número de pedido
7. Limpiar carrito

#### 1.3 Mis Pedidos
**Archivos a modificar:**
- `mis-pedidos.html` - Implementar lista de pedidos

**Endpoints usados:**
- `GET /orders` - Lista de pedidos del usuario

---

### Fase 2: Perfil de Usuario - **Prioridad Alta**

#### 2.1 Mi Perfil
**Archivos a modificar:**
- `perfil.html` - Implementar formulario de perfil

**Funcionalidades:**
- Ver datos del perfil actual
- Editar nombre, teléfono
- Ver historial de pedidos
- Gestión de direcciones

#### 2.2 Header Dinámico Completo
**Archivos a modificar:**
- `js/header.js` - Implementar dropdown de usuario completo

**Dropdown por rol:**
```javascript
// BUYER
- Mi Perfil → perfil.html
- Mis Pedidos → mis-pedidos.html
- Mi Carrito → carrito.html
- Cerrar Sesión

// SELLER  
- Mi Tienda → vendedor.html
- Mi Perfil → perfil.html
- Cerrar Sesión

// ADMIN
- Panel Admin → admin.html
- Cerrar Sesión
```

---

### Fase 3: Dashboard Vendedor - **Prioridad Media**

#### 3.1 Mejoras Vendedor Dashboard
**Archivos a modificar:**
- `vendedor.html` - Cargar sellerProfile real

**Problemas actuales:**
- Stats no cargan datos reales
- Perfil de tienda no se guarda
- Órdenes del vendedor no se filtran

**Funcionalidades faltantes:**
- Cargar stats desde `GET /sellers/{id}`
- Guardar perfil de tienda con `PATCH /sellers/{id}`
- Filtrar pedidos que contienen productos del vendedor
- Mostrar rating real

#### 3.2 Actualizar Perfil de Tienda
**Endpoint:** `PATCH /sellers/{id}` ✅ (ya existe en backend)

---

### Fase 4: Mejoras UX - **Prioridad Baja**

#### 4.1 Toast Notifications Global
**Archivos a modificar:**
- `js/api.js` - Conectar `showToast` con respuestas de API
- CSS - Asegurar estilos de toast

#### 4.2 Loading States
**Verificar en:**
- Todas las páginas con llamadas async
- Spinners vs skeletons

#### 4.3 Error Boundaries
**Agregar en:**
- producto.html
- catalogo.html
- carrito.html

---

## Archivos a Crear

| Archivo | Descripción | Prioridad | Estado |
|---------|-------------|-----------|--------|
| `checkout.html` | Página de checkout con formulario de envío | Alta | ✅ Creado |
| `pedido-confirmado.html` | Página de confirmación post-compra | Alta | ✅ Creado |
| `pedido-detalle.html` | Detalle de un pedido específico | Media | ⏳ Usar pedido-confirmado.html |

---

## Archivos a Modificar

### Alta Prioridad

| Archivo | Cambios |
|---------|---------|
| `js/store.js` | Reescribir sincronización con backend |
| `js/header.js` | Dropdown completo por rol |
| `carrito.html` | Integrar con backend, botón checkout |
| `mis-pedidos.html` | Lista de pedidos con detalle |
| `perfil.html` | Formulario de perfil funcional |

### Media Prioridad

| Archivo | Cambios |
|---------|---------|
| `vendedor.html` | Stats reales, guardar perfil |
| `producto.html` | Crear reseña funcional |

---

## Checklist de Implementación

### Semana 1: Core Flows
- [x] Reescribir store.js con sync real
- [x] Crear checkout.html
- [x] Implementar checkout en carrito.html
- [x] Crear pedido-confirmado.html
- [x] Implementar mis-pedidos.html
- [ ] Implementar perfil.html

### Semana 2: UX
- [ ] Header dropdown por rol
- [ ] Badge carrito actualizado
- [ ] Formulario crear reseña
- [ ] Error handling global

### Semana 3: Vendedor Dashboard
- [ ] Cargar stats reales
- [ ] Guardar perfil de tienda
- [ ] Filtrar pedidos por vendedor

---

## Notas Técnicas

### API Endpoints Disponibles
```javascript
// Carrito (ya en api.js)
GET  /cart
POST /cart/items
PATCH /cart/items/{productId}
DELETE /cart/items/{productId}
DELETE /cart

// Órdenes
GET  /orders
GET  /orders/{id}
POST /orders

// Vendedor
GET  /sellers/{id}
PATCH /sellers/{id}

// Usuario
GET  /auth/me

// Reviews
GET  /products/{id}/reviews
POST /products/{id}/reviews
```

### Variables de Entorno
```javascript
const API_BASE_URL = 'http://localhost:8080/api/v1';
```

### Autenticación
```javascript
// Token storage
localStorage.getItem('tierramia_token')
localStorage.getItem('tierramia_user')

// Roles
api.isBuyer()  // BUYER
api.isSeller() // SELLER  
api.isAdmin()  // ADMIN
```

---

## Próximos Pasos Inmediatos

1. ✅ **Sincronizar carrito con backend** - COMPLETADO
2. ✅ **Implementar checkout** - COMPLETADO
3. ✅ **Mis pedidos** - COMPLETADO
4. ⏳ **Mi Perfil** - Implementar perfil.html
5. ⏳ **Header dropdown completo** - Mejorar js/header.js

---

*Documento generado para planificación. Actualizar conforme se implementen las funcionalidades.*
