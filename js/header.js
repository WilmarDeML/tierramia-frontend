/**
 * TierraMia Header Component
 * Header dinámico según rol de usuario
 */

class HeaderComponent {
  constructor() {
    this.currentPage = this.getCurrentPage();
  }

  getCurrentPage() {
    const path = window.location.pathname;
    const filename = path.split('/').pop() || 'index.html';
    return filename.replace('.html', '');
  }

  render() {
    const apiAvailable = typeof api !== 'undefined' && api;
    const isAuthenticated = apiAvailable && api.isAuthenticated ? api.isAuthenticated() : false;
    const role = isAuthenticated && api.getUserRole ? api.getUserRole() : null;
    const user = isAuthenticated && api.getUser ? api.getUser() : null;
    const cartCount = (typeof store !== 'undefined' && store.getItemCount) ? store.getItemCount() : 0;

    console.log('Header render:', { isAuthenticated, role, user: user?.firstName });

    return `
      <header class="header">
        <div class="container header-container">
          <a href="index.html" class="logo">
            <div class="logo-icon">🌿</div>
            <span>TierraMia</span>
          </a>

          <nav class="header-nav desktop-nav">
            ${this.renderNavLinks(isAuthenticated, role)}
          </nav>

          <div class="header-actions">
            ${this.renderRightSection(isAuthenticated, role, user, cartCount)}
          </div>

          <button class="mobile-menu-btn" onclick="toggleMobileMenu()" aria-label="Menu">
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>
        </div>

        <nav id="mobile-menu" class="mobile-nav hidden">
          ${this.renderMobileNavLinks(isAuthenticated, role)}
        </nav>
      </header>
    `;
  }

  renderNavLinks(isAuthenticated, role) {
    const links = [
      { href: 'index.html', label: 'Inicio', page: 'index' },
      { href: 'catalogo.html', label: 'Catálogo', page: 'catalogo' }
    ];

    let html = links.map(link => `
      <a href="${link.href}" class="nav-link ${this.currentPage === link.page ? 'active' : ''}">
        ${link.label}
      </a>
    `).join('');

    return html;
  }

  renderRightSection(isAuthenticated, role, user, cartCount) {
    if (!isAuthenticated) {
      return `
        <a href="login.html" class="nav-link">Iniciar Sesión</a>
        <a href="registro.html" class="btn btn-primary btn-sm">Regístrate</a>
      `;
    }

    let html = '';

    // Cart - Only for buyers
    if (role === 'BUYER') {
      html += `
        <a href="carrito.html" class="nav-link relative">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
          </svg>
          <span class="cart-count absolute -top-2 -right-2 bg-accent text-white text-xs rounded-full w-5 h-5 flex items-center justify-center" style="display: ${cartCount > 0 ? 'flex' : 'none'}">
            ${cartCount}
          </span>
        </a>
      `;
    }

    // User dropdown
    html += `
      <div class="relative user-dropdown">
        <button onclick="toggleUserDropdown()" class="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100" style="background: var(--color-bg);">
          <div class="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-medium">
            ${user?.firstName?.charAt(0) || 'U'}
          </div>
          <span class="hidden sm:inline font-medium">${user?.firstName || 'Usuario'}</span>
          <span class="text-xs px-2 py-0.5 rounded bg-gray-200">${role || ''}</span>
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
          </svg>
        </button>
        <div id="user-dropdown-menu" class="hidden absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border z-50" style="min-width: 200px;">
          ${this.renderDropdownMenu(role)}
        </div>
      </div>
    `;

    return html;
  }

  renderDropdownMenu(role) {
    const menuItems = [];

    // Role-specific links
    if (role === 'SELLER') {
      menuItems.push(
        { href: 'vendedor.html', label: 'Mi Tienda', icon: '🏪' },
        { href: 'mis-productos.html', label: 'Mis Productos', icon: '📦' }
      );
    } else if (role === 'ADMIN') {
      menuItems.push(
        { href: 'admin.html', label: 'Panel Admin', icon: '⚙️' }
      );
    }

    if (role === 'BUYER') {
      menuItems.push(
        { href: 'mis-pedidos.html', label: 'Mis Pedidos', icon: '📋' }
      );
    }

    // Common links
    menuItems.push(
      { href: 'perfil.html', label: 'Mi Perfil', icon: '👤' }
    );

    return `
      ${menuItems.map(item => `
        <a href="${item.href}" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
          <span class="mr-2">${item.icon}</span>${item.label}
        </a>
      `).join('')}
      <hr class="my-2">
      <button onclick="handleLogout()" class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
        <span class="mr-2">🚪</span>Cerrar Sesión
      </button>
    `;
  }

  renderMobileNavLinks(isAuthenticated, role) {
    const links = [
      { href: 'index.html', label: 'Inicio', page: 'index' },
      { href: 'catalogo.html', label: 'Catálogo', page: 'catalogo' }
    ];

    let html = links.map(link => `
      <a href="${link.href}" class="nav-link ${this.currentPage === link.page ? 'active' : ''}">
        ${link.label}
      </a>
    `).join('');

    if (!isAuthenticated) {
      html += `
        <a href="login.html" class="nav-link">Iniciar Sesión</a>
        <a href="registro.html" class="btn btn-primary btn-sm w-fit">Regístrate</a>
      `;
    } else {
      // Role-specific mobile links
      if (role === 'BUYER') {
        html += `<a href="carrito.html" class="nav-link">🛒 Carrito (${(typeof store !== 'undefined' && store.getItemCount) ? store.getItemCount() : 0})</a>`;
        html += `<a href="mis-pedidos.html" class="nav-link">📋 Mis Pedidos</a>`;
      }

      if (role === 'SELLER') {
        html += `<a href="vendedor.html" class="nav-link">🏪 Mi Tienda</a>`;
        html += `<a href="mis-productos.html" class="nav-link">📦 Mis Productos</a>`;
      }

      if (role === 'ADMIN') {
        html += `<a href="admin.html" class="nav-link">⚙️ Panel Admin</a>`;
      }

      html += `
        <a href="perfil.html" class="nav-link">👤 Mi Perfil</a>
        <button onclick="handleLogout()" class="nav-link text-left text-red-600">🚪 Cerrar Sesión</button>
      `;
    }

    return html;
  }
}

// Global instance
const headerComponent = new HeaderComponent();

// Toggle mobile menu
function toggleMobileMenu() {
  const menu = document.getElementById('mobile-menu');
  menu.classList.toggle('hidden');
}

// Toggle user dropdown
function toggleUserDropdown() {
  const menu = document.getElementById('user-dropdown-menu');
  menu.classList.toggle('hidden');
}

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
  const dropdown = document.querySelector('.user-dropdown');
  if (dropdown && !dropdown.contains(e.target)) {
    const menu = document.getElementById('user-dropdown-menu');
    if (menu) menu.classList.add('hidden');
  }
});

// Handle logout
function handleLogout() {
  api.logout();
  store.clearCart();
  window.location.href = 'index.html';
}

// Render header - usa HeaderComponent
async function renderHeader() {
  const placeholder = document.getElementById('header-placeholder');
  if (!placeholder) {
    console.warn('Header placeholder not found');
    return;
  }
  
  // Esperar a que el store esté inicializado
  if (store && store.waitForInit) {
    await store.waitForInit();
  }
  
  const component = new HeaderComponent();
  placeholder.innerHTML = component.render();
  console.log('Header rendered successfully');
}

// Initialize header
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderHeader);
} else {
  renderHeader();
}
