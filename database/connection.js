const mysql = require('mysql2');
require('dotenv').config();

class Database {
  constructor() {
    this.pool = null;
  }

  async connect() {
    const config = {
      host: process.env.MYSQLHOST,
      user: process.env.MYSQLUSER,
      password: process.env.MYSQLPASSWORD,
      database: process.env.MYSQLDATABASE,
      port: parseInt(process.env.MYSQLPORT || '3306'),
      ssl: {
        rejectUnauthorized: true
      },
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    };

    try {
      this.pool = mysql.createPool(config).promise();
      console.log(' MySQL connection pool created');

      // Test connection
      const [rows] = await this.pool.query('SELECT 1 + 1 AS result');
      console.log('Connection test result:', rows[0].result);

      await this.createTables();
    } catch (error) {
      console.error(' Connection failed:', error.message);
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
      )`; 

      await this.pool.execute(createSchoolsTable);
      console.log(' Schools table verified');
    } catch (error) {
      console.error(' Table creation failed:', error.message);
      throw error;
    }
  }

  getConnection() {
    return this.pool;
  }

  async close() {
    if (this.pool) {
      await this.pool.end();
      console.log(' Connection pool closed');
    }
  }
}

module.exports = new Database();