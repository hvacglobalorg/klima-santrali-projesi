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
        <div key={idx} style={{ border: '1px solid #ccc', borderRadius: 6, marginBottom: 20, padding: 15 }}>
          <h3>{user.username} ({user.email})</h3>
          {user.projects.length === 0 ? (
            <p>Proje yok.</p>
          ) : (
            <ul>
              {user.projects.map(p => (
                <li key={p._id}>
                  <strong>{p.projectName}</strong> - {p.location}
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
