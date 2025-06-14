import React, { useState } from 'react';

function SantralForm({ unit, onChange }) {
  const [isEditingName, setIsEditingName] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    onChange({ [name]: type === 'checkbox' ? checked : value });
  };

  const getImageForType = () => {
    const {
      type,
      recoveryConfig,
      filtration,
      heatingNeed,
      coolingNeed,
      humidNeed,
      reheaterNeed,
    } = unit;
    
  if (type === 'tazeHavali') {
    const isHeating = heatingNeed === 'evet';
    const isCooling = coolingNeed === 'evet';
    const isHumidifying = humidNeed === 'evet';
    const isReheater = reheaterNeed === 'evet';

    // 🔹 Isıtma + Soğutma + Nemlendirme + Son Isıtıcı
    if (isHeating && isCooling && isHumidifying && isReheater) {
      if (filtration === 'normal') return '/images/Taze_havali_G4_F7_isi_nem_sog_son.png';
      if (filtration === 'ince') return '/images/Taze_havali_G4_F7_isi_nem_sog_son_F9.png';
      if (filtration === 'kaba') return '/images/Taze_havali_G4_isi_nem_sog_son.png';
    }

    // 🔹 Isıtma + Soğutma (Nemlendirme yok) + Son Isıtıcı
    if (isHeating && isCooling && !isHumidifying && isReheater) {
      if (filtration === 'normal') return '/images/Taze_havali_G4_F7_isi_sog_son.png';
      if (filtration === 'ince') return '/images/Taze_havali_G4_F7_isi_sog_son_F9.png';
      if (filtration === 'kaba') return '/images/Taze_havali_G4_isi_sog_son.png';
    }

    // 🔹 Isıtma + Soğutma + Nemlendirme
    if (isHeating && isCooling && isHumidifying) {
      if (filtration === 'normal') return '/images/Taze_havali_G4_F7_isi_nem_sog.png';
      if (filtration === 'ince') return '/images/Taze_havali_G4_F7_isi_nem_sog_F9.png';
      if (filtration === 'kaba') return '/images/Taze_havali_G4_isi_nem_sog.png';
    }

    // 🔹 Sadece Isıtma + Nemlendirme
    if (isHeating && !isCooling && isHumidifying) {
      if (filtration === 'normal') return '/images/Taze_havali_G4_F7_isi_nem.png';
      if (filtration === 'ince') return '/images/Taze_havali_G4_F7_isi_nem_F9.png';
      if (filtration === 'kaba') return '/images/Taze_havali_G4_isi_nem.png';
    }

    // 🔹 Isıtma + Soğutma (Nemlendirme yok)
    if (isHeating && isCooling && !isHumidifying) {
      if (filtration === 'normal') return '/images/taze_havali_G4_F7_isi_sog.png';
      if (filtration === 'ince') return '/images/taze_havali_G4_F7_isi_sog_F9.png';
      if (filtration === 'kaba') return '/images/taze_havali_G4_isi_sog.png';
    }

    // 🔹 Sadece Soğutma
    if (!isHeating && isCooling) {
      if (filtration === 'normal') return '/images/taze_havali_G4_F7_sog.png';
      if (filtration === 'ince') return '/images/taze_havali_G4_F7_sog_F9.png';
      if (filtration === 'kaba') return '/images/taze_havali_G4_sog.png';
    }

    // 🔹 Sadece Isıtma (Nemlendirme yok)
    if (isHeating && !isCooling && !isHumidifying) {
      if (filtration === 'normal') return '/images/taze_havali_G4_F7_isi.png';
      if (filtration === 'ince') return '/images/taze_havali_G4_F7_isi_F9.png';
      if (filtration === 'kaba') return '/images/taze_havali_G4_isi.png';
    }

    // 🔹 Ne ısıtma ne soğutma varsa
    if (!isHeating && !isCooling) {
      if (filtration === 'normal') return '/images/taze_havali_G4_F7.png';
      if (filtration === 'ince') return '/images/taze_havali_G4_F7_F9.png';
      return '/images/tazeHavali.png'; // kaba
    }
  }

  // Diğer sistem tipleri
 if (type === 'isiGeriKazanimli') {
    const isHeating = heatingNeed === 'evet';
    const isCooling = coolingNeed === 'evet';
    const isHumidifying = humidNeed === 'evet';
    const isReheating = reheaterNeed === 'evet';

    // PLAKALI
    if (recoveryConfig === 'plakali') {
      if (isHeating && isCooling && isHumidifying && isReheating) {
        if (filtration === 'kaba') return '/images/pigk_G4_isi_nem_sog_son.png';
        if (filtration === 'normal') return '/images/pigk_G4_F7_isi_nem_sog_son.png';
        if (filtration === 'ince') return '/images/pigk_G4_F7_isi_nem_sog_son_F9.png';
      }

      if (isHeating && isCooling && !isHumidifying && isReheating) {
        if (filtration === 'kaba') return '/images/pigk_G4_isi_sog_son.png';
        if (filtration === 'normal') return '/images/pigk_G4_F7_isi_sog_son.png';
        if (filtration === 'ince') return '/images/pigk_G4_F7_isi_sog_son_F9.png';
      }

      if (isHeating && isCooling && isHumidifying) {
        if (filtration === 'kaba') return '/images/pigk_G4_isi_nem_sog.png';
        if (filtration === 'normal') return '/images/pigk_G4_F7_isi_nem_sog.png';
        if (filtration === 'ince') return '/images/pigk_G4_F7_isi_nem_sog_F9.png';
      }

      if (isHeating && !isCooling && isHumidifying) {
        if (filtration === 'kaba') return '/images/pigk_G4_isi_nem.png';
        if (filtration === 'normal') return '/images/pigk_G4_F7_isi_nem.png';
        if (filtration === 'ince') return '/images/pigk_G4_F7_isi_nem_F9.png';
      }

      if (isHeating && isCooling && !isHumidifying) {
        if (filtration === 'kaba') return '/images/pigk_G4_isi_sog.png';
        if (filtration === 'normal') return '/images/pigk_G4_F7_isi_sog.png';
        if (filtration === 'ince') return '/images/pigk_G4_F7_isi_sog_F9.png';
      }

      if (!isHeating && isCooling && !isHumidifying) {
        if (filtration === 'kaba') return '/images/pigk_G4_sog.png';
        if (filtration === 'normal') return '/images/pigk_G4_F7_sog.png';
        if (filtration === 'ince') return '/images/pigk_G4_F7_sog_F9.png';
      }

      if (isHeating && !isCooling && !isHumidifying) {
        if (filtration === 'kaba') return '/images/pigk_G4_isi.png';
        if (filtration === 'normal') return '/images/pigk_G4_F7_isi.png';
        if (filtration === 'ince') return '/images/pigk_G4_F7_isi_F9.png';
      }

      if (filtration === 'kaba') return '/images/pigk_G4.png';
      if (filtration === 'normal') return '/images/pigk_G4_F7.png';
      if (filtration === 'ince') return '/images/pigk_G4_F7_F9.png';
      return '/images/pigk_G4.png';
    }

    // ROTORLU
    if (recoveryConfig === 'rotorlu') {
      if (isHeating && isCooling && isHumidifying && isReheating) {
        if (filtration === 'kaba') return '/images/rigk_G4_isi_nem_sog_son.png';
        if (filtration === 'normal') return '/images/rigk_G4_F7_isi_nem_sog_son.png';
        if (filtration === 'ince') return '/images/rigk_G4_F7_isi_nem_sog_son_F9.png';
      }

      if (isHeating && isCooling && !isHumidifying && isReheating) {
        if (filtration === 'kaba') return '/images/rigk_G4_isi_sog_son.png';
        if (filtration === 'normal') return '/images/rigk_G4_F7_isi_sog_son.png';
        if (filtration === 'ince') return '/images/rigk_G4_F7_isi_sog_son_F9.png';
      }

      if (isHeating && isCooling && isHumidifying) {
        if (filtration === 'kaba') return '/images/rigk_G4_isi_nem_sog.png';
        if (filtration === 'normal') return '/images/rigk_G4_F7_isi_nem_sog.png';
        if (filtration === 'ince') return '/images/rigk_G4_F7_isi_nem_sog_F9.png';
      }

      if (isHeating && !isCooling && isHumidifying) {
        if (filtration === 'kaba') return '/images/rigk_G4_isi_nem.png';
        if (filtration === 'normal') return '/images/rigk_G4_F7_isi_nem.png';
        if (filtration === 'ince') return '/images/rigk_G4_F7_isi_nem_F9.png';
      }

      if (isHeating && isCooling && !isHumidifying) {
        if (filtration === 'kaba') return '/images/rigk_G4_isi_sog.png';
        if (filtration === 'normal') return '/images/rigk_G4_F7_isi_sog.png';
        if (filtration === 'ince') return '/images/rigk_G4_F7_isi_sog_F9.png';
      }

      if (!isHeating && isCooling && !isHumidifying) {
        if (filtration === 'kaba') return '/images/rigk_G4_sog.png';
        if (filtration === 'normal') return '/images/rigk_G4_F7_sog.png';
        if (filtration === 'ince') return '/images/rigk_G4_F7_sog_F9.png';
      }

      if (isHeating && !isCooling && !isHumidifying) {
        if (filtration === 'kaba') return '/images/rigk_G4_isi.png';
        if (filtration === 'normal') return '/images/rigk_G4_F7_isi.png';
        if (filtration === 'ince') return '/images/rigk_G4_F7_isi_F9.png';
      }

      if (filtration === 'kaba') return '/images/rigk_G4.png';
      if (filtration === 'normal') return '/images/rigk_G4_F7.png';
      if (filtration === 'ince') return '/images/rigk_G4_F7_F9.png';
      return '/images/rigk_G4.png';
    }

    // RUNAROUND veya bilinmeyen
    if (recoveryConfig === 'runaround') return '/images/pigk_runaround.png';
    return '/images/pigk_G4.png';
  }

  if (type === 'karisimHavali') return '/images/karisimHavali.png';

  return null;
};

  const baseName = unit.isHygienic
  ? `Hijyenik Klima Santrali / HKS-0${unit.id}`
  : `Klima Santrali / KS-0${unit.id}`;

  return (
    <div>
      {/* Başlık ve özel ad */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <h3 style={{ margin: 0 }}>
          {baseName}
          {unit.customName && ` - ${unit.customName}`}
        </h3>
        <button
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '1.2em',
            color: '#007bff'
          }}
          onClick={() => setIsEditingName(true)}
          title="Santral adını düzenle"
        >
          🖉
        </button>
      </div>

      {isEditingName && (
        <div style={{ marginTop: 5 }}>
          <input
            type="text"
            name="customName"
            value={unit.customName || ''}
            onChange={handleChange}
            onBlur={() => setIsEditingName(false)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') setIsEditingName(false);
            }}
            placeholder="Klima Santrali İsmi"
            style={{ padding: '4px', fontSize: '1em' }}
            autoFocus
          />
        </div>
      )}

      <div>
        <label>Santral Tipi:</label>
        <select name="type" value={unit.type} onChange={handleChange}>
          <option value="">Seçiniz</option>
          <option value="tazeHavali">Taze Havalı</option>
          <option value="isiGeriKazanimli">Isı Geri Kazanımlı</option>
          <option value="karisimHavali">Karışım Havalı</option>
        </select>
      </div>

      {/* ✅ Hijyenik Klima Santrali kutucuğu düzenlendi */}
      <div style={{ marginTop: 10, display: 'flex', alignItems: 'center' }}>
        <input
          type="checkbox"
          name="isHygienic"
          checked={unit.isHygienic || false}
          onChange={handleChange}
          style={{ width: 16, height: 16, marginRight: 8 }}
        />
        <label>Hijyenik Klima Santrali</label>
      </div>

      {/* Tip Seçimine Göre Dinamik Alan */}
