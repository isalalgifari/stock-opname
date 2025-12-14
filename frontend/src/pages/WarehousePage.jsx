import { useEffect, useState } from 'react';
import {
  getWarehouses,
  createWarehouse,
  updateWarehouse,
  deleteWarehouse,
} from '../services/warehouseApi';

export default function WarehousePage() {
  const [data, setData] = useState([]);
  const [form, setForm] = useState({
    nama: '',
    kode: '',
    lokasi: '',
  });

  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const load = async () => {
    try {
      const res = await getWarehouses();
      setData(res.data);
    } catch {
      setError('Gagal mengambil data gudang');
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      if (editId) {
        await updateWarehouse(editId, form);
        setMessage('Gudang berhasil diupdate');
        setEditId(null);
      } else {
        await createWarehouse(form);
        setMessage('Gudang berhasil ditambahkan');
      }

      setForm({ nama: '', kode: '', lokasi: '' });
      load();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Gagal menyimpan data gudang'
      );
    }
  };

  const edit = (w) => {
    setEditId(w.id);
    setForm({
      nama: w.nama,
      kode: w.kode,
      lokasi: w.lokasi,
    });
  };

  const remove = async (id) => {
    if (!confirm('Hapus gudang ini?')) return;

    setMessage('');
    setError('');

    try {
      await deleteWarehouse(id);
      setMessage('Gudang berhasil dihapus');
      load();
    } catch {
      setError('Gagal menghapus gudang');
    }
  };

  const cancelEdit = () => {
    setEditId(null);
    setForm({ nama: '', kode: '', lokasi: '' });
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <>
      <h2>🏭 Gudang</h2>

      {/* MESSAGE */}
      {message && (
        <div style={{ color: 'green', marginBottom: 10 }}>
          {message}
        </div>
      )}
      {error && (
        <div style={{ color: 'red', marginBottom: 10 }}>
          {error}
        </div>
      )}

      <form onSubmit={submit}>
        <input
          placeholder="Nama"
          value={form.nama}
          onChange={(e) =>
            setForm({ ...form, nama: e.target.value })
          }
        />
        <input
          placeholder="Kode"
          value={form.kode}
          onChange={(e) =>
            setForm({ ...form, kode: e.target.value })
          }
        />
        <input
          placeholder="Lokasi"
          value={form.lokasi}
          onChange={(e) =>
            setForm({ ...form, lokasi: e.target.value })
          }
        />

        <button type="submit">
          {editId ? 'Update' : 'Simpan'}
        </button>

        {editId && (
          <button
            type="button"
            onClick={cancelEdit}
            style={{ marginLeft: 8 }}
          >
            Batal
          </button>
        )}
      </form>

      <ul>
        {data.map((w) => (
          <li key={w.id}>
            {w.nama} ({w.kode}) - {w.lokasi}
            <button onClick={() => edit(w)}>
              Edit
            </button>
            <button onClick={() => remove(w.id)}>
              Hapus
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}
