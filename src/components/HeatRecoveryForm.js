import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const HeatRecoveryForm = ({ unit, onChange, onCopy }) => {
  const [showAdvanced, setShowAdvanced] = useState(unit.advancedEnabled || false);

  const handleChange = (key, value) => {
    onChange({ ...unit, [key]: value });
  };

  const getUnitCode = (id) => `IGK-${id.toString().padStart(2, '0')}`;

  const renderImage = () => {
    if (!unit.type) return <div style={{ textAlign: 'center', color: '#888', paddingTop: 50 }}>Cihaz Tipi Seçilmedi</div>;

    const imageMap = {
      plakalı: '/images/igk/igk_plakali.png',
      rotorlu: '/images/igk/igk_rotorlu.png',
    };

    return (
      <img
        src={imageMap[unit.type.toLowerCase()]}
        alt={unit.type}
        style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
      />
    );
  };

  return (
    <div style={{ border: '1px solid #ccc', borderRadius: 8, padding: 20, marginBottom: 30, backgroundColor: '#f9f9f9' }}>
      <h3 style={{ marginBottom: 10 }}>{getUnitCode(unit.id)} - Isı Geri Kazanım Cihazı</h3>

      <div className="form-row">
        <label>Cihaz Tipi:</label>
        <select value={unit.type || ''} onChange={(e) => handleChange('type', e.target.value)}>
          <option value="">Seçiniz</option>
          <option value="plakalı">Plakalı</option>
          <option value="rotorlu">Rotorlu</option>
        </select>
      </div>

      {/* Görsel Alanı */}
      <div
        style={{
          marginTop: 10,
          marginBottom: 25,
          height: 300,
          backgroundColor: '#fff',
          border: '1px solid #ddd',
          borderRadius: 6,
          padding: 10,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {renderImage()}
      </div>

      <div className="form-row">
        <label>Hava Debisi (m³/h):</label>
        <input
          type="number"
          value={unit.airflow || ''}
          onChange={(e) => handleChange('airflow', e.target.value)}
        />
      </div>

      <div className="form-row">
        <label>Basınç Kaybı (Pa):</label>
        <input
          type="number"
          value={unit.pressureLoss || ''}
          onChange={(e) => handleChange('pressureLoss', e.target.value)}
        />
      </div>

      {/* Gelişmiş Ayarlar Butonu */}
      <div style={{ marginTop: 20 }}>
        <button
          onClick={() => {
            setShowAdvanced(!showAdvanced);
            handleChange('advancedEnabled', !showAdvanced);
          }}
          className="btn-small"
          style={{ padding: '6px 12px', fontSize: 13 }}
        >
          {showAdvanced ? 'Gelişmiş Ayarları Gizle' : 'Gelişmiş Ayarları Göster'}
        </button>
      </div>

      {/* Gelişmiş Ayarlar Alanı */}
      <AnimatePresence>
        {showAdvanced && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{
              overflow: 'hidden',
              marginTop: 15,
              padding: 15,
              border: '1px dashed #ccc',
              borderRadius: 8,
              backgroundColor: '#fff',
            }}
          >
            <div className="form-row">
              <label>Verim (%):</label>
              <input
                type="number"
                value={unit.efficiency || ''}
                onChange={(e) => handleChange('efficiency', e.target.value)}
              />
            </div>
            <div className="form-row">
              <label>Isıtıcı Batarya:</label>
              <input
                type="text"
                value={unit.heater || ''}
                onChange={(e) => handleChange('heater', e.target.value)}
              />
            </div>
            <div className="form-row">
              <label>Soğutucu Batarya:</label>
              <input
                type="text"
                value={unit.cooler || ''}
                onChange={(e) => handleChange('cooler', e.target.value)}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default HeatRecoveryForm;
