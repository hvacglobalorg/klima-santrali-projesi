import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', position: 'relative', padding: '2rem', background: 'linear-gradient(to bottom right, #c3dafe, #e0e7ff)' }}>
      
      {/* Sağ üstte Hesabım butonu */}
      <div style={{ position: 'absolute', top: 20, right: 20 }}>
        <button
          onClick={() => navigate('/giris')}
          style={{
            backgroundColor: '#2563eb',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: 6,
            cursor: 'pointer',
            fontWeight: '600',
            boxShadow: '0 2px 6px rgba(37, 99, 235, 0.5)',
            transition: 'background-color 0.3s',
          }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = '#1d4ed8'}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = '#2563eb'}
        >
          Hesabım
        </button>
      </div>

      {/* Sayfa içeriği */}
      <div style={{ maxWidth: 700, margin: 'auto', textAlign: 'center', paddingTop: 80 }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 'bold', color: '#1e293b', marginBottom: 20 }}>
          HVAC Seçim Platformu
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#475569', marginBottom: 40 }}>
          Klima santrali başta olmak üzere çeşitli HVAC ekipmanlarını seçmek için online seçim aracımızı kullanın.
          Kayıt olmadan klima santrali tasarlayabilir, giriş yaparak projelerinizi saklayabilirsiniz.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 20 }}>
          <button
            onClick={() => navigate('/tasarim')}
            style={{
              backgroundColor: '#2563eb',
              color: 'white',
              border: 'none',
              padding: '14px 28px',
              borderRadius: 8,
              cursor: 'pointer',
              fontWeight: '600',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.6)',
              transition: 'background-color 0.3s',
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#1d4ed8'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#2563eb'}
          >
            Klima Santrali Seçimi
          </button>
          <button
            onClick={() => navigate('/giris')}
            style={{
              border: '2px solid #2563eb',
              color: '#2563eb',
              background: 'white',
              padding: '14px 28px',
              borderRadius: 8,
              cursor: 'pointer',
              fontWeight: '600',
              transition: 'background-color 0.3s, color 0.3s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = '#2563eb';
              e.currentTarget.style.color = 'white';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = 'white';
              e.currentTarget.style.color = '#2563eb';
            }}
          >
            Giriş Yap
          </button>
          <button
            onClick={() => navigate('/kayit')}
            style={{
              border: '2px solid #2563eb',
              color: '#2563eb',
              background: 'white',
              padding: '14px 28px',
              borderRadius: 8,
              cursor: 'pointer',
              fontWeight: '600',
              transition: 'background-color 0.3s, color 0.3s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = '#2563eb';
              e.currentTarget.style.color = 'white';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = 'white';
              e.currentTarget.style.color = '#2563eb';
            }}
          >
            Kayıt Ol
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
