import axios from 'axios';

const API = 'http://localhost:3000/api/stocks';

export const inbound = (data) =>
  axios.post(`${API}/inbound`, data);

export const outbound = (data) =>
  axios.post(`${API}/outbound`, data);

export const transfer = (data) =>
  axios.post(`${API}/transfer`, data);

export const opname = (data) =>
  axios.post(`${API}/opname`, data);
