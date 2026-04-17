/**
 * TierraMia API Client
 * Cliente para interactuar con la API del backend
 */

const API_BASE_URL = 'http://localhost:8080/api/v1';

class ApiClient {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
    this.token = localStorage.getItem('tierramia_token');
    this.refreshToken = localStorage.getItem('tierramia_refresh_token');
    this.user = JSON.parse(localStorage.getItem('tierramia_user') || 'null');
  }

  // Headers por defecto
  getHeaders() {
    const headers = {
      'Content-Type': 'application/json'
    };
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    return headers;
  }

  // Request genérico
  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const config = {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers
      }
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new ApiError(data.error?.message || 'Error desconocido', response.status, data);
      }

      return data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Error de conexión', 0, null);
    }
  }

  // ============ AUTENTICACIÓN ============

  async register(userData) {
    const data = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });

    if (data.data) {
      this.setAuth(data.data);
    }

    return data;
  }

  async login(email, password) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });

    if (data.data) {
      this.setAuth(data.data);
    }

    return data;
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  logout() {
    this.token = null;
    this.refreshToken = null;
    this.user = null;
    localStorage.removeItem('tierramia_token');
    localStorage.removeItem('tierramia_refresh_token');
    localStorage.removeItem('tierramia_user');
  }

  setAuth(authData) {
    if (authData.token) {
      this.token = authData.token;
      localStorage.setItem('tierramia_token', authData.token);
    }
    if (authData.refreshToken) {
      this.refreshToken = authData.refreshToken;
      localStorage.setItem('tierramia_refresh_token', authData.refreshToken);
    }
    if (authData.user) {
      this.user = authData.user;
      localStorage.setItem('tierramia_user', JSON.stringify(authData.user));
    }
  }

  isAuthenticated() {
    return !!this.token;
  }

  getUser() {
    return this.user;
  }

  getUserRole() {
    return this.user?.role || null;
  }

  isBuyer() {
    return this.getUserRole() === 'BUYER';
  }

  isSeller() {
    return this.getUserRole() === 'SELLER';
  }

  isAdmin() {
    return this.getUserRole() === 'ADMIN';
  }

  // ============ PRODUCTOS ============

  async getProducts(params = {}) {
    const queryParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value);
      }
    });

    const endpoint = `/products${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    return this.request(endpoint);
  }

  async getSellerProducts(sellerId, params = {}) {
    return this.getProducts({ sellerId, ...params });
  }

  async getProduct(id) {
    return this.request(`/products/${id}`);
  }

  async createProduct(productData) {
    return this.request('/products', {
      method: 'POST',
      body: JSON.stringify(productData)
    });
  }

  async updateProduct(id, productData) {
    return this.request(`/products/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(productData)
    });
  }

  async deleteProduct(id) {
    return this.request(`/products/${id}`, {
      method: 'DELETE'
    });
  }

  // ============ CATEGORÍAS ============

  async getCategories(options = {}) {
    let endpoint = '/categories?';
    if (options.rootOnly) endpoint += 'rootOnly=true';
    const finalEndpoint = endpoint.endsWith('?') ? '/categories' : endpoint;
    return this.request(finalEndpoint);
  }

  async getCategory(id) {
    return this.request(`/categories/${id}`);
  }

  // ============ VENDEDORES ============

  async getSeller(id) {
    return this.request(`/sellers/${id}`);
  }

  // ============ RESEÑAS ============

  async getProductReviews(productId, page = 1, limit = 10) {
    return this.request(`/products/${productId}/reviews?page=${page}&limit=${limit}`);
  }

  async createReview(productId, reviewData) {
    return this.request(`/products/${productId}/reviews`, {
      method: 'POST',
      body: JSON.stringify(reviewData)
    });
  }

  // ============ CARRITO ============

  async getCart() {
    return this.request('/cart');
  }

  async addToCart(productId, quantity = 1) {
    return this.request('/cart/items', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity })
    });
  }

  async updateCartItem(itemId, quantity) {
    return this.request(`/cart/items/${itemId}`, {
      method: 'PATCH',
      body: JSON.stringify({ quantity })
    });
  }

  async removeFromCart(itemId) {
    return this.request(`/cart/items/${itemId}`, {
      method: 'DELETE'
    });
  }

  async clearCart() {
    return this.request('/cart', {
      method: 'DELETE'
    });
  }

  // ============ ÓRDENES ============

  async getOrders() {
    return this.request('/orders');
  }

  async createOrder(orderData) {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData)
    });
  }

  async getOrder(id) {
    return this.request(`/orders/${id}`);
  }

  // ============ ADMIN ============

  async getAllUsers() {
    return this.request('/admin/users');
  }

  async updateUserStatus(userId, isActive) {
    return this.request(`/admin/users/${userId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ isActive })
    });
  }

  async getAllOrders() {
    return this.request('/admin/orders');
  }

  async updateOrderStatus(orderId, status) {
    return this.request(`/admin/orders/${orderId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
  }
}

// Error class personalizada
class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

// Instancia global del cliente
const api = new ApiClient(API_BASE_URL);

// Funciones helper
const formatPrice = (price) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
  }).format(price);
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const getDiscountPercentage = (price, compareAtPrice) => {
  if (!compareAtPrice || compareAtPrice <= price) return 0;
  return Math.round((1 - price / compareAtPrice) * 100);
};

const showToast = (message, type = 'success') => {
  const existingToast = document.querySelector('.toast');
  if (existingToast) existingToast.remove();

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => toast.remove(), 3000);
};

const showLoading = (containerId) => {
  return `<div class="loading"><div class="spinner"></div></div>`;
};

const generateStarRating = (rating) => {
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);
  
  return '★'.repeat(fullStars) + 
         (hasHalf ? '☆' : '') + 
         '☆'.repeat(emptyStars);
};
