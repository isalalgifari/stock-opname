import axios from 'axios';

const API = 'http://localhost:3000/api/dashboard';

export const fetchStockSummary = () => axios.get(`${API}/summary`);
export const fetchValuation = () => axios.get(`${API}/valuation`);
export const fetchMovements = () => axios.get(`${API}/movements`);
