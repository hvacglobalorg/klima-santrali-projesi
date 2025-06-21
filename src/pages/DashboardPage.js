import React, { useEffect, useState } from 'react';
import './DashboardPage.css';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';  // named import olarak


const DashboardPage = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [username, setUsername] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [showUsernameModal, setShowUsernameModal] = useState(false);
const [newUsername, setNewUsername] = useState('');


const toggleDropdown = () => {
  setShowDropdown((prev) => !prev);
};

const handleAccountOption = (option) => {
  setShowDropdown(false);
  if (option === 'profile') {
    navigate('/panel');
  } else if (option === 'username') {
    setShowUsernameModal(true); // <<< değişti
  } else if (option === 'password') {
    alert('Şifre değiştirme yakında!');
  }
};



// Dış tıklamada dropdown menüyü kapat
useEffect(() => {
  const handleClickOutside = (event) => {
    if (!event.target.closest('.user-dropdown')) {
      setShowDropdown(false);
    }
  };

  document.addEventListener('mousedown', handleClickOutside);
  return () => {
    document.removeEventListener('mousedown', handleClickOutside);
  };
}, []);


  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/giris');
      return;
    }

    try {
      const decoded = jwtDecode(token);
       console.log('📦 JWT içeriği:', decoded); // burayı konsolda kontrol et
      setUsername(decoded.username || '');
    } catch (error) {
      console.error('Token decode edilirken hata:', error);
      // Token geçersizse çıkış yap
      localStorage.removeItem('token');
      navigate('/giris');
      return;
    }

    const fetchProjects = async () => {
      try {
        const response = await fetch('https://klima-backend-ggo2.onrender.com/api/projects', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 401) {
          alert('Oturumunuz sona erdi. Lütfen tekrar giriş yapınız.');
          localStorage.removeItem('token');
          navigate('/giris');
          return;
        }

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Projeler alınamadı.');
        }

        setProjects(data);
      } catch (err) {
        alert('Projeler yüklenirken hata oluştu: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [navigate]);

  const handleCreateProject = async (redirectToDesign = false) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Giriş yapmanız gerekiyor.');
      navigate('/giris');
      return;
    }

    if (!newProjectName.trim()) {
      alert('Lütfen proje adını girin.');
      return;
    }

    const newProject = {
      projectName: newProjectName.trim(),
      location: 'Belirtilmedi',
    };

    try {
      const response = await fetch('https://klima-backend-ggo2.onrender.com/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newProject),
      });

      if (response.status === 401) {
        alert('Oturumunuz sona erdi. Lütfen tekrar giriş yapınız.');
        localStorage.removeItem('token');
        navigate('/giris');
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Proje oluşturulamadı.');
      }

      setProjects(prev => [data.project, ...prev]);
      setShowModal(false);
      setNewProjectName('');
      localStorage.setItem('activeProjectId', data.project._id);

      if (redirectToDesign) {
        navigate(`/tasarim?edit=${data.project._id}`);
      }
    } catch (err) {
      alert('Proje oluşturulurken hata oluştu: ' + err.message);
    }
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
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 401) {
        alert('Oturumunuz sona erdi. Lütfen tekrar giriş yapınız.');
        localStorage.removeItem('token');
        navigate('/giris');
        return;
      }

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Silme işlemi başarısız.');
      }

      setProjects(prev => prev.filter(p => p._id !== projectId));
    } catch (err) {
      alert('Silme sırasında hata oluştu: ' + err.message);
    }
  };

  const handleUsernameChange = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    alert('Giriş yapmanız gerekiyor.');
    return;
  }

  try {
    const response = await fetch('https://klima-backend-ggo2.onrender.com/api/auth/change-username', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ newUsername }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Kullanıcı adı değiştirilemedi.');
    }

    alert('Kullanıcı adınız başarıyla değiştirildi.');
    setUsername(newUsername);
    setShowUsernameModal(false);
    setNewUsername('');
  } catch (error) {
    alert('Hata oluştu: ' + error.message);
  }
};


  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/giris');
  };

 return (
  <div style={{ padding: 20, maxWidth: 900, margin: '0 auto', position: 'relative' }}>
    {/* Başlık ve Kullanıcı + Çıkış Butonu yatay hizalı */}
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
      <h2>📁 Kayıtlı Projeler</h2>

      {/* Kullanıcı açılır menü kutusu */}
      <div className="user-dropdown" style={{ position: 'relative' }}>
  <div onClick={toggleDropdown} className="user-dropdown-toggle">

    <span>Hoşgeldin, {username || 'Ziyaretçi'}</span>
    <span style={{ fontSize: '1.2rem' }}>▼</span>
  </div>


      {showDropdown && (
  <div className="user-dropdown-menu">

    {[
      { label: '🧾 Hesabım', action: 'profile' },
      { label: '✏️ Kullanıcı Adı Değiştir', action: 'username' },
      { label: '🔑 Şifre Değiştir', action: 'password' },
    ].map((item, i) => (
      <button
  key={i}
  onClick={() => handleAccountOption(item.action)}
  className="user-dropdown-button"
>

        {item.label}
      </button>
    ))}

    <button onClick={handleLogout} className="user-dropdown-button user-dropdown-logout">

      🚪 Çıkış Yap
    </button>
  </div>
)}


          
        </div>
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
            >
              <div>
                <h3>{proj.projectName || 'İsimsiz Proje'}</h3>
                <p>
                  <strong>Konum:</strong> {proj.location}
                </p>
                <p style={{ fontSize: '0.85rem', color: '#777' }}>
                  Oluşturulma: {new Date(proj.createdAt).toLocaleString()}
                </p>
              </div>
              <div style={{ marginTop: 15, display: 'flex', justifyContent: 'space-between' }}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditProject(proj._id);
                  }}
                  style={{
                    backgroundColor: '#4caf50',
                    color: 'white',
                    padding: '8px 12px',
                    border: 'none',
                    borderRadius: 5,
                    cursor: 'pointer',
                    flex: 1,
                    marginRight: 10,
                  }}
                >
                  Düzenle
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteProject(proj._id);
                  }}
                  style={{
                    backgroundColor: '#f44336',
                    color: 'white',
                    padding: '8px 12px',
                    border: 'none',
                    borderRadius: 5,
                    cursor: 'pointer',
                    flex: 1,
                  }}
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
          onClick={() => setShowModal(true)}
          style={{
            fontSize: 18,
            padding: '12px 24px',
            borderRadius: 6,
            cursor: 'pointer',
            backgroundColor: '#1976d2',
            color: 'white',
            border: 'none',
          }}
        >
          ➕ Yeni Proje Ekle
        </button>
      </div>

     {/* MODAL */}
{showModal && (
  <div
    style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    <div
      style={{
        backgroundColor: '#fff',
        padding: 30,
        borderRadius: 10,
        width: '90%',
        maxWidth: 420,
        textAlign: 'center',
      }}
    >
      <h3 style={{ marginBottom: 15 }}>📝 Yeni Proje Oluştur</h3>
      <input
        type="text"
        value={newProjectName}
        onChange={(e) => setNewProjectName(e.target.value)}
        placeholder="Proje adı giriniz"
        style={{
          width: '100%',
          padding: 12,
          marginBottom: 20,
          borderRadius: 5,
          border: '1px solid #ccc',
        }}
      />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <button
          onClick={() => handleCreateProject(true)}
          style={{
            padding: 12,
            backgroundColor: '#4caf50',
            color: 'white',
            border: 'none',
            borderRadius: 6,
            cursor: 'pointer',
            fontSize: 16,
          }}
        >
          ➕ Klima Santrali Ekle
        </button>
        <button disabled style={{ padding: 12, backgroundColor: '#ccc', border: 'none', borderRadius: 6, cursor: 'not-allowed', fontSize: 16 }}>
          ♻️ Isı Geri Kazanım Cihazı (yakında)
        </button>
        <button disabled style={{ padding: 12, backgroundColor: '#ccc', border: 'none', borderRadius: 6, cursor: 'not-allowed', fontSize: 16 }}>
          🌬️ Aspiratör (yakında)
        </button>
        <button disabled style={{ padding: 12, backgroundColor: '#ccc', border: 'none', borderRadius: 6, cursor: 'not-allowed', fontSize: 16 }}>
          💨 Fan-Coil (yakında)
        </button>
      </div>
      <hr style={{ margin: '20px 0' }} />
      <button
        onClick={() => handleCreateProject(false)}
        style={{
          marginTop: 10,
          padding: 10,
          backgroundColor: '#1976d2',
          color: 'white',
          border: 'none',
          borderRadius: 6,
          fontSize: 16,
          cursor: 'pointer',
        }}
      >
        💾 Sadece Projeyi Kaydet
      </button>
      <br />
      <button
        onClick={() => setShowModal(false)}
        style={{
          marginTop: 10,
          background: 'none',
          border: 'none',
          color: '#555',
          cursor: 'pointer',
          textDecoration: 'underline',
        }}
      >
        Vazgeç
      </button>
    </div>
  </div>
)}