<div style={{ marginTop: 20, minHeight: '60px' }}>
  <div className={`fade-image ${unit.type === 'isiGeriKazanimli' ? 'show' : ''}`}>
    {unit.type === 'isiGeriKazanimli' && (
      <>
        <label htmlFor="recoveryConfig">Isı Geri Kazanım Konfigürasyonu:</label>
        <select
          name="recoveryConfig"
          value={unit.recoveryConfig || ''}
          onChange={handleChange}
        >
          <option value="">Seçiniz</option>
          <option value="plakali">Plakalı Isı Geri Kazanım</option>
          <option value="rotorlu">Rotorlu Isı Geri Kazanım</option>
          <option value="runaround">Run-Around Isı Geri Kazanım</option>
        </select>
      </>
    )}
  </div>

  <div className={`fade-image ${unit.type === 'karisimHavali' ? 'show' : ''}`}>
    {unit.type === 'karisimHavali' && (
      <>
        <label htmlFor="mixingConfig">Santral Karışım Tasarımı:</label>
        <select
          name="mixingConfig"
          value={unit.mixingConfig || ''}
          onChange={handleChange}
        >
          <option value="">Seçiniz</option>
          <option value="dikey">Dikey</option>
          <option value="yatay">Yatay</option>
        </select>
      </>
    )}
  </div>
