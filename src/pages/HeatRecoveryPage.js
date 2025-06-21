// src/pages/HeatRecoveryPage.js
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import HeatRecoveryForm from '../components/HeatRecoveryForm';
import citiesData from '../data/CitiesData';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const API_BASE_URL = 'https://klima-backend-ggo2.onrender.com';

function createNewUnit(id) {
  return { id, deviceType: '', flowRate: '', efficiency: '' };
}

const HeatRecoveryPage = () => {
  const [projectName, setProjectName] = useState('');
  const [location, setLocation] = useState('');
  const [climateData, setClimateData] = useState({
    altitude: '',
    winterDB: '',
    summerDB: '',
    summerWB: '',
  });
  const [units, setUnits] = useState([createNewUnit(1)]);
  const navigate = useNavigate();
  const locationState = useLocation();
  const queryParams = new URLSearchParams(locationState.search);
  const editProjectId = queryParams.get('edit');
  const pdfRef = useRef();

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
        });
    }
  }, [editProjectId]);

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

  const handleUnitChange = (id, newData) => {
    setUnits(units.map((unit) => (unit.id === id ? { ...unit, ...newData } : unit)));
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

      pdf.save('isi_geri_kazanim.pdf');
    });
  };

  return (
    <div style={{ padding: 20, maxWidth: '1400px', margin: 'auto' }}>
      <h1>♻️ Isı Geri Kazanım Cihazı Tasarımı</h1>
      <div ref={pdfRef}>
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

          <span className="climate-info">
            Rakım: {climateData.altitude} m | Kış KT: {climateData.winterDB} °C | Yaz
            KT: {climateData.summerDB} °C | Yaz YT: {climateData.summerWB} °C
          </span>
        </div>

        {units.map((unit) => (
          <HeatRecoveryForm
            key={unit.id}
            unit={unit}
            onChange={(newData) => handleUnitChange(unit.id, newData)}
          />
        ))}
      </div>

      <button className="btn-add" onClick={handleAddUnit}>
        ➕ Yeni IGK Cihazı Ekle
      </button>

      <div className="btn-group">
        <button className="btn-pdf" onClick={generatePDF}>
          📄 PDF Oluştur (Ekran Görüntüsü)
        </button>
      </div>
    </div>
  );
};

export default HeatRecoveryPage;
