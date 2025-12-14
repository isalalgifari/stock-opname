import { useEffect, useState } from 'react';
import { fetchStockSummary, fetchValuation, fetchMovements } from '../services/dashboardApi';

export default function Dashboard() {
  const [stockSummary, setStockSummary] = useState([]);
  const [globalTotals, setGlobalTotals] = useState({});
  const [valuation, setValuation] = useState(0);
  const [movements, setMovements] = useState([]);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    const stockRes = await fetchStockSummary();
    setStockSummary(stockRes.data.stockData);
    setGlobalTotals(stockRes.data.globalTotals);

    const valRes = await fetchValuation();
    setValuation(valRes.data.totalRupiah);

    const movRes = await fetchMovements();
    setMovements(movRes.data.movements);
  };

  return (
    <div>
      <h2>📊 Dashboard Inventory</h2>

      <h3>💰 Total Valuation: Rp {valuation.toLocaleString()}</h3>

      <h3>📦 Stock per Warehouse</h3>
      <table border={1} cellPadding={5}>
        <thead>
          <tr>
            <th>Warehouse</th>
            <th>Product</th>
            <th>Qty</th>
            <th>Price</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {stockSummary.map(item => (
            <tr key={`${item.warehouseId}-${item.productId}`}>
              <td>{item.warehouseName}</td>
              <td>{item.productName}</td>
              <td>{item.qty}</td>
              <td>{item.price}</td>
              <td>{(item.qty * item.price).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>🌐 Global Stock</h3>
      <ul>
        {Object.entries(globalTotals).map(([productId, total]) => (
          <li key={productId}>Product {productId}: {total}</li>
        ))}
      </ul>

      <h3>📝 Stock Movements</h3>
      <table border={1} cellPadding={5}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Product</th>
            <th>Type</th>
            <th>Qty</th>
            <th>From</th>
            <th>To</th>
            <th>Note</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {movements.map(m => (
            <tr key={m.id}>
              <td>{m.id}</td>
              <td>{m.productName}</td>
              <td>{m.type}</td>
              <td>{m.qty}</td>
              <td>{m.fromWarehouse || '-'}</td>
              <td>{m.toWarehouse || '-'}</td>
              <td>{m.note}</td>
              <td>{new Date(m.timestamp).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
