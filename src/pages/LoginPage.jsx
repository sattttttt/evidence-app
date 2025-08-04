import React, { useState } from 'react';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';

// 1. Hapus onLoginSuccess dari sini
function LoginPage() {
  const [isRegistering, setIsRegistering] = useState(false);

  return (
    <div className="login-page-container">
      <h1>EvidenceApp</h1>
      
      {isRegistering ? (
        <RegisterForm onRegisterSuccess={() => setIsRegistering(false)} />
      ) : (
        // 2. Hapus prop onLoginSuccess dari sini
        <LoginForm />
      )}

      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        {isRegistering ? (
          <p>
            Sudah punya akun?{' '}
            <button className="toggle-button" onClick={() => setIsRegistering(false)}>
              Masuk di sini
            </button>
          </p>
        ) : (
          <p>
            Belum punya akun?{' '}
            <button className="toggle-button" onClick={() => setIsRegistering(true)}>
              Daftar di sini
            </button>
          </p>
        )}
      </div>
    </div>
  );
}

export default LoginPage;