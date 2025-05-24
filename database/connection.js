const mysql = require('mysql2');
require('dotenv').config();

class Database {
  constructor() {
    this.connection = null;
  }

  async connect() {
    try {
      this.connection = await mysql.createConnection({
        host:"mysql.railway.internal", 
        user: "root", 
        password: "heQvaAVAuOlGebKSstVwlKANYdGSNssC",
        database: "railway",
        port: 3306,
      }).promise();

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