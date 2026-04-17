/**
 * TierraMia App - Funciones Principales
 */

// ============ NAVEGACIÓN ============

function navigateTo(page) {
  window.location.href = page;
}

// ============ HEADER COMÚN ============

function renderHeader() {
  const user = api.getUser();
  const isAuth = api.isAuthenticated();

  return `
    <header class="header">
      <div class="container">
        <div class="header-inner">
          <a href="index.html" class="logo">
            <div class="logo-icon">🌿</div>
            <span>TierraMia</span>
          </a>

          <nav class="nav">
            <a href="index.html" class="nav-link">Inicio</a>
            <a href="catalogo.html" class="nav-link">Catálogo</a>
            <a href="categorias.html" class="nav-link">Categorías</a>
          </nav>

          <div class="nav-actions">
            <a href="carrito.html" class="cart-badge" title="Carrito">
              🛒
              <span class="cart-count" style="display: none;">0</span>
            </a>

            ${isAuth ? `
              <div class="flex items-center gap-4">
                <span class="text-secondary">Hola, ${user?.firstName || 'Usuario'}</span>
                <button onclick="logout()" class="btn btn-sm btn-outline">Salir</button>
              </div>
            ` : `
              <div class="flex items-center gap-2">
                <a href="login.html" class="btn btn-sm btn-outline">Ingresar</a>
                <a href="registro.html" class="btn btn-sm btn-primary">Registrarse</a>
              </div>
            `}
          </div>
        </div>
      </div>
    </header>
  `;
}

// ============ FOOTER COMÚN ============

function renderFooter() {
  return `
    <footer class="footer">
      <div class="container">
        <div class="footer-grid">
          <div>
            <h4 class="footer-title">TierraMia</h4>
            <p class="text-secondary" style="font-size: 0.9rem;">
              Productos colombianos auténticos, directamente de artesanos locales.
            </p>
          </div>

          <div>
            <h4 class="footer-title">Explorar</h4>
            <a href="catalogo.html" class="footer-link">Catálogo</a>
            <a href="categorias.html" class="footer-link">Categorías</a>
            <a href="artistas.html" class="footer-link">Artesanos</a>
          </div>

          <div>
            <h4 class="footer-title">Cuenta</h4>
            <a href="login.html" class="footer-link">Iniciar Sesión</a>
            <a href="registro.html" class="footer-link">Registrarse</a>
            <a href="pedidos.html" class="footer-link">Mis Pedidos</a>
          </div>

          <div>
            <h4 class="footer-title">Contacto</h4>
            <p class="footer-link">soporte@tierramia.co</p>
            <p class="footer-link">+57 300 123 4567</p>
          </div>
        </div>

        <div class="footer-bottom">
          <p>&copy; 2025 TierraMia. Todos los derechos reservados. Hecho con ❤️ en Colombia 🇨🇴</p>
        </div>
      </div>
    </footer>
  `;
}

// ============ AUTENTICACIÓN ============

function logout() {
  api.logout();
  store.clearCart();
  showToast('Has cerrado sesión', 'success');
  navigateTo('index.html');
}

function requireAuth() {
  if (!api.isAuthenticated()) {
    showToast('Debes iniciar sesión primero', 'warning');
    navigateTo('login.html');
    return false;
  }
  return true;
}

// ============ RENDERIZADO DE PRODUCTOS ============

function renderProductCard(product) {
  const discount = getDiscountPercentage(product.price, product.compareAtPrice);
  const productId = String(product.id);
  
  return `
    <div class="card" style="display: block; cursor: pointer;" onclick="window.location.href = 'producto?id=' + '${productId}'">
      <div style="position: relative;">
        <img 
          src="${product.mainImageUrl}" 
          alt="${product.name}"
          class="card-image"
          onerror="this.src='https://via.placeholder.com/400x300?text=Sin+imagen'"
        >
        ${product.isHandmade ? '<span class="badge badge-handmade" style="position: absolute; top: 0.5rem; left: 0.5rem;">✋ Artesanal</span>' : ''}
        ${discount > 0 ? `<span class="badge" style="position: absolute; top: 0.5rem; right: 0.5rem; background: var(--color-accent); color: white;">-${discount}%</span>` : ''}
      </div>
      <div class="card-body">
        <h3 class="card-title">${product.name}</h3>
        <p class="card-subtitle">${product.originDepartment}, ${product.originCity}</p>
        <div class="flex items-center justify-between">
          <div>
            <span class="card-price">${formatPrice(product.price)}</span>
            ${discount > 0 ? `<span class="card-price-old">${formatPrice(product.compareAtPrice)}</span>` : ''}
          </div>
          <div class="rating">
            <span class="star">★</span>
            <span>${product.rating?.toFixed(1) || '0.0'}</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderProductList(products, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (!products || products.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">📦</div>
        <h3 class="empty-state-title">No hay productos</h3>
        <p>Intenta con otros filtros o regresa más tarde.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = products.map(p => renderProductCard(p)).join('');
}

// ============ RENDERIZADO DE CATEGORÍAS ============

function renderCategoryCard(category) {
  const categoryId = String(category.id);
  return `
    <div class="card" style="text-align: center; padding: 1.5rem; cursor: pointer;" onclick="window.location.href = 'catalogo?category=' + '${categoryId}'">
      <div style="font-size: 3rem; margin-bottom: 1rem;">🏺</div>
      <h3 class="card-title">${category.name}</h3>
      <p class="card-subtitle">${category.productCount || 0} productos</p>
    </div>
  `;
}

// ============ PAGINACIÓN ============

function renderPagination(currentPage, totalPages, onPageChange) {
  if (totalPages <= 1) return '';

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...');
    }
  }

  return `
    <div class="flex items-center justify-center gap-2 mt-4">
      <button 
        class="btn btn-sm btn-outline" 
        ${currentPage === 1 ? 'disabled' : ''}
        onclick="window.currentPage = ${currentPage - 1}; ${onPageChange}"
      >
        ← Anterior
      </button>

      ${pages.map(p => p === '...' 
        ? '<span class="btn btn-sm" style="cursor: default;">...</span>'
        : `<button 
            class="btn btn-sm ${p === currentPage ? 'btn-primary' : 'btn-outline'}" 
            onclick="window.currentPage = ${p}; ${onPageChange}"
          >${p}</button>`
      ).join('')}

      <button 
        class="btn btn-sm btn-outline" 
        ${currentPage === totalPages ? 'disabled' : ''}
        onclick="window.currentPage = ${currentPage + 1}; ${onPageChange}"
      >
        Siguiente →
      </button>
    </div>
  `;
}

// ============ INICIALIZACIÓN ============

document.addEventListener('DOMContentLoaded', () => {
  // Actualizar carrito
  updateCartBadge();
});
