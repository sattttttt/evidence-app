import { useState } from 'react';
import { createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';
import './LoginForm.css';

function RegisterForm({ onRegisterSuccess }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Waspang');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // 1. Buat akun di Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Simpan data tambahan (nama, role) ke Firestore Database
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: name,
        email: email,
        role: role,
      });
      
      // 3. Logout pengguna saat ini agar mereka harus login manual
      await signOut(auth);

      // Beri notifikasi sukses
      alert("Registrasi berhasil! Silakan login dengan akun yang baru saja Anda daftarkan.");

      // Panggil fungsi untuk kembali ke form login
      onRegisterSuccess();

    } catch (firebaseError) {
      if (firebaseError.code === 'auth/email-already-in-use') {
        setError("Email ini sudah terdaftar.");
      } else {
        setError("Gagal mendaftarkan akun. Pastikan password minimal 6 karakter.");
      }
      console.error("Firebase register error:", firebaseError);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <h2>Daftar Akun Baru</h2>
      <div className="form-group">
        <label htmlFor="name">Nama Lengkap</label>
        <input type="text" id="name" required value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input type="email" id="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input type="password" id="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <div className="form-group">
        <label htmlFor="role">Peran Anda</label>
        <select id="role" value={role} onChange={(e) => setRole(e.target.value)} className="role-select">
          <option value="Waspang">Waspang (Pengawas Lapangan)</option>
          <option value="Staff Admin">Staff Admin</option>
        </select>
      </div>
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Mendaftarkan...' : 'Daftar'}
      </button>
      {error && <p className="error-message">{error}</p>}
    </form>
  );
}

export default RegisterForm;