</div>



     <div
  style={{
    margin: '10px 0',
    height: '400px', // Sabit yükseklik verildi
    backgroundColor: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid #ccc',
    fontStyle: 'italic',
    color: '#666',
    fontSize: '18px',
    textAlign: 'center',
    overflow: 'hidden', // Taşan görseli engeller
  }}
>
  {unit.type ? (
    <img
      key={unit.type}
      src={getImageForType(
        unit.type,
        unit.filtration,
        unit.heatingNeed,
        unit.coolingNeed,
        unit.humidNeed,
        unit.reheaterNeed
      )}
      alt="Santral Tipi"
      className="fade-image show"
      style={{
        maxHeight: '100%',
        maxWidth: '100%',
        objectFit: 'contain', // Görseli orantılı küçültür, taşmayı engeller
      }}
    />
  ) : (
    'Santral Tipi Seçiniz'
  )}
</div>



      {/* ✅ Debi ve basınç arası boşluk kısaltıldı (gap: 10) */}
      <div style={{ display: 'flex', gap: 10 }}>
        <div style={{ flex: 1 }}>
          <label>Vantilatör Debisi (m³/h):</label>
          <input type="number" name="fanFlow" value={unit.fanFlow} onChange={handleChange} />
        </div>
        <div style={{ flex: 1 }}>
          <label>Vantilatör Basınç Kaybı (Pa):</label>
          <input type="number" name="fanPressure" value={unit.fanPressure} onChange={handleChange} />
        </div>
      </div>

      {/* ✅ Aspiratör alanları yan yana */}
      {unit.type !== 'tazeHavali' && (
        <div style={{ display: 'flex', gap: 5 }}>
          <div style={{ flex: 1 }}>
            <label>Aspiratör Debisi (m³/h):</label>
            <input type="number" name="aspFlow" value={unit.aspFlow} onChange={handleChange} />
          </div>
          <div style={{ flex: 1 }}>
            <label>Aspiratör Basınç Kaybı (Pa):</label>
            <input type="number" name="aspPressure" value={unit.aspPressure} onChange={handleChange} />
          </div>
        </div>
      )}

          <div>
  <label><strong>Filtrasyon:</strong></label>
  <select name="filtration" value={unit.filtration || 'kaba'} onChange={handleChange}>
    <option value="kaba">Kaba 'G4'</option>
    <option value="normal">Normal 'G4+F7'</option>
    <option value="ince">İnce 'G4+F7+F9'</option>
  </select>
