const Joi = require('joi');

const validateAddSchool = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string()
      .trim()
      .min(2)
      .max(255)
      .required()
      .messages({
        'string.empty': 'School name is required',
        'string.min': 'School name must be at least 2 characters long',
        'string.max': 'School name cannot exceed 255 characters'
      }),
    
    address: Joi.string()
      .trim()
      .min(5)
      .max(500)
      .required()
      .messages({
        'string.empty': 'Address is required',
        'string.min': 'Address must be at least 5 characters long',
        'string.max': 'Address cannot exceed 500 characters'
      }),
    
    latitude: Joi.number()
      .min(-90)
      .max(90)
      .required()
      .messages({
        'number.base': 'Latitude must be a number',
        'number.min': 'Latitude must be between -90 and 90',
        'number.max': 'Latitude must be between -90 and 90',
        'any.required': 'Latitude is required'
      }),
    
    longitude: Joi.number()
      .min(-180)
      .max(180)
      .required()
      .messages({
        'number.base': 'Longitude must be a number',
        'number.min': 'Longitude must be between -180 and 180',
        'number.max': 'Longitude must be between -180 and 180',
        'any.required': 'Longitude is required'
      })
  });

  const { error } = schema.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: error.details.map(detail => ({
        field: detail.path[0],
        message: detail.message
      }))
    });
  }
  
  next();
};

const validateListSchools = (req, res, next) => {
  const schema = Joi.object({
    latitude: Joi.number()
      .min(-90)
      .max(90)
      .required()
      .messages({
        'number.base': 'Latitude must be a number',
        'number.min': 'Latitude must be between -90 and 90',
        'number.max': 'Latitude must be between -90 and 90',
        'any.required': 'Latitude is required'
      }),
    
    longitude: Joi.number()
      .min(-180)
      .max(180)
      .required()
      .messages({
        'number.base': 'Longitude must be a number',
        'number.min': 'Longitude must be between -180 and 180',
        'number.max': 'Longitude must be between -180 and 180',
        'any.required': 'Longitude is required'
      })
  });

  const { error } = schema.validate(req.query);
  
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: error.details.map(detail => ({
        field: detail.path[0],
        message: detail.message
      }))
    });
  }
  
  next();
};

module.exports = {
  validateAddSchool,
  validateListSchools
};