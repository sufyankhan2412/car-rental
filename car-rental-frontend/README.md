# Car Rental Marketplace Frontend

A modern, production-ready frontend for a car rental marketplace built with React, Vite, and TailwindCSS.

## Tech Stack

- **React** with Vite
- **TailwindCSS** for styling
- **React Router** for navigation
- **Axios** for API calls
- **Zustand** for state management
- **Framer Motion** for animations
- **React Hook Form** for forms
- **React Hot Toast** for notifications
- **Lucide React** for icons

## Features

- 🚗 Browse and search cars
- 🔍 Advanced filtering (price, type, seats, transmission)
- 📱 Fully responsive design
- ✨ Smooth animations
- 🔐 User authentication
- 💳 Booking system
- ⭐ Reviews and ratings
- 📊 User dashboard
- 🎨 Modern UI with glassmorphism

## Getting Started

### Prerequisites

- Node.js 16+ and npm

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Update the API base URL in `.env`:
   ```
   VITE_API_BASE_URL=http://localhost:3000/api
   ```

### Development

Run the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build

Build for production:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

## Project Structure

```
src/
├── components/       # Reusable components
│   ├── Navbar.jsx
│   ├── Footer.jsx
│   ├── CarCard.jsx
│   ├── FilterSidebar.jsx
│   └── LoadingSkeleton.jsx
├── pages/           # Page components
│   ├── Home.jsx
│   ├── CarListing.jsx
│   ├── CarDetails.jsx
│   ├── Login.jsx
│   └── Register.jsx
├── services/        # API services
│   ├── api.js
│   ├── authService.js
│   ├── carService.js
│   ├── bookingService.js
│   └── paymentService.js
├── store/           # State management
│   └── useStore.js
├── App.jsx          # Main app component
├── main.jsx         # Entry point
└── index.css        # Global styles
```

## Color Theme

- **Primary**: Emerald/Green (#10B981)
- **Secondary**: Dark Slate (#0F172A)
- **Background**: White
- **Accent**: Light Gray (#F1F5F9)

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## API Integration

The app expects a backend API with the following endpoints:

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Cars
- `GET /api/cars` - Get all cars (with filters)
- `GET /api/cars/:id` - Get car by ID
- `GET /api/cars/featured` - Get featured cars

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings/my-bookings` - Get user bookings
- `POST /api/bookings/calculate-price` - Calculate booking price

## License

MIT
