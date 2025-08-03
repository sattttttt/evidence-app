import { useState } from 'react';
import './LoginForm.css';

function LoginForm({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // 1. State baru untuk pesan error

  const handleSubmit = (event) => {
    event.preventDefault();
    setError(''); // 2. Hapus pesan error lama setiap kali tombol diklik

    // Simulasi pengecekan username dan password
    if (email === "othman" && password === "123") {
      onLoginSuccess();
    } else {
      // 3. Set pesan error baru jika login gagal (ganti alert)
      setError("Username atau password yang Anda masukkan salah.");
    }
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <h2>Silakan Login</h2>
      <div className="form-group">
        <label htmlFor="email">Username/Email</label>
        <input
          type="text"
          id="email"
          name="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </div>
      <button type="submit">Masuk</button>
      
      {/* 4. Tampilkan pesan error di sini jika state 'error' tidak kosong */}
      {error && <p className="error-message">{error}</p>}
    </form>
  );
}

export default LoginForm;