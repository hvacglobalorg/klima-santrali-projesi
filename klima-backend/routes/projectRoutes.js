const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const verifyToken = require('../middleware/verifyToken');

// ✅ Tüm projeleri getir (sadece giriş yapan kullanıcıya ait)
router.get('/', verifyToken, async (req, res) => {
  try {
    const projects = await Project.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    console.error('Projeler alınamadı:', err);
    res.status(500).json({ message: 'Projeler alınamadı', error: err.message });
  }
});

// ✅ Yeni proje oluştur
router.post('/', verifyToken, async (req, res) => {
  try {
    console.log('POST /api/projects çağrıldı');
    console.log('Gönderilen body:', req.body);

    const {
      projectName,
      location,
      altitude,
      winterDryTemp,
      summerDryTemp,
      summerWetTemp,
      units,
    } = req.body;

    // Basit zorunlu alan kontrolü
    if (
  !projectName || typeof projectName !== 'string' ||
  !location || typeof location !== 'string' ||
  altitude === undefined || altitude === null || isNaN(Number(altitude)) ||
  winterDryTemp === undefined || winterDryTemp === null || isNaN(Number(winterDryTemp)) ||
  summerDryTemp === undefined || summerDryTemp === null || isNaN(Number(summerDryTemp)) ||
  summerWetTemp === undefined || summerWetTemp === null || isNaN(Number(summerWetTemp)) ||
  !Array.isArray(units)
) {
  return res.status(400).json({ message: 'Eksik veya hatalı veri gönderildi' });
}


    const newProject = new Project({
      userId: req.user.id,
      projectName,
      location,
      altitude,
      winterDryTemp,
      summerDryTemp,
      summerWetTemp,
      units,
    });

    await newProject.save();
    console.log('Yeni proje başarıyla kaydedildi:', newProject._id);

    res.status(201).json({ message: 'Proje başarıyla kaydedildi', project: newProject });
  } catch (err) {
    console.error('Proje kaydedilirken hata oluştu:', err);
    res.status(500).json({ message: 'Proje kaydedilemedi', error: err.message });
  }
});

// ✅ Projeyi sil
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!project) {
      return res.status(404).json({ message: 'Proje bulunamadı veya yetkisiz erişim' });
    }

    await project.deleteOne();
    res.json({ message: 'Proje silindi' });
  } catch (err) {
    console.error('Proje silinirken hata oluştu:', err);
    res.status(500).json({ message: 'Proje silinemedi', error: err.message });
  }
});

module.exports = router;
