import React, { useState, useEffect, useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import citiesData from './data/CitiesData';
import SantralForm from './SantralForm';
import './App.css';

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from 'react-router-dom';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import HomePage from './pages/HomePage'; // ✅ Artık ayrı dosyadan geliyor
import { AuthProvider } from './context/AuthContext';

function createNewUnit(id) {
  return {
    id,
    type: '',
    fanFlow: '',
    fanPressure: '',
    aspFlow: '',
    aspPressure: '',
    heatingNeed: '',
    heatingType: '',
    heatingCapacity: '',
    coolingNeed: '',
    coolingType: '',
    coolingCapacity: '',
    humidNeed: '',
    humidType: '',
    humidCapacity: '',
    advancedEnabled: false,
    winterTemp: 22,
    summerTemp: 24,
    customWidth: '',
    customLength: '',
    customHeight: '',
    isHygienic: false,
    silencer: 'hayir',
    silencerFan: false,
    silencerExhaust: false,
    recoveryType: '',
    mixingType: '',
  };
}

function DesignPage() {
  const [projectName, setProjectName] = useState('');
  const [location, setLocation] = useState('');
  const [editingClimate, setEditingClimate] = useState(false);
  const [climateData, setClimateData] = useState({
    altitude: '',
    winterDB: '',
    summerDB: '',
    summerWB: '',
  });

  const [units, setUnits] = useState([createNewUnit(1)]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const pdfRef = useRef();

  const navigate = useNavigate();

  useEffect(() => {
    const selectedCity = citiesData.find(
      (city) => city.name === location.toUpperCase()
    );
    if (selectedCity) {
      setClimateData({
        altitude: selectedCity.altitude,
        winterDB: selectedCity.winterDB,
        summerDB: selectedCity.summerDB,
        summerWB: selectedCity.summerWB,
      });
    }
  }, [location]);

  const handleAddUnit = () => {
    const nextId = units.length + 1;
    setUnits([...units, createNewUnit(nextId)]);
  };

  const handleCopyUnit = (unitToCopy) => {
    const nextId = units.length + 1;
    const copiedUnit = { ...unitToCopy, id: nextId };
    setUnits([...units, copiedUnit]);
  };

  const handleUnitChange = (id, newData) => {
    setUnits(units.map((unit) => (unit.id === id ? { ...unit, ...newData } : unit)));
  };

  const handleFileUpload = (e) => {
    setUploadedFiles(e.target.files);
  };

  const generatePDF = () => {
    const input = pdfRef.current;
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
      heightLeft -= pdf.internal.pageSize.getHeight();

      while (heightLeft > 0) {
        position -= pdf.internal.pageSize.getHeight();
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
        heightLeft -= pdf.internal.pageSize.getHeight();
      }

      pdf.save('klima_santrali_tasarimi.pdf');
    });
  };

  const getUnitName = (id) => `KS-${id.toString().padStart(2, '0')}`;

  const handleSaveProject = async () => {
    const projectData = {
      projectName,
      location,
      altitude: Number(climateData.altitude),
      winterDryTemp: Number(climateData.winterDB),
      summerDryTemp: Number(climateData.summerDB),
      summerWetTemp: Number(climateData.summerWB),
      units,
      uploadedFiles: Array.from(uploadedFiles).map((f) => f.name),
      createdAt: new Date().toISOString(),
    };

    const token = localStorage.getItem('token');

    try {
      const response = await fetch('http://localhost:5000/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(projectData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Sunucu hatası:', errorData);
        throw new Error(errorData.message || 'Proje kaydedilemedi.');
      }

      alert('✅ Proje başarıyla kaydedildi!');
      // Kaydetme başarılıysa panel sayfasına yönlendir
      navigate('/panel');
    } catch (error) {
      alert('❌ Proje kaydedilirken hata oluştu: ' + error.message);
      console.error('Kaydetme hatası:', error);
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: '1400px', margin: 'auto' }}>
      <h1>Klima Santrali Tasarımı</h1>

      <div ref={pdfRef} className="pdf-section">
        <div className="form-row">
          <label>Proje İsmi:</label>
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="Proje ismi giriniz"
          />
        </div>

        <div className="form-row align-center">
          <label>Proje Konumu:</label>
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="location-select"
          >
            <option value="">Seçiniz</option>
            {citiesData.map((city, i) => (
              <option key={i} value={city.name}>
                {city.name}
              </option>
            ))}
          </select>

          {!editingClimate ? (
            <>
              <span className="climate-info">
                Rakım: {climateData.altitude} m | Kış KT: {climateData.winterDB} °C | Yaz
                KT: {climateData.summerDB} °C | Yaz YT: {climateData.summerWB} °C
              </span>
              <button className="btn-small" onClick={() => setEditingClimate(true)}>
                Değiştir
              </button>
            </>
          ) : (
            <div className="climate-edit">
              {['altitude', 'winterDB', 'summerDB', 'summerWB'].map((key, i) => (
                <div key={i}>
                  <label>{key}:</label>
                  <input
                    type="number"
                    value={climateData[key]}
                    onChange={(e) =>
                      setClimateData({ ...climateData, [key]: e.target.value })
                    }
                  />
                </div>
              ))}
              <button className="btn-small" onClick={() => setEditingClimate(false)}>
                Kaydet
              </button>
            </div>
          )}
        </div>

        {units.map((unit) => (
          <div key={unit.id} className="unit-card">
            <SantralForm
              unit={unit}
              onChange={(newData) => handleUnitChange(unit.id, newData)}
              onCopy={() => handleCopyUnit(unit)}
            />
            <button className="btn-copy" onClick={() => handleCopyUnit(unit)}>
              📝 {getUnitName(unit.id)} Santralini Kopyala
            </button>
          </div>
        ))}
      </div>

      <button className="btn-add" onClick={handleAddUnit}>
        ➕ Yeni Santral Ekle
      </button>

      <div className="file-upload-section">
        <h3>📎 İlgili Şartname/Proje Dökümanlarını Yükle</h3>
        <input
          type="file"
          multiple
          onChange={handleFileUpload}
          className="file-input"
        />
        {uploadedFiles.length > 0 && (
          <ul className="uploaded-file-list">
            {Array.from(uploadedFiles).map((file, index) => (
              <li key={index}>{file.name}</li>
            ))}
          </ul>
        )}
      </div>

      <div className="btn-group">
        <button className="btn-save" onClick={handleSaveProject}>
          💾 Projeyi Kaydet
        </button>
        <button className="btn-pdf" onClick={generatePDF}>
          📄 PDF Oluştur (Ekran Görüntüsü)
        </button>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/tasarim" element={<DesignPage />} />
          <Route path="/giris" element={<LoginPage />} />
          <Route path="/kayit" element={<RegisterPage />} />
          <Route path="/panel" element={<DashboardPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
