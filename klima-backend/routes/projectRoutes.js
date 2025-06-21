const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const verifyToken = require('../middleware/verifyToken');

// ✅ Tüm projeleri getir (sadece giriş yapan kullanıcıya ait)
router.get('/', verifyToken, async (req, res) => {
  try {
    console.log('📥 [GET] /api/projects çağrıldı');
    const projects = await Project.find({ userId: req.user.id }).sort({ createdAt: -1 });
    return res.json(projects);
  } catch (err) {
    console.error('❌ Projeler alınamadı:', err);
    return res.status(500).json({ message: 'Projeler alınamadı', error: err.message });
  }
});

// ✅ Belirli bir projeyi ID ile getir (edit mode veya admin için)
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (
      !project ||
      (req.user.username !== 'admin' && project.userId.toString() !== req.user.id)
    ) {
      return res.status(403).json({ message: 'Proje görüntüleme yetkiniz yok.' });
    }

    return res.json(project);
  } catch (err) {
    console.error('❌ Proje alınamadı:', err);
    return res.status(500).json({ message: 'Proje alınamadı', error: err.message });
  }
});

// ✅ Yeni proje oluştur
router.post('/', verifyToken, async (req, res) => {
  try {
    console.log('📥 [POST] /api/projects çağrıldı');

    const {
      projectName,
      location,
      altitude,
      winterDryTemp,
      summerDryTemp,
      summerWetTemp,
      units,
      uploadedFiles,
    } = req.body;

    const newProject = new Project({
      userId: req.user.id,
      projectName: projectName?.trim() || 'Yeni Proje',
      location: location?.trim() || 'Belirtilmedi',
      altitude: Number(altitude) || null,
      winterDryTemp: Number(winterDryTemp) || null,
      summerDryTemp: Number(summerDryTemp) || null,
      summerWetTemp: Number(summerWetTemp) || null,
      units: Array.isArray(units) ? units : [],
      uploadedFiles: Array.isArray(uploadedFiles) ? uploadedFiles : [],
    });

    await newProject.save();
    return res.status(201).json({ message: 'Proje başarıyla kaydedildi', project: newProject });
  } catch (err) {
    console.error('❌ Proje kaydedilemedi:', err);
    return res.status(500).json({ message: 'Proje kaydedilemedi', error: err.message });
  }
});

// ✅ Mevcut projeyi güncelle (kendi projesi veya adminse)
router.put('/:id', verifyToken, async (req, res) => {
  try {
    console.log('🛠️ [PUT] /api/projects/:id çağrıldı');

    const project = await Project.findById(req.params.id);
    if (!project || (req.user.username !== 'admin' && project.userId.toString() !== req.user.id)) {
      return res.status(403).json({ message: 'Yetkisiz erişim' });
    }

    Object.assign(project, req.body);
    await project.save();

    console.log('✅ Proje güncellendi:', project._id);
    return res.json(project);
  } catch (err) {
    console.error('❌ Proje güncellenemedi:', err);
    return res.status(500).json({ message: 'Proje güncellenemedi', error: err.message });
  }
});

// ✅ Projeyi sil (sadece kendi projesini)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    console.log('🗑️ [DELETE] /api/projects/:id çağrıldı');
    const project = await Project.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!project) {
      return res.status(404).json({ message: 'Proje bulunamadı veya yetkisiz erişim' });
    }

    await project.deleteOne();
    console.log('✅ Proje silindi:', req.params.id);
    return res.json({ message: 'Proje silindi' });
  } catch (err) {
    console.error('❌ Proje silinemedi:', err);
    return res.status(500).json({ message: 'Proje silinemedi', error: err.message });
  }
});

module.exports = router;
