const express = require('express');
const router = express.Router();
const School = require('../models/school.js');
const { validateAddSchool, validateListSchools } = require('../middleware/validation.js');

// Add School API
router.post('/addSchool', validateAddSchool, async (req, res) => {
  try {
    const { name, address, latitude, longitude } = req.body;
    
    const newSchool = await School.create({
      name: name.trim(),
      address: address.trim(),
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude)
    });

    res.status(201).json({
      success: true,
      message: 'School added successfully',
      data: {
        school: newSchool
      }
    });
  } catch (error) {
    console.error('Error adding school:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add school',
      error: error.message
    });
  }
});

// List Schools API
router.get('/listSchools', validateListSchools, async (req, res) => {
  try {
    const { latitude, longitude } = req.query;
    const userLat = parseFloat(latitude);
    const userLon = parseFloat(longitude);
    
    const schools = await School.findByProximity(userLat, userLon);

    res.status(200).json({
      success: true,
      message: 'Schools retrieved successfully',
      data: {
        userLocation: {
          latitude: userLat,
          longitude: userLon
        },
        schools: schools,
        totalCount: schools.length
      }
    });
  } catch (error) {
    console.error('Error fetching schools:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve schools',
      error: error.message
    });
  }
});

// Get single school by ID (bonus endpoint)
router.get('/school/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const school = await School.findById(id);

    if (!school) {
      return res.status(404).json({
        success: false,
        message: 'School not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'School retrieved successfully',
      data: {
        school
      }
    });
  } catch (error) {
    console.error('Error fetching school:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve school',
      error: error.message
    });
  }
});

module.exports = router;
