// src/components/HeatRecoveryForm.js
import React from 'react';

const HeatRecoveryForm = ({ unit, onChange }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({ [name]: value });
  };

  const getImagePath = (type) => {
    if (type.toLowerCase() === 'plakalı') return '/images/igk/igk_plakali.png';
    if (type.toLowerCase() === 'rotorlu') return '/images/igk/igk_rotorlu.png';
    return null;
  };

  const imageSrc = getImagePath(unit.deviceType);

  return (
    <div className="unit-card">
      <h3>IGK Cihazı #{unit.id}</h3>

      <div className="form-row">
        <label>Cihaz Tipi:</label>
        <select
          name="deviceType"
          value={unit.deviceType}
          onChange={handleChange}
        >
          <option value="">Seçiniz</option>
          <option value="Plakalı">Plakalı</option>
          <option value="Rotorlu">Rotorlu</option>
        </select>
      </div>

      <div className="form-row">
        <label>Hava Debisi (m³/h):</label>
        <input
          type="number"
          name="flowRate"
          value={unit.flowRate}
          onChange={handleChange}
          placeholder="Örn: 1500"
        />
      </div>

      <div className="form-row">
        <label>Verim (%):</label>
        <input
          type="number"
          name="efficiency"
          value={unit.efficiency}
          onChange={handleChange}
          placeholder="Örn: 75"
        />
      </div>

      {imageSrc && (
        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <img
            src={imageSrc}
            alt={unit.deviceType}
            style={{ maxWidth: '100%', height: '300px', objectFit: 'contain', border: '1px solid #ccc', padding: 10, borderRadius: 8 }}
          />
        </div>
      )}
    </div>
  );
};

export default HeatRecoveryForm;
