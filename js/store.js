/**
 * TierraMia Store - Gestión de Estado Global
 * Carrito sincronizado con backend
 */

class Store {
  constructor() {
    this.cart = [];
    this.listeners = [];
    this.isSyncing = false;
    this.initialized = false;
    this.initPromise = this.init();
  }

  async init() {
    try {
      if (api.isAuthenticated()) {
        await this.syncWithBackend();
      } else {
        this.loadFromLocal();
      }
    } catch (error) {
      console.error('Error inicializando store:', error);
    } finally {
      this.initialized = true;
    }
  }

  async waitForInit() {
    await this.initPromise;
  }

  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  notify() {
    this.listeners.forEach(callback => callback(this.cart));
  }

  loadFromLocal() {
    const savedCart = localStorage.getItem('tierramia_cart');
    if (savedCart) {
      try {
        this.cart = JSON.parse(savedCart);
      } catch (e) {
        this.cart = [];
      }
    }
    this.notify();
  }

  saveToLocal() {
    localStorage.setItem('tierramia_cart', JSON.stringify(this.cart));
    this.notify();
  }

  getCart() {
    return this.cart;
  }

  getItemCount() {
    return this.cart.reduce((sum, item) => sum + item.quantity, 0);
  }

  getSubtotal() {
    return this.cart.reduce((sum, item) => {
      return sum + (item.unitPrice * item.quantity);
    }, 0);
  }

  getTotal() {
    return this.getSubtotal();
  }

  hasItems() {
    return this.cart.length > 0;
  }

  async addItem(productId, quantity = 1) {
    if (api.isAuthenticated()) {
      try {
        await api.addToCart(productId, quantity);
        await this.syncWithBackend();
        return { success: true };
      } catch (error) {
        console.error('Error agregando al carrito:', error);
        return { success: false, error: error.message };
      }
    } else {
      const existingIndex = this.cart.findIndex(item => item.productId === productId);
      
      if (existingIndex >= 0) {
        this.cart[existingIndex].quantity += quantity;
      } else {
        this.cart.push({
          productId,
          productName: 'Producto',
          productImageUrl: '',
          quantity,
          unitPrice: 0
        });
      }
      
      this.saveToLocal();
      return { success: true };
    }
  }

  async updateQuantity(productId, quantity) {
    if (api.isAuthenticated()) {
      try {
        await api.updateCartItem(productId, quantity);
        await this.syncWithBackend();
        return { success: true };
      } catch (error) {
        console.error('Error actualizando cantidad:', error);
        return { success: false, error: error.message };
      }
    } else {
      const item = this.cart.find(i => i.productId === productId);
      if (item) {
        if (quantity <= 0) {
          this.removeItem(productId);
        } else {
          item.quantity = quantity;
          this.saveToLocal();
        }
      }
      return { success: true };
    }
  }

  async removeItem(productId) {
    if (api.isAuthenticated()) {
      try {
        await api.removeFromCart(productId);
        await this.syncWithBackend();
        return { success: true };
      } catch (error) {
        console.error('Error removiendo del carrito:', error);
        return { success: false, error: error.message };
      }
    } else {
      this.cart = this.cart.filter(item => item.productId !== productId);
      this.saveToLocal();
      return { success: true };
    }
  }

  async clearCart() {
    if (api.isAuthenticated()) {
      try {
        await api.clearCart();
        this.cart = [];
        this.notify();
        return { success: true };
      } catch (error) {
        console.error('Error limpiando carrito:', error);
        return { success: false, error: error.message };
      }
    } else {
      this.cart = [];
      this.saveToLocal();
      return { success: true };
    }
  }

  async syncWithBackend() {
    if (!api.isAuthenticated()) {
      this.loadFromLocal();
      return;
    }

    if (this.isSyncing) return;
    this.isSyncing = true;

    try {
      const response = await api.getCart();
      if (response.success && response.data && response.data.items) {
        this.cart = response.data.items.map(item => ({
          id: item.id,
          productId: item.productId,
          product: {
            id: item.productId,
            name: item.productName,
            mainImageUrl: item.productImageUrl,
            price: item.unitPrice
          },
          quantity: item.quantity,
          unitPrice: item.unitPrice
        }));
      } else {
        this.cart = [];
      }
      this.notify();
    } catch (error) {
      console.error('Error sincronizando carrito:', error);
      this.cart = [];
      this.notify();
    } finally {
      this.isSyncing = false;
    }
  }

  async onLogin() {
    await this.syncWithBackend();
  }

  onLogout() {
    const guestCart = [...this.cart];
    this.cart = [];
    localStorage.setItem('tierramia_cart_guest', JSON.stringify(guestCart));
    this.notify();
  }
}

const store = new Store();

const updateCartBadge = () => {
  const badges = document.querySelectorAll('.cart-count');
  const count = store.getItemCount();
  badges.forEach(badge => {
    badge.textContent = count;
    badge.style.display = count > 0 ? 'flex' : 'none';
  });
};

store.subscribe(() => {
  updateCartBadge();
});

const originalLogout = api.logout.bind(api);
api.logout = function() {
  store.onLogout();
  originalLogout();
};

window.addEventListener('user-login', () => {
  store.onLogin();
});

document.addEventListener('DOMContentLoaded', () => {
  updateCartBadge();
});
