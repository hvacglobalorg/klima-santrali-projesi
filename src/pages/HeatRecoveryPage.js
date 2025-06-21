// src/pages/HeatRecoveryPage.js
import React, { useState, useEffect, useRef } from 'react';
import HeatRecoveryForm from '../components/HeatRecoveryForm';
import citiesData from '../data/CitiesData';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useNavigate, useLocation } from 'react-router-dom';

const API_BASE_URL = 'https://klima-backend-ggo2.onrender.com';

function HeatRecoveryPage() {
  const [projectName, setProjectName] = useState('');
  const [location, setLocation] = useState('');
  const [editingClimate, setEditingClimate] = useState(false);
  const [climateData, setClimateData] = useState({
    altitude: '',
    winterDB: '',
    summerDB: '',
    summerWB: '',
  });

  const [units, setUnits] = useState([{ id: 1 }]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const pdfRef = useRef();

  const navigate = useNavigate();
  const locationState = useLocation();
  const queryParams = new URLSearchParams(locationState.search);
  const editProjectId = queryParams.get('edit');

  useEffect(() => {
    if (editProjectId) {
      const token = localStorage.getItem('token');
      fetch(`${API_BASE_URL}/api/projects/${editProjectId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setProjectName(data.projectName || '');
          setLocation(data.location || '');
          setClimateData({
            altitude: data.altitude || '',
            winterDB: data.winterDryTemp || '',
            summerDB: data.summerDryTemp || '',
            summerWB: data.summerWetTemp || '',
          });
          if (Array.isArray(data.units)) {
            const processed = data.units.map((u, i) => ({ ...u, id: u.id ?? i + 1 }));
            setUnits(processed);
          }
          setUploadedFiles(data.uploadedFiles || []);
        });
    }
  }, [editProjectId]);

  useEffect(() => {
    const city = citiesData.find((c) => c.name === location.toUpperCase());
    if (city) {
      setClimateData({
        altitude: city.altitude,
        winterDB: city.winterDB,
        summerDB: city.summerDB,
        summerWB: city.summerWB,
      });
    }
  }, [location]);

  const handleUnitChange = (id, newData) => {
    setUnits(units.map((u) => (u.id === id ? { ...u, ...newData } : u)));
  };

  const handleCopyUnit = (unit) => {
    const newId = units.length + 1;
    setUnits([...units, { ...unit, id: newId }]);
  };

  const handleFileUpload = async (e) => {
    const files = e.target.files;
    const formData = new FormData();

    for (let file of files) {
      if (file.size > 5 * 1024 * 1024) {
        alert(`${file.name} dosyası 5 MB'tan büyük.`);
        return;
      }
      formData.append('files', file);
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/upload`, {
        method: 'POST',
        body: formData,
      });
      const result = await res.json();
      setUploadedFiles(result.uploadedFiles);
    } catch (err) {
      alert('Yükleme başarısız.');
    }
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

      pdf.save('isi_geri_kazanim_cihazi.pdf');
    });
  };

  const handleSaveProject = async () => {
    const data = {
      projectName,
      location,
      altitude: Number(climateData.altitude),
      winterDryTemp: Number(climateData.winterDB),
      summerDryTemp: Number(climateData.summerDB),
      summerWetTemp: Number(climateData.summerWB),
      units,
      uploadedFiles,
      updatedAt: new Date().toISOString(),
    };

    const token = localStorage.getItem('token');
    const method = editProjectId ? 'PUT' : 'POST';
    const endpoint = editProjectId
      ? `${API_BASE_URL}/api/projects/${editProjectId}`
      : `${API_BASE_URL}/api/projects`;

    try {
      const res = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Proje kaydedilemedi');
      alert('✅ Proje kaydedildi.');
      navigate('/panel');
    } catch (err) {
      alert('❌ Kayıt hatası: ' + err.message);
    }
  };

  const getUnitName = (id) => `IGK-${id.toString().padStart(2, '0')}`;

  return (
    <div style={{ padding: 20, maxWidth: 1400, margin: 'auto' }}>
      <h1>Isı Geri Kazanım Cihazı</h1>

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
                Rakım: {climateData.altitude} m | Kış KT: {climateData.winterDB} °C | Yaz KT: {climateData.summerDB} °C | Yaz YT: {climateData.summerWB} °C
              </span>
              <button className="btn-small" onClick={() => setEditingClimate(true)}>
                Değiştir
              </button>
            </>
          ) : (
            <div className="climate-edit">
              {['altitude', 'winterDB', 'summerDB', 'summerWB'].map((key) => (
                <div key={key}>
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
            <HeatRecoveryForm
              unit={unit}
              onChange={(newData) => handleUnitChange(unit.id, newData)}
              onCopy={() => handleCopyUnit(unit)}
            />
            <button className="btn-copy" onClick={() => handleCopyUnit(unit)}>
              📝 {getUnitName(unit.id)} Cihazını Kopyala
            </button>
          </div>
        ))}
      </div>

      <button className="btn-add" onClick={() => setUnits([...units, { id: units.length + 1 }])}>
        ➕ Yeni IGK Cihazı Ekle
      </button>

      <div className="file-upload-section">
        <h3>📎 İlgili Şartname/Proje Dökümanlarını Yükle</h3>
        <input type="file" multiple onChange={handleFileUpload} className="file-input" />
        {uploadedFiles.length > 0 && (
          <ul className="uploaded-file-list">
            {uploadedFiles.map((fileName, index) => (
              <li key={index}>
                <a
                  href={`${API_BASE_URL}/uploads/${fileName}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  📎 {fileName}
                </a>
              </li>
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

export default HeatRecoveryPage;
