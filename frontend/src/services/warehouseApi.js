import axios from 'axios';

const API = 'http://localhost:3000/api/warehouses';

export const getWarehouses = () => axios.get(API);
export const createWarehouse = (data) => axios.post(API, data);
export const updateWarehouse = (id, data) => axios.put(`${API}/${id}`, data);
export const deleteWarehouse = (id) =>axios.delete(`${API}/${id}`);
