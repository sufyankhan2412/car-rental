# Backend Setup Guide

## Quick Start (Without MongoDB)

If you don't have MongoDB installed, you can use MongoDB Atlas (free cloud database):

### Option 1: MongoDB Atlas (Recommended - No Installation)

1. **Create Free Account**
   - Go to https://www.mongodb.com/cloud/atlas
   - Sign up for free account
   - Create a free cluster (M0)

2. **Get Connection String**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - It looks like: `mongodb+srv://username:password@cluster.mongodb.net/car-rental`

3. **Update .env File**
   ```env
   MONGODB_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/car-rental?retryWrites=true&w=majority
   ```

4. **Whitelist Your IP**
   - In Atlas, go to Network Access
   - Click "Add IP Address"
   - Choose "Allow Access from Anywhere" (for development)

5. **Run Seed Script**
   ```bash
   node seed.js
   ```

6. **Start Server**
   ```bash
   npm run dev
   ```

### Option 2: Local MongoDB

1. **Install MongoDB**
   
   **Windows:**
   - Download from https://www.mongodb.com/try/download/community
   - Run installer
   - MongoDB Compass (GUI) is included

   **Mac:**
   ```bash
   brew tap mongodb/brew
   brew install mongodb-community
   brew services start mongodb-community
   ```

   **Linux:**
   ```bash
   sudo apt-get install mongodb
   sudo systemctl start mongodb
   ```

2. **Verify MongoDB is Running**
   ```bash
   mongosh
   # or
   mongo
   ```

3. **Keep Default .env**
   ```env
   MONGODB_URI=mongodb://localhost:27017/car-rental
   ```

4. **Run Seed Script**
   ```bash
   node seed.js
   ```

5. **Start Server**
   ```bash
   npm run dev
   ```

## Testing the API

Once the server is running, test it:

```bash
# Health check
curl http://localhost:3000/api/health

# Get featured cars
curl http://localhost:3000/api/cars/featured

# Register user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@test.com","password":"test123","phone":"+1234567890"}'
```

## Default Login Credentials

After running seed script:

**Admin:**
- Email: `admin@driveeasy.com`
- Password: `admin123`

**User:**
- Email: `john@example.com`
- Password: `password123`

## Troubleshooting

### MongoDB Connection Error

**Error:** `MongooseServerSelectionError: connect ECONNREFUSED`

**Solution:**
- Make sure MongoDB is running
- Check MONGODB_URI in .env
- For Atlas, check IP whitelist

### Port Already in Use

**Error:** `EADDRINUSE: address already in use :::3000`

**Solution:**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3000 | xargs kill -9
```

### Seed Script Fails

**Solution:**
- Make sure MongoDB is running
- Delete existing data: `mongosh` then `use car-rental` then `db.dropDatabase()`
- Run seed again

## Environment Variables

Required variables in `.env`:

```env
# Server
PORT=3000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/car-rental

# JWT
JWT_SECRET=your-super-secret-key-change-in-production
JWT_EXPIRE=7d

# Frontend (for CORS)
FRONTEND_URL=http://localhost:5173

# Optional: Stripe (for payments)
STRIPE_SECRET_KEY=sk_test_your-key
STRIPE_PUBLISHABLE_KEY=pk_test_your-key
```

## Next Steps

1. ✅ Install MongoDB or setup Atlas
2. ✅ Configure .env
3. ✅ Run seed script
4. ✅ Start server
5. ✅ Test API endpoints
6. ✅ Connect frontend

## API Documentation

See README.md for complete API documentation.

## Production Deployment

For production:
1. Use MongoDB Atlas
2. Set strong JWT_SECRET
3. Enable rate limiting
4. Use HTTPS
5. Set NODE_ENV=production
6. Configure proper CORS origins
