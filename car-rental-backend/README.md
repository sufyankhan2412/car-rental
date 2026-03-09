# Car Rental Marketplace - Backend API

RESTful API for the car rental marketplace built with Node.js, Express, and MongoDB.

## Features

- ✅ User authentication with JWT
- ✅ Role-based access control (User/Admin)
- ✅ Car management (CRUD operations)
- ✅ Booking system with availability checking
- ✅ Price calculation
- ✅ MongoDB database with Mongoose
- ✅ Input validation
- ✅ Error handling
- ✅ CORS enabled

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Validation**: express-validator

## Prerequisites

- Node.js 16+ installed
- MongoDB installed and running locally OR MongoDB Atlas account

## Installation

### 1. Install Dependencies

```bash
cd car-rental-backend
npm install
```

### 2. Configure Environment

Create a `.env` file:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/car-rental
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### 3. Start MongoDB

**Local MongoDB:**
```bash
mongod
```

**Or use MongoDB Atlas** (cloud):
- Create account at mongodb.com/cloud/atlas
- Create cluster
- Get connection string
- Update MONGODB_URI in .env

### 4. Seed Database

Populate with sample data:

```bash
node seed.js
```

This creates:
- Admin user: `admin@driveeasy.com` / `admin123`
- Sample user: `john@example.com` / `password123`
- 8 sample cars

### 5. Start Server

**Development mode:**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

Server runs at: `http://localhost:3000`

## API Endpoints

### Authentication

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/auth/register` | Register new user | Public |
| POST | `/api/auth/login` | Login user | Public |
| GET | `/api/auth/me` | Get current user | Private |
| PUT | `/api/auth/profile` | Update profile | Private |

### Cars

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/cars` | Get all cars (with filters) | Public |
| GET | `/api/cars/featured` | Get featured cars | Public |
| GET | `/api/cars/:id` | Get single car | Public |
| GET | `/api/cars/:id/availability` | Check availability | Public |
| POST | `/api/cars` | Create car | Admin |
| PUT | `/api/cars/:id` | Update car | Admin |
| DELETE | `/api/cars/:id` | Delete car | Admin |

### Bookings

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/bookings` | Create booking | Private |
| GET | `/api/bookings/my-bookings` | Get user bookings | Private |
| GET | `/api/bookings/:id` | Get booking details | Private |
| PUT | `/api/bookings/:id/cancel` | Cancel booking | Private |
| POST | `/api/bookings/calculate-price` | Calculate price | Public |
| GET | `/api/bookings` | Get all bookings | Admin |
| PUT | `/api/bookings/:id/status` | Update status | Admin |

## API Examples

### Register User

```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "password": "password123",
  "phone": "+1234567890"
}
```

### Login

```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "jane@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "_id": "...",
  "name": "Jane Smith",
  "email": "jane@example.com",
  "role": "user",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Get Cars with Filters

```bash
GET /api/cars?vehicleType=SUV&priceRange=50,150&seats=5&sortBy=price-low
```

### Create Booking

```bash
POST /api/bookings
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "carId": "car_id_here",
  "startDate": "2024-03-15",
  "endDate": "2024-03-20",
  "pickupLocation": "123 Main St, City",
  "deliveryOption": false
}
```

## Database Models

### User
- name, email, password (hashed)
- phone, role (user/admin)
- isVerified, verificationDocuments
- address, avatar

### Car
- name, description, brand, model, year
- pricePerDay, location
- seats, transmission, fuelType, vehicleType
- images, features
- rating, reviews
- available, featured
- owner (ref: User)

### Booking
- user (ref: User)
- car (ref: Car)
- startDate, endDate
- pickupLocation, deliveryOption
- totalPrice, status
- paymentStatus, extras

## Error Handling

All errors return JSON:

```json
{
  "success": false,
  "message": "Error message here"
}
```

Status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Server Error

## Authentication

Protected routes require JWT token in header:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

Get token from login/register response.

## Project Structure

```
car-rental-backend/
├── config/
│   └── db.js              # Database connection
├── controllers/
│   ├── authController.js  # Auth logic
│   ├── carController.js   # Car logic
│   └── bookingController.js # Booking logic
├── middleware/
│   ├── auth.js            # JWT verification
│   └── errorHandler.js    # Error handling
├── models/
│   ├── User.js            # User schema
│   ├── Car.js             # Car schema
│   └── Booking.js         # Booking schema
├── routes/
│   ├── authRoutes.js      # Auth endpoints
│   ├── carRoutes.js       # Car endpoints
│   └── bookingRoutes.js   # Booking endpoints
├── utils/
│   └── generateToken.js   # JWT helper
├── .env                   # Environment variables
├── server.js              # Entry point
├── seed.js                # Database seeder
└── package.json
```

## Testing

Test the API:

```bash
# Health check
curl http://localhost:3000/api/health

# Get cars
curl http://localhost:3000/api/cars

# Get featured cars
curl http://localhost:3000/api/cars/featured
```

## Deployment

### Heroku

```bash
heroku create your-app-name
heroku config:set MONGODB_URI=your-mongodb-uri
heroku config:set JWT_SECRET=your-secret
git push heroku main
```

### Railway

1. Connect GitHub repo
2. Add environment variables
3. Deploy

### Render

1. Create Web Service
2. Connect repo
3. Add environment variables
4. Deploy

## Security

- Passwords hashed with bcrypt
- JWT for authentication
- CORS enabled
- Input validation
- MongoDB injection protection
- Rate limiting (recommended for production)

## Future Enhancements

- [ ] Stripe payment integration
- [ ] Email notifications
- [ ] File upload for car images
- [ ] Reviews and ratings system
- [ ] Advanced search
- [ ] Real-time availability
- [ ] Admin dashboard analytics
- [ ] Verification system

## License

MIT

## Support

For issues or questions, check the documentation or create an issue.
