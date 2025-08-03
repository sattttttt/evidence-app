import React from 'react';
import LoginForm from '../components/LoginForm';

function LoginPage({ onLoginSuccess }) {
  return (
    <div className="login-page-container">
      <h1>EvidencesApp</h1>
      <LoginForm onLoginSuccess={onLoginSuccess} />
    </div>
  );
}

export default LoginPage;