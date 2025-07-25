// controllers/projectController.js
const Project = require('../models/Product');

const createProject = async (req, res) => {
  try {
    const {
      createdDate,
      description,
      images,
      name,
      price,
      salesCount,
      userId,
    } = req.body;

    const newProject = new Project({
      createdDate,
      description,
      images,
      name,
      price,
      salesCount,
      userId,
    });

    const savedProject = await newProject.save();
    res.status(201).json(savedProject);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create project', details: error.message });
  }
};

module.exports = {createProject};