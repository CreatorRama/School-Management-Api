const mysql = require('mysql2');
require('dotenv').config();
const dns = require('dns');


dns.setDefaultResultOrder('ipv4first');

class Database {
  constructor() {
    this.connection = null;
  }

  async connect() {
    const config = {
      host: process.env.MYSQLHOST, 
      user: process.env.MYSQLUSER,
      password: process.env.MYSQLPASSWORD,
      database: process.env.MYSQLDATABASE || 'railway',
      port: parseInt(process.env.MYSQLPORT || '3306'), 
      connectTimeout: 20000,
     
      ssl: { rejectUnauthorized: false },
      
      socketPath: undefined
    };

    try {
      this.connection = await mysql.createConnection(config);
      
      // Test connection
      const [result] = await this.connection.execute('SELECT 1+1 AS test');
      console.log(' MySQL Connected! Test result:', result[0].test);
      
      await this.createTables();
    } catch (error) {
      console.error(' Connection failed with config:', config);
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