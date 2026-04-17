# TierraMia Frontend

Frontend estático para la tienda TierraMia - E-commerce de productos colombianos artesanales.

## 1. Descripción

Interfaz de usuario desarrollada con HTML, CSS y JavaScript puro (sin frameworks ni build). Proporciona una experiencia completa para compradores, vendedores y administradores:

- **Compradores (BUYER):** Navegar productos, gestionar carrito, realizar compras, dejar reseñas, ver historial de pedidos.
- **Vendedores (SELLER):** Dashboard de ventas, gestión de productos, perfil de tienda.
- **Administradores (ADMIN):** Gestión de usuarios, supervisión de pedidos.

Se conecta al backend API en `http://localhost:8080/api/v1`.

## 2. Requisitos

- **Node.js** v16 o superior
- **npm** (incluido con Node.js)
- **npx** (incluido con npm)

Verificar instalación:
```bash
node --version    # v16.x.x o superior
npm --version     # 8.x.x o superior
```

## 3. Instalación

No se requieren dependencias de Node.js para el frontend. El proyecto es estático.

**Opcional - Instalar serve globalmente:**
```bash
npm install -g serve
```

## 4. Ejecución con servidor

**IMPORTANTE: No abra los archivos HTML directamente con `file://`**

Las llamadas AJAX al backend fallarán porque:
- Navegadores bloquean requests entre `file://` y `http://` por CORS
- Las rutas relativas no funcionarán correctamente

**Ejecución con npx serve:**

Desde la carpeta `tierramia-frontend/`:

```bash
npx serve -s . -l 3000
```

| Parámetro | Descripción |
|-----------|-------------|
| `-s .` | Sirve el directorio actual como SPA (maneja rutas like `/producto?id=1`) |
| `-l 3000` | Escucha en puerto 3000 |

**Cambiar puerto:**
```bash
npx serve -s . -l 5173    # Puerto 5173 (Vite default)
npx serve -s . -l 8081   # Puerto personalizado
```

**Acceso:** Abra `http://localhost:3000` en su navegador.

## 5. Configuración de conexión con backend

La URL del backend está definida en `js/api.js` línea 6:

```javascript
const API_BASE_URL = 'http://localhost:8080/api/v1';
```

**Para cambiar la URL del backend:**
```bash
# Edite js/api.js y cambie la línea:
const API_BASE_URL = 'http://192.168.1.100:8080/api/v1';
```

**Ports por defecto:**
| Servicio | URL |
|----------|-----|
| Backend API | http://localhost:8080/api/v1 |
| Frontend | http://localhost:3000 |
| Swagger UI | http://localhost:8080/swagger-ui.html |

## 6. Solución de problemas

### CORS bloqueado
**Error en consola:** `Access to fetch at 'http://localhost:8080/api/v1/...' from origin 'http://localhost:3000' has been blocked by CORS policy`

**Solución:** Verificar que el backend tenga `http://localhost:3000` en `CORS_ALLOWED_ORIGINS`:
```bash
# En backend/src/main/resources/application.yml
cors:
  allowed-origins: ${CORS_ALLOWED_ORIGINS:http://localhost:3000,...}
```

### Backend no responde
**Síntoma:** La aplicación muestra mensajes de error o no carga datos.

**Verificaciones:**
```bash
# 1. Backend está corriendo?
curl http://localhost:8080/health
# Respuesta esperada: {"status":"UP"}

# 2. URL correcta en js/api.js?
grep "API_BASE_URL" js/api.js

# 3. Revisar consola del navegador (F12 > Network)
```

### Puerto en uso
**Error:** `Port 3000 is already in use`

**Solución:**
```bash
# Usar otro puerto
npx serve -s . -l 3001
# Luego acceder a http://localhost:3001
```

### Página en blanco
**Síntoma:** La página no muestra contenido.

**Solución:**
1. Abrir consola del navegador (F12 > Console)
2. Revisar pestaña Network para peticiones fallidas (rojo)
3. Verificar que no haya errores de JavaScript

### Problemas de autenticación
**Síntoma:** No puede iniciar sesión o el carrito no funciona.

**Solución:**
1. Limpiar localStorage del navegador (F12 > Application > Local Storage > Clear)
2. Verificar que el backend retorne tokens JWT correctamente

## 7. Resultado esperado

Al abrir `http://localhost:3000` debería ver:

**Página de inicio:**
- Header con logo "TierraMia" y navegación
- Banner principal con mensaje de bienvenida
- Productos destacados en grid
- Footer con información de contacto

**Funcionalidades disponibles:**
- Click en producto → detalle con imágenes, descripción, reseñas
- Botón "Agregar al carrito" actualiza el contador del header
- Iniciar sesión/registrarse cambia el header según rol
- Navegación por categorías funcional
- Búsqueda de productos con filtros

**Flujo de compra:**
1. Agregar productos al carrito
2. Ir a carrito → verificar items
3. Checkout → confirmar datos
4. Orden creada → confirmación

## Estructura del proyecto

```
tierramia-frontend/
├── index.html              # Página de inicio
├── catalogo.html           # Listado de productos
├── categorias.html         # Categorías jerárquicas
├── producto.html           # Detalle de producto
├── carrito.html            # Carrito de compras
├── checkout.html           # Proceso de compra
├── login.html              # Inicio de sesión
├── registro.html           # Registro de usuario
├── perfil.html              # Perfil del usuario
├── mis-productos.html      # Gestión de productos (vendedor)
├── mis-pedidos.html        # Historial de pedidos
├── vendedor.html           # Dashboard del vendedor
├── admin.html              # Panel de administración
├── pedido-confirmado.html   # Confirmación de pedido
├── 404.html                # Página de error
├── css/
│   └── styles.css         # Estilos principales
└── js/
    ├── api.js             # Cliente API (config: API_BASE_URL)
    ├── app.js             # Lógica principal
    ├── header.js          # Header dinámico por rol
    └── store.js           # Estado global
```

## Comandos rápidos

```bash
# Levantar frontend
npx serve -s . -l 3000

# Verificar backend
curl http://localhost:8080/health

# Limpiar cache del navegador
# F12 > Application > Local Storage > Clear
```

## Licencia

[MIT](LICENSE)
