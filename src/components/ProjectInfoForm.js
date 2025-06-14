import React, { useState, useEffect } from 'react';
import cities from '../data/CitiesData';

const ProjectInfoForm = ({ projectInfo, setProjectInfo }) => {
  const [showClimateFields, setShowClimateFields] = useState(false);

  const handleCityChange = (e) => {
    const selectedCity = cities.find(city => city.name === e.target.value);
    if (selectedCity) {
      setProjectInfo({
        ...projectInfo,
        location: selectedCity.name,
        altitude: selectedCity.altitude,
        winterDryBulb: selectedCity.winterDryBulb,
        summerDryBulb: selectedCity.summerDryBulb,
        summerWetBulb: selectedCity.summerWetBulb
      });
      setShowClimateFields(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProjectInfo(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div style={{ marginBottom: '20px', borderBottom: '1px solid #ccc', paddingBottom: '20px' }}>
      <h2>Proje Bilgileri</h2>

      {/* Proje İsmi */}
      <div style={{ marginBottom: '10px' }}>
        <label>Proje İsmi: </label>
        <input
          type="text"
          name="name"
          value={projectInfo.name}
          onChange={handleInputChange}
        />
      </div>

      {/* Proje Konumu + iklim verileri aynı satırda */}
      <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
        {/* Şehir Seçimi */}
        <div>
          <label>Proje Konumu:</label><br />
          <select value={projectInfo.location} onChange={handleCityChange}>
            <option value="">Şehir Seçin</option>
            {cities.map((city, index) => (
              <option key={index} value={city.name}>{city.name}</option>
            ))}
          </select>
        </div>

        {/* Otomatik gelen iklim değerleri */}
        {!showClimateFields && projectInfo.location && (
          <>
            <div>
              <label>Rakım:</label><br />
              <span>{projectInfo.altitude} m</span>
            </div>
            <div>
              <label>Kış KT:</label><br />
              <span>{projectInfo.winterDryBulb} °C</span>
            </div>
            <div>
              <label>Yaz KT:</label><br />
              <span>{projectInfo.summerDryBulb} °C</span>
            </div>
            <div>
              <label>Yaz YT:</label><br />
              <span>{projectInfo.summerWetBulb} °C</span>
            </div>
            <button type="button" onClick={() => setShowClimateFields(true)}>Değiştir</button>
          </>
        )}

        {/* Değiştir'e basıldıysa düzenlenebilir alanlar */}
        {showClimateFields && (
          <>
            <div>
              <label>Rakım:</label><br />
              <input
                type="number"
                name="altitude"
                value={projectInfo.altitude}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label>Kış KT:</label><br />
              <input
                type="number"
                name="winterDryBulb"
                value={projectInfo.winterDryBulb}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label>Yaz KT:</label><br />
              <input
                type="number"
                name="summerDryBulb"
                value={projectInfo.summerDryBulb}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label>Yaz YT:</label><br />
              <input
                type="number"
                name="summerWetBulb"
                value={projectInfo.summerWetBulb}
                onChange={handleInputChange}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProjectInfoForm;
