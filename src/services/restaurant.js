import api from './api';

// Menu Service - Routes publiques GET, protegees POST/PUT/DELETE
export const menuService = {
  // PUBLIC
  getAll: () => api.get('/menu').then(r => r.data.data || r.data),
  getById: (id) => api.get(`/menu/${id}`).then(r => r.data.data || r.data),
  getByCategories: () => api.get('/menu/categories').then(r => r.data.data || r.data),
  getPopular: () => api.get('/menu/popular').then(r => r.data.data || r.data),
  getSpecials: () => api.get('/menu/specials').then(r => r.data.data || r.data),
  search: (query) => api.get(`/menu/search?query=${query}`).then(r => r.data.data || r.data),
  getStatistics: () => api.get('/menu/statistics').then(r => r.data.data || r.data),
  // PROTECTED
  create: (data) => api.post('/menu', data).then(r => r.data.data || r.data),
  update: (id, data) => api.put(`/menu/${id}`, data).then(r => r.data.data || r.data),
  delete: (id) => api.delete(`/menu/${id}`).then(r => r.data),
  toggleAvailability: (id) => api.patch(`/menu/${id}/availability`).then(r => r.data.data || r.data)
};

// Table Service
export const tableService = {
  getAll: () => api.get('/tables').then(r => r.data.data || r.data),
  getById: (id) => api.get(`/tables/${id}`).then(r => r.data.data || r.data),
  getAvailable: (params) => api.get('/tables/available', { params }).then(r => r.data.data || r.data),
  getFloorPlan: () => api.get('/tables/floor-plan').then(r => r.data.data || r.data),
  getStatistics: () => api.get('/tables/statistics').then(r => r.data.data || r.data),
  create: (data) => api.post('/tables', data).then(r => r.data.data || r.data),
  update: (id, data) => api.put(`/tables/${id}`, data).then(r => r.data.data || r.data),
  delete: (id) => api.delete(`/tables/${id}`).then(r => r.data),
  updateStatus: (id, status) => api.patch(`/tables/${id}/status`, { status }).then(r => r.data.data || r.data)
};

// Reservation Service
export const reservationService = {
  getCustomerHistory: (phone) => api.get(`/reservations/customer/${encodeURIComponent(phone)}`).then(r => r.data.data || r.data),
  getById: (id) => api.get(`/reservations/${id}`).then(r => r.data.data || r.data),
  getAll: () => api.get('/reservations').then(r => r.data.data || r.data),
  create: (data) => api.post('/reservations', data).then(r => r.data.data || r.data),
  update: (id, data) => api.put(`/reservations/${id}`, data).then(r => r.data.data || r.data),
  delete: (id) => api.delete(`/reservations/${id}`).then(r => r.data),
  cancel: (id, reason) => api.post(`/reservations/${id}/cancel`, { cancelReason: reason }).then(r => r.data.data || r.data),
  markArrived: (id) => api.post(`/reservations/${id}/arrived`).then(r => r.data.data || r.data),
  markCompleted: (id) => api.post(`/reservations/${id}/completed`).then(r => r.data.data || r.data)
};

// Waitlist Service
export const waitlistService = {
  create: (data) => api.post('/waitlist', data).then(r => r.data.data || r.data),
  getAll: () => api.get('/waitlist').then(r => r.data.data || r.data),
  convert: (id, tableId) => api.post(`/waitlist/${id}/convert`, { tableId }).then(r => r.data.data || r.data),
  cancel: (id) => api.post(`/waitlist/${id}/cancel`).then(r => r.data.data || r.data)
};

// Order Service
export const orderService = {
  getAll: () => api.get('/orders').then(r => r.data.data || r.data),
  getById: (id) => api.get(`/orders/${id}`).then(r => r.data.data || r.data),
  getByTable: (tableId) => api.get(`/orders/table/${tableId}`).then(r => r.data.data || r.data),
  getCustomerHistory: (phone) => api.get(`/orders/customer/${encodeURIComponent(phone)}`).then(r => r.data.data || r.data),
  getStatistics: () => api.get('/orders/statistics').then(r => r.data.data || r.data),
  create: (data) => api.post('/orders', data).then(r => r.data.data || r.data),
  updateStatus: (id, status) => api.patch(`/orders/${id}/status`, { status }).then(r => r.data.data || r.data),
  addItems: (id, items) => api.post(`/orders/${id}/items`, { items }).then(r => r.data.data || r.data),
  cancel: (id, reason) => api.post(`/orders/${id}/cancel`, { cancelReason: reason }).then(r => r.data.data || r.data),
  delete: (id) => api.delete(`/orders/${id}`).then(r => r.data)
};