{/* 👤 Kullanıcı Adı Değiştir MODAL */}
{showUsernameModal && (
  <div
    style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 999,
    }}
  >
    <div
      style={{
        backgroundColor: '#fff',
        padding: 30,
        borderRadius: 10,
        width: '90%',
        maxWidth: 400,
        textAlign: 'center',
      }}
    >
      <h3 style={{ marginBottom: 15 }}>👤 Yeni Kullanıcı Adı</h3>
      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
  <input
    type="text"
    value={newUsername}
    onChange={(e) => setNewUsername(e.target.value)}
    placeholder="Yeni kullanıcı adınızı girin"
    style={{
      flex: 1,
      padding: 12,
      borderRadius: 5,
      border: '1px solid #ccc',
    }}
  />
  <button
    onClick={handleUsernameChange}
    style={{
      padding: '12px 20px',
      backgroundColor: '#1976d2',
      color: 'white',
      border: 'none',
      borderRadius: 5,
      fontSize: 14,
      cursor: 'pointer',
      whiteSpace: 'nowrap',
    }}
  >
    Kaydet
  </button>
</div>

      <br />
      <button
        onClick={() => setShowUsernameModal(false)}
        style={{
          marginTop: 10,
          background: 'none',
          border: 'none',
          color: '#555',
          cursor: 'pointer',
          textDecoration: 'underline',
        }}
      >
        Vazgeç
      </button>
    </div>
  </div>
)}
</div>
);
};

export default DashboardPage;
