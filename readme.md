# School Management API

A comprehensive Node.js REST API for managing school data with proximity-based sorting functionality. Built with Express.js, MySQL, and deployed on Render with PlanetScale database.

## 🌟 Features

- ✅ **Add Schools**: Create new school records with complete validation
- 📍 **Proximity Search**: List schools sorted by distance from user location
- 🔍 **Individual School Lookup**: Get specific school details by ID
- 🛡️ **Input Validation**: Comprehensive data validation using Joi
- 📊 **Distance Calculation**: Haversine formula for accurate geographical distances
- 🚀 **Production Ready**: Deployed and accessible via live endpoints
- 📝 **API Documentation**: Complete Postman collection with tests
- 🗄️ **PlanetScale Integration**: Serverless MySQL database with connection pooling

## 🏗️ Architecture

```
├── server.js              # Main application entry point
├── database/
│   └── connection.js      # Database connection and table setup
├── models/
│   └── School.js          # School data model with business logic
├── routes/
│   └── schools.js         # API route definitions
├── middleware/
│   └── validation.js      # Input validation middleware
├── package.json           # Dependencies and scripts
└── .env                   # Environment configuration
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- PlanetScale account (or MySQL v5.7+ for local development)
- npm or yarn package manager

### Local Installation

1. **Clone the repository**
   ```bash
   git clone <your-repository-url>
   cd school-management-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Database Setup**
   For local development with MySQL:
   ```sql
   CREATE DATABASE school_management;
   ```
   
   For PlanetScale, create a database through their dashboard.

4. **Environment Configuration**
   ```bash
   # Create .env file with your database credentials
   # For local MySQL:
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=school_management
   DB_PORT=3306
   PORT=3000
   
   # For PlanetScale:
   DATABASE_URL=mysql://username:password@host:port/database?ssl={"rejectUnauthorized":true}
   PORT=3000
   ```

5. **Start the application**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## 📡 API Endpoints

### Base URL
- **Local**: `http://localhost:3000`
- **Live**: `https://your-render-url.onrender.com`

### 1. Health Check
```http
GET /health
```
**Response:**
```json
{
  "success": true,
  "message": "School Management API is running",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "version": "1.0.0"
}
```

### 2. Add School
```http
POST /api/addSchool
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Springfield Elementary School",
  "address": "742 Evergreen Terrace, Springfield, IL 62701",
  "latitude": 39.7817,
  "longitude": -89.6501
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "School added successfully",
  "data": {
    "school": {
      "id": 1,
      "name": "Springfield Elementary School",
      "address": "742 Evergreen Terrace, Springfield, IL 62701",
      "latitude": 39.7817,
      "longitude": -89.6501
    }
  }
}
```

### 3. List Schools by Proximity
```http
GET /api/listSchools?latitude=42.3601&longitude=-71.0589
```

**Parameters:**
- `latitude` (required): User's latitude (-90 to 90)
- `longitude` (required): User's longitude (-180 to 180)

**Success Response (200):**
```json
{
  "success": true,
  "message": "Schools retrieved successfully",
  "data": {
    "userLocation": {
      "latitude": 42.3601,
      "longitude": -71.0589
    },
    "schools": [
      {
        "id": 1,
        "name": "MIT",
        "address": "77 Massachusetts Ave, Cambridge, MA 02139, USA",
        "latitude": 42.3601,
        "longitude": -71.0942,
        "distance": 2.84,
        "created_at": "2024-01-15T10:35:00.000Z",
        "updated_at": "2024-01-15T10:35:00.000Z"
      }
    ],
    "totalCount": 1
  }
}
```

### 4. Get School by ID
```http
GET /api/school/:id
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "School retrieved successfully",
  "data": {
    "school": {
      "id": 1,
      "name": "Springfield Elementary School",
      "address": "742 Evergreen Terrace, Springfield, IL 62701",
      "latitude": 39.7817,
      "longitude": -89.6501,
      "created_at": "2024-01-15T10:25:00.000Z",
      "updated_at": "2024-01-15T10:25:00.000Z"
    }
  }
}
```

## 🔍 Validation Rules

### Add School Validation
- **name**: 2-255 characters, required, trimmed
- **address**: 5-500 characters, required, trimmed
- **latitude**: Number between -90 and 90, required
- **longitude**: Number between -180 and 180, required

### List Schools Validation
- **latitude**: Number between -90 and 90, required (query parameter)
- **longitude**: Number between -180 and 180, required (query parameter)

