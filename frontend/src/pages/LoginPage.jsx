import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { setUser, getUser } from '../utils/auth';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (getUser()) {
      navigate('/', { replace: true });
    }
  }, []);

  const submit = (e) => {
    e.preventDefault();
    setError('');

    if (username === 'admin') {
      setUser({ username, role: 'admin' });
      navigate('/', { replace: true });
    } else if (username === 'staff') {
      setUser({ username, role: 'staff' });
      navigate('/', { replace: true });
    } else {
      setError('Username atau password salah');
    }
  };

  return (
    <div style={{ maxWidth: 300, margin: '100px auto' }}>
      <h2>🔐 Login</h2>

      {error && <div style={{ color: 'red' }}>{error}</div>}

      <form onSubmit={submit}>
        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br></br>
        <button>Login</button>
      </form>
    </div>
  );
}
