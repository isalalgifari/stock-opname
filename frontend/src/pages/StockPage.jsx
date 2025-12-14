import { useState } from 'react';
import {
  inbound,
  outbound,
  transfer,
  opname,
} from '../services/stockApi';

export default function StockPage() {
  const [form, setForm] = useState({
    productId: '',
    warehouseId: '',
    fromWarehouseId: '',
    toWarehouseId: '',
    qty: '',
    actualQty: '',
  });

  const [message, setMessage] = useState(null);
  const [isError, setIsError] = useState(false);

  const onChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleAction = async (action) => {
    try {
      const res = await action();
      setMessage(res.data.message || 'Berhasil');
      setIsError(false);
    } catch (err) {
      setMessage(
        err.response?.data?.message || 'Terjadi kesalahan'
      );
      setIsError(true);
    }
  };

  return (
    <div>
      <h2>📦 Inventory Management</h2>

      {/* MESSAGE */}
      {message && (
        <div
          style={{
            padding: 10,
            marginBottom: 20,
            color: isError ? 'red' : 'green',
            border: `1px solid ${isError ? 'red' : 'green'}`,
          }}
        >
          {message}
        </div>
      )}

      {/* INBOUND */}
      <section>
        <h3>Inbound</h3>
        <input name="productId" placeholder="Product ID" onChange={onChange} />
        <input name="warehouseId" placeholder="Warehouse ID" onChange={onChange} />
        <input name="qty" type="number" placeholder="Qty" onChange={onChange} />
        <button
          onClick={() =>
            handleAction(() =>
              inbound({
                productId: +form.productId,
                warehouseId: +form.warehouseId,
                qty: +form.qty,
              })
            )
          }
        >
          Inbound
        </button>
      </section>

      <hr />

      {/* OUTBOUND */}
      <section>
        <h3>Outbound</h3>
        <input name="productId" placeholder="Product ID" onChange={onChange} />
        <input name="warehouseId" placeholder="Warehouse ID" onChange={onChange} />
        <input name="qty" type="number" placeholder="Qty" onChange={onChange} />
        <button
          onClick={() =>
            handleAction(() =>
              outbound({
                productId: +form.productId,
                warehouseId: +form.warehouseId,
                qty: +form.qty,
              })
            )
          }
        >
          Outbound
        </button>
      </section>

      <hr />

      {/* TRANSFER */}
      <section>
        <h3>Transfer</h3>
        <input name="productId" placeholder="Product ID" onChange={onChange} />
        <input name="fromWarehouseId" placeholder="From Warehouse" onChange={onChange} />
        <input name="toWarehouseId" placeholder="To Warehouse" onChange={onChange} />
        <input name="qty" type="number" placeholder="Qty" onChange={onChange} />
        <button
          onClick={() =>
            handleAction(() =>
              transfer({
                productId: +form.productId,
                fromWarehouseId: +form.fromWarehouseId,
                toWarehouseId: +form.toWarehouseId,
                qty: +form.qty,
              })
            )
          }
        >
          Transfer
        </button>
      </section>

      <hr />

      {/* OPNAME */}
      <section>
        <h3>Stock Opname</h3>
        <input name="productId" placeholder="Product ID" onChange={onChange} />
        <input name="warehouseId" placeholder="Warehouse ID" onChange={onChange} />
        <input
          name="actualQty"
          type="number"
          placeholder="Qty Fisik"
          onChange={onChange}
        />
        <button
          onClick={() =>
            handleAction(() =>
              opname({
                productId: +form.productId,
                warehouseId: +form.warehouseId,
                actualQty: +form.actualQty,
              })
            )
          }
        >
          Opname
        </button>
      </section>
    </div>
  );
}