### Error Response Format
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "field": "name",
      "message": "School name is required"
    }
  ]
}
```

## 🗄️ Database Schema

```sql
CREATE TABLE schools (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address VARCHAR(500) NOT NULL,
  latitude FLOAT NOT NULL,
  longitude FLOAT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_coordinates (latitude, longitude)
);
```

## 📐 Distance Calculation

The API uses the **Haversine formula** to calculate the great-circle distance between two points on Earth's surface. This provides accurate proximity-based sorting regardless of the user's location.

**Formula Implementation:**
```javascript
static calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in kilometers
  const dLat = this.toRadians(lat2 - lat1);
  const dLon = this.toRadians(lon2 - lon1);
  
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 100) / 100; // Distance in km, rounded to 2 decimal places
}
```

## 🧪 Testing with Postman

### Postman Collection Features
- ✅ Automated tests for all endpoints
- 🔄 Environment variables for easy URL switching
- 📊 Response validation and distance sorting verification
- 🎯 Error handling test cases
- 📋 Pre-configured example requests

### Import Instructions
1. Download the Postman collection from the repository
2. Open Postman → Import → Select the JSON file
3. Update the `baseUrl` variable to match your deployment:
   - Local: `http://localhost:3000`
   - Production: `https://your-render-url.onrender.com`

### Test Scenarios Included
- Health check verification
- School creation with valid data
- Input validation with invalid data
- Proximity-based school listing
- Distance calculation accuracy
- Individual school retrieval
- Error response handling

## 🚀 Deployment

### Render + PlanetScale Deployment (Current Setup)

1. **Prerequisites**
   - GitHub repository with your code
   - Render account (free tier available)
   - PlanetScale account for database

2. **Database Setup (PlanetScale)**
   ```bash
   # Create database on PlanetScale dashboard
   # Get connection string from PlanetScale
   # Connection string format:
   # mysql://username:password@host:port/database?ssl={"rejectUnauthorized":true}
   ```

3. **Deploy Steps**
   ```bash
   # Push to GitHub
   git push origin main
   
   # In Render dashboard:
   # 1. Create new Web Service from GitHub repo
   # 2. Configure build and start commands
   # 3. Add environment variables
   # 4. Deploy automatically
   ```

4. **Environment Variables for Production**
   ```
   DATABASE_URL=mysql://username:password@host:port/database?ssl={"rejectUnauthorized":true}
   PORT=10000
   NODE_ENV=production
   ```

5. **Render Configuration**
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: Node.js
   - **Auto-Deploy**: Enabled from main branch

### Alternative Deployment Options
- **Railway**: Use MySQL database service
- **Heroku**: Use provided `Procfile` with ClearDB
- **DigitalOcean App Platform**: Direct GitHub integration
- **AWS EC2**: Manual setup with PM2 process manager
- **Vercel**: Serverless deployment (with external database)

## 📊 API Performance & Monitoring

### Response Time Expectations
- Health check: < 100ms
- Add school: < 500ms
- List schools: < 1000ms (varies with dataset size)
- Get school by ID: < 200ms

### Database Optimization (PlanetScale Benefits)
- **Serverless Scaling**: Automatic scaling based on demand
- **Connection Pooling**: Built-in connection management
- **Global Distribution**: Edge locations for faster access
- **Branching**: Database branching for schema changes
- **Insights**: Query performance monitoring
- **Backup & Recovery**: Automated backups

## 🔒 Security Features

- **Input Validation**: Joi schema validation for all inputs
- **SQL Injection Prevention**: Parameterized queries with mysql2
- **CORS Protection**: Configurable cross-origin resource sharing
- **Error Handling**: Sanitized error messages in production
- **Environment Variables**: Sensitive data stored securely
- **SSL/TLS**: Encrypted connections to PlanetScale database

## 🐛 Troubleshooting

### Common Issues

**Database Connection Failed**
```bash
# Check DATABASE_URL format
# Verify PlanetScale database is active
# Confirm SSL settings in connection string
# Check Render environment variables
```

**PlanetScale Specific Issues**
```bash
# Ensure connection string includes SSL configuration
# Verify database branch is not sleeping (hobby plan)
# Check connection limits and current usage
# Confirm database region for optimal performance
```

**Validation Errors**
```bash
# Ensure all required fields are provided
# Check data type formats (numbers for coordinates)
# Verify coordinate ranges (-90/90 for lat, -180/180 for lon)
```

**Distance Calculation Issues**
```bash
# Confirm latitude/longitude are valid numbers
# Check for coordinate system consistency (decimal degrees)
# Verify Haversine formula implementation
```

## 📝 Development Scripts

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "jest"
  }
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support and questions:
- Create an issue in the GitHub repository
- Review the troubleshooting section above
- Check the Postman collection for usage examples

## 🔗 Links

- **Live API**: `https://your-render-url.onrender.com`
- **GitHub Repository**: `https://github.com/yourusername/school-management-api`
- **Postman Collection**: Available in repository
- **Render Dashboard**: Monitor deployment and usage
- **PlanetScale Dashboard**: Database management and monitoring

---

**Built with ❤️ using Node.js, Express.js, MySQL, deployed on Render with PlanetScale database**