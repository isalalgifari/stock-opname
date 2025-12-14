import { useEffect, useState } from 'react';
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from '../services/userApi';

export default function UserPage() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    username: '',
    password: '',
    nama: '',
    role: '',
  });

  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const load = async () => {
    try {
      const res = await getUsers();
      setUsers(res.data);
    } catch {
      setError('Gagal mengambil data user');
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      if (editId) {
        const payload = { ...form };
        if (!payload.password) delete payload.password;

        await updateUser(editId, payload);
        setMessage('User berhasil diupdate');
        setEditId(null);
      } else {
        await createUser(form);
        setMessage('User berhasil ditambahkan');
      }

      setForm({
        username: '',
        password: '',
        nama: '',
        role: '',
      });
      load();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Gagal menyimpan data user'
      );
    }
  };

  const edit = (u) => {
    setEditId(u.id);
    setForm({
      username: u.username,
      password: '',
      nama: u.nama,
      role: u.role,
    });
  };

  const remove = async (id) => {
    if (!confirm('Hapus user ini?')) return;

    setMessage('');
    setError('');

    try {
      await deleteUser(id);
      setMessage('User berhasil dihapus');
      load();
    } catch {
      setError('Gagal menghapus user');
    }
  };

  const cancelEdit = () => {
    setEditId(null);
    setForm({
      username: '',
      password: '',
      nama: '',
      role: '',
    });
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div style={{ maxWidth: 800 }}>
      <h2>👤 Users</h2>

      {message && (
        <div style={{ color: 'green' }}>{message}</div>
      )}
      {error && (
        <div style={{ color: 'red' }}>{error}</div>
      )}

      <form onSubmit={submit}>
        <input
          placeholder="Username"
          value={form.username}
          onChange={(e) =>
            setForm({ ...form, username: e.target.value })
          }
        />

        <input
          type="password"
          placeholder={
            editId
              ? 'Password (kosongkan jika tidak diubah)'
              : 'Password'
          }
          value={form.password}
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        <input
          placeholder="Nama"
          value={form.nama}
          onChange={(e) =>
            setForm({ ...form, nama: e.target.value })
          }
        />

        <select
          value={form.role}
          onChange={(e) =>
            setForm({ ...form, role: e.target.value })
          }
        >
          <option value="">-- Pilih Role --</option>
          <option value="admin">Admin</option>
          <option value="staff">Staff</option>
        </select>

        <button type="submit">
          {editId ? 'Update' : 'Simpan'}
        </button>

        {editId && (
          <button type="button" onClick={cancelEdit}>
            Batal
          </button>
        )}
      </form>

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Username</th>
            <th>Nama</th>
            <th>Role</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.username}</td>
              <td>{u.nama}</td>
              <td>{u.role}</td>
              <td>
                <button onClick={() => edit(u)}>
                  Edit
                </button>
                <button onClick={() => remove(u.id)}>
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
