# Quick Start Guide

## Prerequisites
- Node.js 16+ installed
- npm or yarn package manager

## Installation & Setup

### 1. Install Dependencies
```bash
cd car-rental-frontend
npm install
```

### 2. Configure Environment
Create a `.env` file in the root directory:
```bash
cp .env.example .env
```

Edit `.env` and set your API URL:
```
VITE_API_BASE_URL=http://localhost:3000/api
```

### 3. Start Development Server
```bash
npm run dev
```

The app will be available at: `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

## Project Features

### Implemented Pages
1. **Home** (`/`) - Landing page with hero, featured cars, testimonials
2. **Car Listing** (`/cars`) - Browse all cars with filters
3. **Car Details** (`/cars/:id`) - Individual car details with booking
4. **Login** (`/login`) - User authentication
5. **Register** (`/register`) - New user registration
6. **Booking** (`/booking`) - Complete booking flow
7. **Dashboard** (`/dashboard`) - User dashboard with bookings

### Key Features
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Smooth animations with Framer Motion
- ✅ Form validation with React Hook Form
- ✅ Global state management with Zustand
- ✅ Toast notifications
- ✅ Loading skeletons
- ✅ Protected routes
- ✅ API integration ready

## Mock Data for Testing

Since the backend isn't connected yet, you can test with mock data:

### Mock Cars (add to services/carService.js for testing)
```javascript
const mockCars = [
  {
    _id: '1',
    name: 'Tesla Model 3',
    image: 'https://via.placeholder.com/400x300?text=Tesla+Model+3',
    pricePerDay: 89,
    location: 'San Francisco, CA',
    rating: 4.8,
    seats: 5,
    transmission: 'Automatic',
    fuelType: 'Electric',
    featured: true
  },
  // Add more mock cars...
];
```

## Customization

### Colors
Edit `tailwind.config.js`:
```javascript
colors: {
  primary: '#10B981',    // Change primary color
  secondary: '#0F172A',  // Change secondary color
  accent: '#F1F5F9',     // Change accent color
}
```

### Fonts
Edit `src/index.css` to change Google Fonts import

### Logo
Replace the Car icon in `Navbar.jsx` with your logo

## Deployment

### Build for Production
```bash
npm run build
```

The build output will be in the `dist/` folder.

### Deploy to Vercel
```bash
npm i -g vercel
vercel
```

### Deploy to Netlify
```bash
npm run build
# Drag and drop the dist folder to Netlify
```

## Troubleshooting

### Port Already in Use
If port 5173 is in use, Vite will automatically use the next available port.

### Module Not Found
```bash
rm -rf node_modules package-lock.json
npm install
```

### Tailwind Styles Not Working
Make sure `index.css` is imported in `main.jsx`

## Next Steps

1. Connect to your backend API
2. Add real car images
3. Implement Stripe payment integration
4. Add admin dashboard
5. Deploy to production

## Support

For issues or questions:
- Check the README.md
- Review the PROJECT_STRUCTURE.md
- Check component documentation in code comments

## License
MIT
