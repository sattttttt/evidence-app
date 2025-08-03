import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth'; // Impor fungsi login Firebase
import { auth } from '../firebaseConfig'; // Impor konfigurasi auth kita
import './LoginForm.css';

function LoginForm({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    try {
      // Coba login menggunakan Firebase Auth
      await signInWithEmailAndPassword(auth, email, password);
      onLoginSuccess(); // Panggil fungsi jika login berhasil
    } catch (firebaseError) {
      // Tangkap dan tampilkan pesan error dari Firebase
      setError("Email atau password salah.");
      console.error("Firebase login error:", firebaseError);
    }
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <h2>Silakan Login</h2>
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          type="email"
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
      {error && <p className="error-message">{error}</p>}
    </form>
  );
}

export default LoginForm;