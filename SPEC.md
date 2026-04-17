# TierraMia Frontend - Especificaciones

> Documento para planificar el desarrollo del frontend.

## Visión del Proyecto

Un frontend web sencillo, hermoso y funcional para TierraMia que permita:
1. **Ver productos** - Catálogo con búsqueda y filtros
2. **Registrarse/Iniciar sesión** - Gestión de usuarios
3. **Ver detalles de productos** - Información completa
4. **Navegar por categorías** - Estructura jerárquica
5. **Gestionar carrito** - Agregar/quitar productos
6. **Realizar pedidos** - Checkout básico

---

## stack Tecnológico Propuesto

### Opción 1: Vanilla HTML + CSS + JavaScript
- **Ventajas:** Simple, sin build, fácil de entender
- **Desventajas:** Menos mantenible para proyectos grandes
- **Archivos:** `index.html`, `styles.css`, `app.js`

### Opción 2: Vite + Vanilla JavaScript
- **Ventajas:** Dev server rápido, moderna, modular
- **Desventajas:** Requiere Node.js
- **Comandos:** `npm create vite@latest`

### Opción 3: HTML + Tailwind CSS + Alpine.js
- **Ventajas:** Muy rápido, estilos pre-construidos, reactivo
- **Desventajas:** Requiere aprender Tailwind
- **CDN:** Funciona directo en navegador

---

## Recomendación

**Opción 3: HTML + Tailwind CSS + Alpine.js**

- Desarrollo rápido
- Sin necesidad de compilación (o con Vite para mejor DX)
- Estilos profesionales sin escribir CSS desde cero
- JavaScript reactivo sin la complejidad de frameworks
- Funciona con CDN para prototipos rápidos

---

## Estructura de Páginas

### 1. Página Principal (Home)
```
┌─────────────────────────────────────────┐
│ Header: Logo + Nav + Carrito + Auth    │
├─────────────────────────────────────────┤
│ Hero: Banner + CTA                      │
├─────────────────────────────────────────┤
│ Categorías Populares (grid de cards)    │
├─────────────────────────────────────────┤
│ Productos Destacados (grid de cards)   │
├─────────────────────────────────────────┤
│ Footer                                 │
└─────────────────────────────────────────┘
```

### 2. Catálogo de Productos
```
┌─────────────────────────────────────────┐
│ Header                                  │
├──────────┬──────────────────────────────┤
│ Filtros  │ Grid de Productos           │
│ - Dept   │ - Cards con imagen          │
│ - Precio │ - Nombre, precio, rating   │
│ - Tipo   │ - Paginación                │
└──────────┴──────────────────────────────┘
```

### 3. Detalle de Producto
```
┌─────────────────────────────────────────┐
│ Header                                  │
├─────────────────┬───────────────────────┤
│ Imagen Grande   │ Info Producto          │
│ + Galería       │ - Nombre              │
│                 │ - Precio               │
│                 │ - Descripción          │
│                 │ - Seller info          │
│                 │ - [Agregar al carro]   │
├─────────────────┴───────────────────────┤
│ Reseñas                                 │
└─────────────────────────────────────────┘
```

### 4. Carrito
```
┌─────────────────────────────────────────┐
│ Header                                  │
├─────────────────────────────────────────┤
│ Lista de Items                          │
│ - Imagen | Nombre | Cantidad | Precio   │
├─────────────────────────────────────────┤
│ Resumen: Subtotal, Total              │
│ [Proceder al Pago]                     │
└─────────────────────────────────────────┘
```

### 5. Autenticación (Login/Register)
```
┌─────────────────────────────────────────┐
│ Header                                  │
├─────────────────────────────────────────┤
│         [Login] [Registrarse]          │
│  ┌─────────────────────────────────┐   │
│  │ Formulario de autenticación      │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

---

## API Integration

### Endpoints Requeridos

| Página | Endpoints Necesarios |
|--------|---------------------|
| Home | `GET /products?isHandmade=true&sortBy=rating&size=8` |
| Catálogo | `GET /products?...todos los filtros` |
| Detalle | `GET /products/{id}`, `GET /products/{id}/reviews` |
| Categorías | `GET /categories?rootOnly=true` |
| Auth | `POST /auth/login`, `POST /auth/register` |
| Carrito | `GET /cart`, `POST /cart/items`, `DELETE /cart/items/{id}` |
| Checkout | `POST /orders` |

### Gestión de Auth (LocalStorage)
```javascript
// Guardar token
localStorage.setItem('token', response.data.token);
localStorage.setItem('refreshToken', response.data.refreshToken);
localStorage.setItem('user', JSON.stringify(response.data.user));

