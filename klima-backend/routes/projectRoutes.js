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
    res.status(500).json({ message: 'Projeler alınamadı', error: err.message });
  }
});

// ✅ Yeni proje oluştur
router.post('/', verifyToken, async (req, res) => {
  try {
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
      projectName,
      location,
      altitude,
      winterDryTemp,
      summerDryTemp,
      summerWetTemp,
      units,
    });

    await newProject.save();
    res.status(201).json({ message: 'Proje başarıyla kaydedildi', project: newProject });
  } catch (err) {
    res.status(500).json({ message: 'Proje kaydedilemedi', error: err.message });
  }
});

// ✅ Projeyi sil
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, userId: req.user.id });

    if (!project) {
      return res.status(404).json({ message: 'Proje bulunamadı veya yetkisiz erişim' });
    }

    await project.deleteOne();
    res.json({ message: 'Proje silindi' });
  } catch (err) {
    res.status(500).json({ message: 'Proje silinemedi', error: err.message });
  }
});

module.exports = router;
