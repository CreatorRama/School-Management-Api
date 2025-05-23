const mysql = require('mysql2/promises');
require('dotenv').config();

class Database {
  constructor() {
    this.connection = null;
  }

  async connect() {
    try {
      this.connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'school_management',
        port: process.env.DB_PORT || 3306
      });
      console.log('Connected to MySQL database');
      await this.createTables();
    } catch (error) {
      console.error('Database connection failed:', error.message);
      throw error;
    }
  }

  async createTables() {
    try {
      const createSchoolsTable = `
        CREATE TABLE IF NOT EXISTS schools (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          address VARCHAR(500) NOT NULL,
          latitude FLOAT NOT NULL,
          longitude FLOAT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          INDEX idx_coordinates (latitude, longitude)
        )
      `;
      
      await this.connection.execute(createSchoolsTable);
      console.log('Schools table created/verified');
    } catch (error) {
      console.error('Error creating tables:', error.message);
      throw error;
    }
  }

  getConnection() {
    return this.connection;
  }

  async close() {
    if (this.connection) {
      await this.connection.end();
      console.log('Database connection closed');
    }
  }
}

module.exports = new Database();