// Usar en requests
const token = localStorage.getItem('token');
fetch('/api/v1/products', {
  headers: { 'Authorization': `Bearer ${token}` }
});
```

---

## Diseño - TierraMia Brand

### Paleta de Colores
```
Primario:      #2E7D32  (Verde tierra)
Secundario:    #8D6E63  (Marrón café)
Acento:        #FF6F00  (Naranja artesanal)
Fondo:         #FAFAFA  (Blanco cálido)
Texto:         #212121  (Negro suave)
Texto secundario: #757575
Éxito:         #4CAF50
Error:         #F44336
```

### Tipografía
```
Títulos:    'Playfair Display', serif
Cuerpo:     'Inter', sans-serif
Acentos:    'Lora', serif
```

### Estilo Visual
- Productos artesanales → sensación orgánica, texturas
- Fotografía de productos → fondo neutro
- Tarjetas → bordes suaves (border-radius: 8-12px)
- Sombras → sutiles, warm tones
- Espaciado generoso → respiración visual

---

## Páginas Minimum Viable Product (MVP)

1. **Home** - Hero + categorías + productos destacados
2. **Catálogo** - Lista con filtros básicos
3. **Detalle de Producto** - Info + reseñas
4. **Carrito** - Lista + resumen
5. **Login/Register** - Auth básico
6. **Checkout** - Formulario simple (mock de pago)

---

## Recursos Externos

### Iconos
- Heroicons (https://heroicons.com)
- Phosphor Icons (https://phosphoricons.com)

### Imágenes Placeholder
- Unsplash Source (para desarrollo)
- Imágenes reales de productos en el backend

### Fuentes
```html
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@400;500;600&family=Lora:wght@400;500&display=swap" rel="stylesheet">
```

### Tailwind CSS (CDN)
```html
<script src="https://cdn.tailwindcss.com"></script>
```

### Alpine.js (CDN)
```html
<script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
```

---

## Próximos Pasos

1. [x] Crear estructura HTML base ✅
2. [x] Configurar Tailwind con colores de marca ✅
3. [x] Implementar componentes reutilizables (Header, Footer, Card) ✅
4. [x] Crear página Home ✅
5. [x] Integrar API de productos ✅
6. [x] Implementar autenticación ✅
7. [x] Crear páginas de catálogo y detalle ✅
8. [x] Implementar carrito (UI) ✅ - Sincronización con backend pendiente
9. [ ] Checkout completo (en desarrollo)
10. [ ] Mis Pedidos (en desarrollo)
11. [ ] Mi Perfil (en desarrollo)

Ver `FRONTEND_PLAN.md` para plan detallado.

---

## Archivos del Proyecto

```
tierramia-frontend/
├── index.html           # Home ✅
├── catalogo.html        # Lista de productos ✅
├── producto.html        # Detalle de producto ✅
├── carrito.html         # Carrito de compras ⚠️ (UI lista, sync pendiente)
├── login.html           # Login ✅
├── registro.html        # Registro ✅
├── checkout.html        # Pago (POR CREAR)
├── categorias.html      # Categorías ✅
├── mis-pedidos.html     # Mis pedidos (POR IMPLEMENTAR)
├── perfil.html          # Mi perfil (POR IMPLEMENTAR)
├── vendedor.html        # Dashboard vendedor ⚠️
├── admin.html           # Panel admin ✅
├── pedido-confirmado.html # Confirmación (POR CREAR)
├── css/
│   └── styles.css       # Estilos personalizados ✅
├── js/
│   ├── api.js          # Cliente API ✅
│   ├── store.js        # Estado global ⚠️
│   ├── header.js       # Header dinámico ⚠️
│   └── app.js          # Lógica principal ✅
├── SPEC.md              # Este documento
└── FRONTEND_PLAN.md    # Plan de implementación
```

---

## Estado de Implementación (2026-04-13)

### ✅ Completado
- Home, Catálogo, Producto, Categorías
- Login, Registro
- Admin dashboard completo
- API client funcional

### ⚠️ En Progreso
- Carrito: UI lista, sync con backend pendiente
- Vendedor: Dashboard con datos básicos
- Header: Dinámico pero dropdown incompleto

### ❌ Por Implementar
- Checkout completo
- Mis Pedidos
- Mi Perfil
- Crear Reseña desde producto
- Sincronización real carrito-backend
