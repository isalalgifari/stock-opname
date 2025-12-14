import { Link, useNavigate, useLocation } from 'react-router-dom';
import { getUser, logout } from '../utils/auth';
import { useEffect, useState } from 'react';

export default function Sidebar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setUser(getUser());
  }, [location.pathname]); 

  if (location.pathname === '/login') return null;
  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <aside className="sidebar">
      <h2>📦 Inventory</h2>

      <div style={{ marginBottom: 12 }}>
        👤 <b>Username: {user.username}</b><br />
        👤 <b>Role: { user.role}</b><br />
      </div>

      <nav>
        <Link to="/">Dashboard</Link>
        <Link to="/stocks">Stok</Link>

        {user.role === 'admin' && (
          <>
            <Link to="/products">Produk</Link>
            <Link to="/warehouses">Gudang</Link>
            <Link to="/users">User</Link>
          </>
        )}

        <button onClick={handleLogout}>Logout</button>
      </nav>
    </aside>
  );
}
