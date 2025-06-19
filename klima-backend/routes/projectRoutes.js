const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const verifyToken = require('../middleware/verifyToken');

// ✅ Tüm projeleri getir (sadece giriş yapan kullanıcıya ait)
router.get('/', verifyToken, async (req, res) => {
  try {
    console.log('📥 [GET] /api/projects çağrıldı');
    console.log('👤 Kullanıcı ID:', req.user?.id);

    const projects = await Project.find({ userId: req.user.id }).sort({ createdAt: -1 });
    return res.json(projects);
  } catch (err) {
    console.error('❌ Projeler alınamadı:', err);
    return res.status(500).json({ message: 'Projeler alınamadı', error: err.message });
  }
});

// ✅ Yeni proje oluştur
router.post('/', verifyToken, async (req, res) => {
  try {
    console.log('📥 [POST] /api/projects çağrıldı');
    console.log('📦 Gelen body:', req.body);
    console.log('👤 Kullanıcı ID:', req.user?.id);

    if (!req.user || !req.user.id) {
      console.warn('🚫 JWT geçersiz, user.id yok');
      return res.status(401).json({ message: 'Kullanıcı kimliği doğrulanamadı.' });
    }

    const {
      projectName,
      location,
      altitude,
      winterDryTemp,
      summerDryTemp,
      summerWetTemp,
      units,
    } = req.body;

    const newProject = new Project({
      userId: req.user.id,
      projectName: typeof projectName === 'string' && projectName.trim() !== '' ? projectName.trim() : 'Yeni Proje',
      location: typeof location === 'string' && location.trim() !== '' ? location.trim() : 'Belirtilmedi',
      altitude: !isNaN(Number(altitude)) ? Number(altitude) : null,
      winterDryTemp: !isNaN(Number(winterDryTemp)) ? Number(winterDryTemp) : null,
      summerDryTemp: !isNaN(Number(summerDryTemp)) ? Number(summerDryTemp) : null,
      summerWetTemp: !isNaN(Number(summerWetTemp)) ? Number(summerWetTemp) : null,
      units: Array.isArray(units) ? units : [],
    });

    await newProject.save();

    console.log('✅ Proje kaydedildi. ID:', newProject._id);
    return res.status(201).json({ message: 'Proje başarıyla kaydedildi', project: newProject });
  } catch (err) {
    console.error('❌ Proje kaydedilirken hata oluştu:', err);
    return res.status(500).json({ message: 'Proje kaydedilemedi', error: err.message });
  }
});

// ✅ Mevcut projeyi güncelle (edit mode için)
router.put('/:id', verifyToken, async (req, res) => {
  try {
    console.log('🛠️ [PUT] /api/projects/:id çağrıldı');
    const updatedProject = await Project.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );

    if (!updatedProject) {
      console.warn('🚫 Güncellenecek proje bulunamadı:', req.params.id);
      return res.status(404).json({ message: 'Proje bulunamadı veya yetkisiz erişim' });
    }

    console.log('✅ Proje güncellendi:', updatedProject._id);
    return res.json(updatedProject);
  } catch (err) {
    console.error('❌ Proje güncellenemedi:', err);
    return res.status(500).json({ message: 'Proje güncellenemedi', error: err.message });
  }
});

// ✅ Projeyi sil
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    console.log('🗑️ [DELETE] /api/projects/:id çağrıldı');
    const project = await Project.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!project) {
      console.warn('🚫 Proje bulunamadı veya yetkisiz erişim:', req.params.id);
      return res.status(404).json({ message: 'Proje bulunamadı veya yetkisiz erişim' });
    }

    await project.deleteOne();
    console.log('✅ Proje silindi:', req.params.id);
    return res.json({ message: 'Proje silindi' });
  } catch (err) {
    console.error('❌ Proje silinirken hata oluştu:', err);
    return res.status(500).json({ message: 'Proje silinemedi', error: err.message });
  }
});

module.exports = router;