</div>


 {/* ISITMA */}
<div style={{ minHeight: '120px', marginTop: '10px' }}>
  <label><strong>Isıtma İhtiyacı:</strong></label>
  <select name="heatingNeed" value={unit.heatingNeed} onChange={handleChange}>
    <option value="">Seçiniz</option>
    <option value="evet">Evet</option>
    <option value="hayir">Hayır</option>
  </select>

  <div className={`fade-container ${unit.heatingNeed === 'evet' ? 'show' : ''}`} >
    {unit.heatingNeed === 'evet' && (
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
        <div>
          <label>Isıtma Yöntemi:</label>
          <select
            name="heatingType"
            value={unit.heatingType}
            onChange={handleChange}
          >
            <option value="">Seçiniz</option>
            <option value="Sıcak Sulu 80-60">Sıcak Sulu 80-60</option>
            <option value="Sıcak Sulu 90-70">Sıcak Sulu 90-70</option>
            <option value="Elektrikli Isıtıcı">Elektrikli Isıtıcı</option>
            <option value="DX">DX</option>
            <option value="Diğer">Diğer</option>
          </select>
        </div>

        {unit.heatingType === 'Diğer' && (
          <div>
            <label>Isıtma Yöntemini Belirtiniz:</label>
            <input
              type="text"
              name="heatingTypeCustom"
              placeholder="Yöntemi yazınız"
              value={unit.heatingTypeCustom || ''}
              onChange={(e) =>
                handleChange({
                  target: {
                    name: 'heatingTypeCustom',
                    value: e.target.value,
                  },
                })
              }
            />
          </div>
        )}

        <div>
          <label>Isıtma Kapasitesi (kW):</label>
          <input
            type="number"
            name="heatingCapacity"
            value={unit.heatingCapacity}
            onChange={handleChange}
          />
        </div>

        <div style={{ textAlign: 'center', fontStyle: 'italic' }}>
          — ve/veya —
        </div>

        <div>
          <label>Isıtma Üfleme Sıcaklığı (°C):</label>
          <input
            type="number"
            name="heatingBlowTemp"
            value={unit.heatingBlowTemp || ''}
            onChange={handleChange}
          />
        </div>
      </div>
    )}
  </div>
