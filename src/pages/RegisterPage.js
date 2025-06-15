import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  const validationErrors = {};

  if (!formData.email.trim()) {
    validationErrors.email = 'E-posta zorunludur.';
  } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    validationErrors.email = 'Geçerli bir e-posta giriniz.';
  }

  if (!formData.password) {
    validationErrors.password = 'Şifre zorunludur.';
  } else if (formData.password.length < 6) {
    validationErrors.password = 'Şifre en az 6 karakter olmalı.';
  }

  if (!formData.confirmPassword) {
    validationErrors.confirmPassword = 'Şifre tekrar zorunludur.';
  } else if (formData.password !== formData.confirmPassword) {
    validationErrors.confirmPassword = 'Şifreler uyuşmuyor.';
  }

  if (Object.keys(validationErrors).length > 0) {
    setErrors(validationErrors);
    return;
  }

  try {
    const response = await fetch('https://klima-backend-ggo2.onrender.com/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: formData.email,
        password: formData.password
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      setErrors({ general: data.message || 'Kayıt başarısız oldu.' });
      return;
    }

    alert('Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz.');
    navigate('/giris');

  } catch (error) {
    setErrors({ general: 'Sunucuya bağlanırken hata oluştu.' });
  }
};

  return (
    <div style={{
      maxWidth: '400px',
      margin: '50px auto',
      padding: '20px',
      border: '1px solid #ccc',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      fontFamily: 'Arial, sans-serif',
    }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Kayıt Ol</h2>

      <form onSubmit={handleSubmit} noValidate>
        {errors.general && (
          <p style={{ color: 'red', textAlign: 'center', marginBottom: '10px' }}>
            {errors.general}
          </p>
        )}

        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="email">E-posta:</label><br />
          <input
            id="email"
            type="email"
            name="email"
            placeholder="E-posta adresinizi girin"
            value={formData.email}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '8px',
              fontSize: '14px',
              borderRadius: '4px',
              border: errors.email ? '1px solid red' : '1px solid #ccc',
            }}
          />
          {errors.email && <p style={{ color: 'red', marginTop: '5px' }}>{errors.email}</p>}
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="password">Şifre:</label><br />
          <input
            id="password"
            type="password"
            name="password"
            placeholder="Şifrenizi girin"
            value={formData.password}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '8px',
              fontSize: '14px',
              borderRadius: '4px',
              border: errors.password ? '1px solid red' : '1px solid #ccc',
            }}
          />
          {errors.password && <p style={{ color: 'red', marginTop: '5px' }}>{errors.password}</p>}
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="confirmPassword">Şifre Tekrar:</label><br />
          <input
            id="confirmPassword"
            type="password"
            name="confirmPassword"
            placeholder="Şifrenizi tekrar girin"
            value={formData.confirmPassword}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '8px',
              fontSize: '14px',
              borderRadius: '4px',
              border: errors.confirmPassword ? '1px solid red' : '1px solid #ccc',
            }}
          />
          {errors.confirmPassword && <p style={{ color: 'red', marginTop: '5px' }}>{errors.confirmPassword}</p>}
        </div>

        <button
          type="submit"
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#28a745',
            color: 'white',
            fontSize: '16px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Kayıt Ol
        </button>
      </form>

      <p style={{
        marginTop: '15px',
        textAlign: 'center',
        fontSize: '0.9rem',
        color: '#555'
      }}>
        Zaten hesabın var mı?{' '}
        <button
          onClick={() => navigate('/giris')}
          style={{
            color: '#28a745',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            textDecoration: 'underline',
            padding: 0,
            fontWeight: '600',
          }}
          type="button"
        >
          Giriş Yap
        </button>
      </p>
    </div>
  );
};

export default RegisterPage;
