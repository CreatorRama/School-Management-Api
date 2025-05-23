const database = require('../database/connection');

class School {
  static async create(schoolData) {
    const connection = database.getConnection();
    const { name, address, latitude, longitude } = schoolData;
    
    const query = `
      INSERT INTO schools (name, address, latitude, longitude) 
      VALUES (?, ?, ?, ?)
    `;
    
    try {
      const [result] = await connection.execute(query, [name, address, latitude, longitude]);
      return {
        id: result.insertId,
        name,
        address,
        latitude,
        longitude
      };
    } catch (error) {
      throw new Error(`Failed to create school: ${error.message}`);
    }
  }

  static async findAll() {
    const connection = database.getConnection();
    const query = 'SELECT * FROM schools ORDER BY created_at DESC';
    
    try {
      const [rows] = await connection.execute(query);
      return rows;
    } catch (error) {
      throw new Error(`Failed to fetch schools: ${error.message}`);
    }
  }

  static async findById(id) {
    const connection = database.getConnection();
    const query = 'SELECT * FROM schools WHERE id = ?';
    
    try {
      const [rows] = await connection.execute(query, [id]);
      return rows[0] || null;
    } catch (error) {
      throw new Error(`Failed to fetch school: ${error.message}`);
    }
  }

  static calculateDistance(lat1, lon1, lat2, lon2) {
    // Haversine formula to calculate distance between two points on Earth
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    
    return Math.round(distance * 100) / 100; // Round to 2 decimal places
  }

  static toRadians(degrees) {
    return degrees * (Math.PI / 180);
  }

  static async findByProximity(userLat, userLon) {
    try {
      const schools = await this.findAll();
      
      const schoolsWithDistance = schools.map(school => ({
        ...school,
        distance: this.calculateDistance(userLat, userLon, school.latitude, school.longitude)
      }));

      // Sort by distance (closest first)
      return schoolsWithDistance.sort((a, b) => a.distance - b.distance);
    } catch (error) {
      throw new Error(`Failed to fetch schools by proximity: ${error.message}`);
    }
  }
}

module.exports = School;