import { useEffect, useState } from 'react';
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../services/productApi';

export default function ProductPage() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    nama: '',
    sku: '',
    harga: '',
  });
  const [editId, setEditId] = useState(null);

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const loadData = async () => {
    try {
      const res = await getProducts();
      setProducts(res.data);
    } catch (err) {
      setError('Gagal mengambil data produk');
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      if (editId) {
        await updateProduct(editId, form);
        setMessage('Produk berhasil diupdate');
        setEditId(null);
      } else {
        await createProduct(form);
        setMessage('Produk berhasil ditambahkan');
      }

      setForm({ nama: '', sku: '', harga: '' });
      loadData();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Terjadi kesalahan saat menyimpan data'
      );
    }
  };

  const edit = (p) => {
    setEditId(p.id);
    setForm({
      nama: p.nama,
      sku: p.sku,
      harga: p.harga,
    });
  };

  const remove = async (id) => {
    if (!confirm('Hapus produk ini?')) return;

    setMessage('');
    setError('');

    try {
      await deleteProduct(id);
      setMessage('Produk berhasil dihapus');
      loadData();
    } catch (err) {
      setError('Gagal menghapus produk');
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div style={{ maxWidth: 800, margin: '40px auto' }}>
      <h2>📦 CRUD Produk</h2>

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
          placeholder="SKU"
          value={form.sku}
          onChange={(e) =>
            setForm({ ...form, sku: e.target.value })
          }
        />
        <input
          type="number"
          placeholder="Harga"
          value={form.harga}
          onChange={(e) =>
            setForm({ ...form, harga: e.target.value })
          }
        />
        <button>
          {editId ? 'Update' : 'Simpan'}
        </button>
      </form>

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Nama</th>
            <th>SKU</th>
            <th>Harga</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td>{p.nama}</td>
              <td>{p.sku}</td>
              <td>
                Rp {Number(p.harga).toLocaleString('id-ID')}
              </td>
              <td>
                <button onClick={() => edit(p)}>
                  Edit
                </button>
                <button onClick={() => remove(p.id)}>
                  Hapus
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