</div>



{/* SOĞUTMA */}
<div> 
  <label><strong>Soğutma İhtiyacı:</strong></label>
  <select name="coolingNeed" value={unit.coolingNeed} onChange={handleChange}>
    <option value="">Seçiniz</option>
    <option value="evet">Evet</option>
    <option value="hayir">Hayır</option>
  </select>
</div>

<div style={{ minHeight: '80px', marginTop: '10px' }}>
  <div className={`fade-container ${unit.coolingNeed === 'evet' ? 'show' : ''}`}>
    {unit.coolingNeed === 'evet' && (
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
        <div>
          <label>Soğutma Yöntemi:</label>
          <select
            name="coolingType"
            value={unit.coolingType}
            onChange={handleChange}
          >
            <option value="">Seçiniz</option>
            <option value="Soğuk Sulu 7-12">Soğuk Sulu 7-12</option>
            <option value="DX">DX</option>
            <option value="Diğer">Diğer</option>
          </select>
        </div>

        {unit.coolingType === 'Diğer' && (
          <div>
            <label>Soğutma Yöntemini Belirtiniz:</label>
            <input
              type="text"
              name="coolingTypeCustom"
              placeholder="Soğutma Yöntemini Belirtiniz"
              value={unit.coolingTypeCustom || ''}
              onChange={(e) =>
                handleChange({
                  target: {
                    name: 'coolingTypeCustom',
                    value: e.target.value,
                  },
                })
              }
            />
          </div>
        )}

        <div>
          <label>Soğutma Kapasitesi (kW):</label>
          <input
            type="number"
            name="coolingCapacity"
            value={unit.coolingCapacity}
            onChange={handleChange}
          />
        </div>

        <div style={{ textAlign: 'center', fontStyle: 'italic' }}>
          — ve/veya —
        </div>

        <div>
          <label>Soğutma Üfleme Sıcaklığı (°C):</label>
          <input
            type="number"
            name="coolingBlowTemp"
            value={unit.coolingBlowTemp || ''}
            onChange={handleChange}
          />
        </div>
      </div>
    )}
  </div>
</div>


{/* NEMLENDİRME - Sadece Isıtma İhtiyacı 'Evet' ise gösterilir */}
{unit.heatingNeed === 'evet' && (
  <div>
    <label><strong>Nemlendirme İhtiyacı:</strong></label>
    <select name="humidNeed" value={unit.humidNeed} onChange={handleChange}>
      <option value="">Seçiniz</option>
      <option value="evet">Evet</option>
      <option value="hayir">Hayır</option>
    </select>

    {unit.humidNeed === 'evet' && (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          marginTop: '10px',
          flexWrap: 'wrap',
        }}
      >
        <div>
          <label>Nemlendirme Yöntemi:</label>
          <select
            name="humidType"
            value={unit.humidType}
            onChange={handleChange}
          >
            <option value="">Seçiniz</option>
            <option value="Buharlı Nemlendirici">Buharlı Nemlendirici</option>
            <option value="Sulu Nemlendirici">Sulu Nemlendirici</option>
            <option value="Evaporatif Nemlendirici">Evaporatif Nemlendirici</option>
            <option value="Diğer">Diğer</option>
          </select>
        </div>

        {unit.humidType === 'Diğer' && (
          <div>
            <label>Nemlendirme Yöntemini Belirtiniz:</label>
            <input
              type="text"
              name="humidTypeCustom"
              placeholder="Yöntemi yazınız"
              value={unit.humidTypeCustom || ''}
              onChange={(e) =>
                handleChange({
                  target: {
                    name: 'humidTypeCustom',
                    value: e.target.value,
                  },
                })
              }
            />
          </div>
        )}

        <div>
          <label>Nemlendirme Kapasitesi (kg/h):</label>
          <input
            type="number"
            name="humidCapacity"
            value={unit.humidCapacity}
            onChange={handleChange}
          />
        </div>
      </div>
    )}
  </div>
)}


