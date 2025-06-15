import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DashboardPage = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/giris');
      return;
    }

    // Projeleri backend'den çek
    const fetchProjects = async () => {
      try {
        const response = await fetch('https://klima-backend-ggo2.onrender.com/api/projects', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        console.log('Backendden gelen data:', data);  // Burada gelen veriyi kontrol edeceğiz

        if (!response.ok) {
          throw new Error(data.message || 'Projeler alınamadı.');
        }

        // Şimdilik direkt veriyi koyuyoruz, veri yapısına göre gerekirse burayı değiştiririz
        setProjects(data);
      } catch (err) {
        console.error('Hata:', err.message);
        alert('Projeler yüklenirken hata oluştu: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [navigate]);

  const handleNewProject = () => {
    navigate('/tasarim');
  };

  const handleEditProject = (projectId) => {
    navigate(`/tasarim?edit=${projectId}`);
  };

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm('Bu projeyi silmek istediğinize emin misiniz?')) return;

    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`https://klima-backend-ggo2.onrender.com/api/projects/${projectId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Silme işlemi başarısız.');
      }

      setProjects(prev => prev.filter(p => p._id !== projectId));
    } catch (err) {
      alert('Silme sırasında hata oluştu: ' + err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/giris');
  };

  return (
    <div style={{ padding: 20, maxWidth: 900, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2>📁 Kayıtlı Projeler</h2>
        <button
          onClick={handleLogout}
          style={{
            padding: '8px 16px',
            backgroundColor: '#e53935',
            color: '#fff',
            border: 'none',
            borderRadius: 5,
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          Çıkış Yap
        </button>
      </div>

      {loading ? (
        <p style={{ textAlign: 'center' }}>Yükleniyor...</p>
      ) : projects.length === 0 ? (
        <p style={{ textAlign: 'center' }}>Henüz kayıtlı proje yok.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 20 }}>
          {projects.map((proj) => (
            <div
              key={proj._id}
              style={{
                border: '1px solid #ddd',
                borderRadius: 8,
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                padding: 20,
                backgroundColor: '#fff',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'transform 0.2s',
                cursor: 'pointer',
              }}
              onClick={() => handleEditProject(proj._id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleEditProject(proj._id);
              }}
              role="button"
              tabIndex={0}
              aria-label={`Projeyi düzenle: ${proj.projectName || 'İsimsiz Proje'}`}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.03)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              <div>
                <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>{proj.projectName || 'İsimsiz Proje'}</h3>
                <p style={{ margin: '0 0 5px 0', color: '#555' }}><strong>Konum:</strong> {proj.location}</p>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#777' }}>
                  Oluşturulma Tarihi: {new Date(proj.createdAt).toLocaleString()}
                </p>
              </div>
              <div style={{ marginTop: 15, display: 'flex', justifyContent: 'space-between' }}>
                <button
                  onClick={(e) => { e.stopPropagation(); handleEditProject(proj._id); }}
                  style={{
                    backgroundColor: '#4caf50',
                    border: 'none',
                    color: 'white',
                    padding: '8px 12px',
                    borderRadius: 5,
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    flex: 1,
                    marginRight: 10,
                    transition: 'background-color 0.3s'
                  }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = '#45a049'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = '#4caf50'}
                >
                  Düzenle
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); handleDeleteProject(proj._id); }}
                  style={{
                    backgroundColor: '#f44336',
                    border: 'none',
                    color: 'white',
                    padding: '8px 12px',
                    borderRadius: 5,
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    flex: 1,
                    transition: 'background-color 0.3s'
                  }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = '#da190b'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = '#f44336'}
                >
                  Sil
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ textAlign: 'center', marginTop: 40 }}>
        <button
          onClick={handleNewProject}
          style={{
            fontSize: 18,
            padding: '12px 24px',
            borderRadius: 6,
            cursor: 'pointer',
            backgroundColor: '#1976d2',
            color: 'white',
            border: 'none',
            boxShadow: '0 3px 6px rgba(0,0,0,0.2)',
            transition: 'background-color 0.3s',
          }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = '#1565c0'}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = '#1976d2'}
        >
          ➕ Yeni Proje Ekle
        </button>
      </div>
    </div>
  );
};

export default DashboardPage;
