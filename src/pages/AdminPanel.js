import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminPanel = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return navigate('/giris');

    fetch('https://klima-backend-ggo2.onrender.com/api/admin/users-projects', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error('Yetki yok veya sunucu hatası');
        return res.json();
      })
      .then(setData)
      .catch(() => {
        alert('Yetkisiz erişim veya oturum süresi doldu.');
        navigate('/giris');
      });
  }, [navigate]);

  return (
    <div style={{ padding: 30 }}>
      <h2>🔐 Admin Paneli</h2>
      {data.map((user, idx) => (
        <div
          key={idx}
          style={{
            border: '1px solid #ccc',
            borderRadius: 6,
            marginBottom: 25,
            padding: 15,
            background: '#f9f9f9',
          }}
        >
          <h3>{user.username} ({user.email})</h3>
          {user.projects.length === 0 ? (
            <p style={{ fontStyle: 'italic', color: '#777' }}>Hiç proje kaydetmemiş.</p>
          ) : (
            <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
              {user.projects.map((p, i) => (
                <li
                  key={p._id}
                  style={{
                    border: '1px solid #ddd',
                    borderRadius: 5,
                    padding: 10,
                    marginBottom: 10,
                    backgroundColor: '#fff',
                  }}
                >
                  <div>
                    <strong>{p.projectName}</strong> – {p.location}
                    <button
                      onClick={() => navigate(`/tasarim?edit=${p._id}`)}
                      style={{
                        marginLeft: 10,
                        padding: '4px 10px',
                        fontSize: '0.85rem',
                        borderRadius: 4,
                        border: 'none',
                        backgroundColor: '#4caf50',
                        color: 'white',
                        cursor: 'pointer'
                      }}
                    >
                      Düzenle
                    </button>
                  </div>

                  {/* Yüklenen dosyalar */}
                  {Array.isArray(p.uploadedFiles) && p.uploadedFiles.length > 0 && (
                    <ul style={{ marginTop: 8, marginLeft: 10, fontSize: '0.9rem' }}>
                      {p.uploadedFiles.map((file, j) => (
                        <li key={j}>
                          <a
                            href={`https://klima-backend-ggo2.onrender.com/uploads/${file}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            📎 {file}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
};

export default AdminPanel;