{/* SON ISITICI */}
{unit.heatingNeed === 'evet' && unit.coolingNeed === 'evet' && (
  <div style={{ marginTop: '20px' }}>
    <div>
      <label><strong>Son Isıtıcı İhtiyacı:</strong></label>
      <select
        name="reheaterNeed"
        value={unit.reheaterNeed || ''}
        onChange={handleChange}
      >
        <option value="">Seçiniz</option>
        <option value="evet">Evet</option>
        <option value="hayir">Hayır</option>
      </select>
    </div>

    {unit.reheaterNeed === 'evet' && (
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginTop: '10px' }}>
        <div>
          <label>Son Isıtıcı Yöntemi:</label>
          <select
            name="reheaterType"
            value={unit.reheaterType || ''}
            onChange={handleChange}
          >
            <option value="">Seçiniz</option>
            <option value="Sıcak Sulu 80-60">Sıcak Sulu 80-60</option>
            <option value="Sıcak Sulu 90-70">Sıcak Sulu 90-70</option>
            <option value="Elektrikli Isıtıcı">Elektrikli Isıtıcı</option>
            <option value="DX">DX</option>
            <option value="Diğer">Diğer</option>
          </select>
        </div>

        {unit.reheaterType === 'Diğer' && (
          <div>
            <label>Yöntemi Belirtiniz:</label>
            <input
              type="text"
              name="reheaterTypeCustom"
              placeholder="Yöntemi Belirtiniz"
              value={unit.reheaterTypeCustom || ''}
              onChange={(e) =>
                handleChange({
                  target: {
                    name: 'reheaterTypeCustom',
                    value: e.target.value,
                  },
                })
              }
            />
          </div>
        )}

        <div>
          <label>Son Isıtıcı Kapasitesi (kW):</label>
          <input
            type="number"
            name="reheaterCapacity"
            value={unit.reheaterCapacity || ''}
            onChange={handleChange}
          />
        </div>

        <div style={{ textAlign: 'center', fontStyle: 'italic' }}>
          — ve/veya —
        </div>

        <div>
          <label>Son Isıtıcı Üfleme Sıcaklığı (°C):</label>
          <input
            type="number"
            name="reheaterBlowTemp"
            value={unit.reheaterBlowTemp || ''}
            onChange={handleChange}
          />
        </div>
      </div>
    )}
  </div>
)}
{/* ✅ Gelişmiş Ayar kutusu daha küçük ve hizalı, ayrıca kutu içine alındı */}
<div style={{ marginTop: 10 }}>
  <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
    <input
      type="checkbox"
      name="advancedEnabled"
      checked={unit.advancedEnabled}
      onChange={handleChange}
      style={{ width: 16, height: 16, marginRight: 8 }}
    />
    <label>Gelişmiş Ayarları Göster</label>
  </div>

  <div
    className={`advanced-settings ${unit.advancedEnabled ? 'show' : ''}`}
    style={{
      border: '1px solid #ccc',
      borderRadius: 6,
      padding: 12,
      backgroundColor: '#fafafa',
    }}
  >
    {/* Kış ve Yaz dönüş havası sıcaklıkları + bağıl nem kutuları yan yana hizalı */}
    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
      <div style={{ flex: 1 }}>
        <label>Kış Dönüş Havası Sıcaklığı (°C):</label>
        <input
          type="number"
          name="winterReturnTemp"
          value={unit.winterReturnTemp || ''}
          onChange={handleChange}
        />
      </div>
      <div style={{ flex: 1 }}>
        <label>Kış Dönüş Havası Bağıl Nemi (%):</label>
        <input
          type="number"
          name="winterReturnHumidity"
          value={unit.winterReturnHumidity || ''}
          onChange={handleChange}
        />
      </div>
    </div>

    <div
      style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: 10 }}
    >
      <div style={{ flex: 1 }}>
        <label>Yaz Dönüş Havası Sıcaklığı (°C):</label>
        <input
          type="number"
          name="summerReturnTemp"
          value={unit.summerReturnTemp || ''}
          onChange={handleChange}
        />
      </div>
      <div style={{ flex: 1 }}>
        <label>Yaz Dönüş Havası Bağıl Nemi (%):</label>
        <input
          type="number"
          name="summerReturnHumidity"
          value={unit.summerReturnHumidity || ''}
          onChange={handleChange}
        />
      </div>
    </div>

    {/* Özel Ölçüler */}
    <div style={{ marginTop: 10 }}>
      <label>Özel Ölçüler (mm):</label>
      <div style={{ display: 'flex', gap: '10px', marginTop: 5 }}>
        <input
          type="text"
          placeholder="Genişlik"
          name="customWidth"
          value={unit.customWidth || ''}
          onChange={handleChange}
        />
        <input
          type="text"
          placeholder="Uzunluk"
          name="customLength"
          value={unit.customLength || ''}
          onChange={handleChange}
        />
        <input
          type="text"
          placeholder="Yükseklik"
          name="customHeight"
          value={unit.customHeight || ''}
          onChange={handleChange}
        />
      </div>
    </div>

    {/* ✅ Dış Ortam sorusu: Susturucu formatında, üstte olacak */}
    <div
      style={{
        marginTop: 20,
        paddingTop: 10,
        display: 'flex',
        alignItems: 'center',
        gap: 15,
      }}
    >
      <label
        style={{ fontWeight: 'bold', fontSize: 15, whiteSpace: 'nowrap' }}
      >
        Dış Ortam:
      </label>

      <select
        name="outdoor"
        value={unit.outdoor || 'evet'}
        onChange={handleChange}
        style={{ padding: '4px 8px', fontSize: 14, borderRadius: 4 }}
      >
        <option value="evet">Evet</option>
        <option value="hayir">Hayır</option>
      </select>
    </div>

    {/* Susturucu ve Tik Kutuları revize (hepsi tek satırda) */}
    <div
      style={{
        marginTop: 20,
        paddingTop: 10,
        display: 'flex',
        alignItems: 'center',
        gap: 15,
      }}
    >
      <label
        style={{ fontWeight: 'bold', fontSize: 15, whiteSpace: 'nowrap' }}
      >
        Susturucu (Silencer):
      </label>

      <select
        name="silencer"
        value={unit.silencer || 'hayir'}
        onChange={handleChange}
        style={{ padding: '4px 8px', fontSize: 14, borderRadius: 4 }}
      >
        <option value="evet">Evet</option>
        <option value="hayir">Hayır</option>
      </select>

      {unit.silencer === 'evet' && (
        <>
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              fontSize: 14,
              cursor: 'pointer',
            }}
          >
            <input
              type="checkbox"
              name="fanSilencer"
              checked={unit.fanSilencer || false}
              onChange={handleChange}
              style={{ width: 14, height: 14, marginRight: 6 }}
            />
            Vantilatör
          </label>

          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              fontSize: 14,
              cursor: 'pointer',
            }}
          >
            <input
              type="checkbox"
              name="aspSilencer"
              checked={unit.aspSilencer || false}
              onChange={handleChange}
              style={{ width: 14, height: 14, marginRight: 6 }}
            />
            Aspiratör
          </label>
        </>
      )}
    </div>

    {/* ✅ Otomasyon Sorusu – Susturucunun hemen altında */}
    <div
      style={{
        marginTop: 15,
        display: 'flex',
        alignItems: 'center',
        gap: 15,
      }}
    >
      <label
        style={{ fontWeight: 'bold', fontSize: 15, whiteSpace: 'nowrap' }}
      >
        Otomasyon:
      </label>

      <select
        name="automation"
        value={unit.automation || 'hayir'}
        onChange={handleChange}
        style={{ padding: '4px 8px', fontSize: 14, borderRadius: 4 }}
      >
        <option value="evet">Evet</option>
        <option value="hayir">Hayır</option>
      </select>

      {unit.automation === 'evet' && (
        <span style={{ fontSize: 13, fontStyle: 'italic', color: '#555' }}>
          (Detayları aşağıda not olarak veya döküman ile belirtiniz)
        </span>
      )}
    </div>

    {/* ✅ Notlar Alanı – Otomasyon kutusunun altında */}
    <div style={{ marginTop: 15 }}>
      <label style={{ fontWeight: 'bold', fontSize: 15 }}>Notlar:</label>
      <textarea
        name="notes"
        value={unit.notes || ''}
        onChange={handleChange}
        rows={5}
        style={{
          width: '50%',
          height: '120px',
          marginTop: 5,
          padding: 8,
          fontSize: 14,
          borderRadius: 4,
          border: '1px solid #ccc',
          resize: 'vertical',
        }}
        placeholder="Varsa ekstra notlarınızı buraya yazabilirsiniz..."
      />
    </div>
  </div>
</div>

      </div>
    );
  }

  export default SantralForm;