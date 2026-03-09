# Deployment Guide

## Pre-Deployment Checklist

- [ ] All dependencies installed
- [ ] Environment variables configured
- [ ] Backend API URL set
- [ ] Build tested locally
- [ ] No console errors
- [ ] Responsive design verified

## Environment Variables

Create a `.env` file:
```env
VITE_API_BASE_URL=https://your-api-url.com/api
```

For production, set this in your hosting platform's environment settings.

## Build for Production

```bash
npm run build
```

This creates an optimized build in the `dist/` folder.

## Deployment Options

### 1. Vercel (Recommended)

**Via CLI:**
```bash
npm i -g vercel
vercel
```

**Via Git:**
1. Push code to GitHub
2. Import project on vercel.com
3. Set environment variables
4. Deploy

**Configuration:**
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

### 2. Netlify

**Via CLI:**
```bash
npm i -g netlify-cli
npm run build
netlify deploy --prod
```

**Via Drag & Drop:**
1. Run `npm run build`
2. Drag `dist` folder to netlify.com/drop

**Configuration:**
- Build Command: `npm run build`
- Publish Directory: `dist`

### 3. AWS S3 + CloudFront

```bash
# Build
npm run build

# Install AWS CLI
# Configure credentials
aws configure

# Create S3 bucket
aws s3 mb s3://your-bucket-name

# Upload files
aws s3 sync dist/ s3://your-bucket-name

# Enable static website hosting
aws s3 website s3://your-bucket-name --index-document index.html
```

### 4. DigitalOcean App Platform

1. Connect GitHub repository
2. Configure build settings:
   - Build Command: `npm run build`
   - Output Directory: `dist`
3. Add environment variables
4. Deploy

### 5. Docker

Create `Dockerfile`:
```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Create `nginx.conf`:
```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

Build and run:
```bash
docker build -t car-rental-frontend .
docker run -p 80:80 car-rental-frontend
```

## Post-Deployment

### 1. Verify Deployment
- [ ] All pages load correctly
- [ ] API calls work
- [ ] Images display
- [ ] Forms submit
- [ ] Routing works
- [ ] Mobile responsive

### 2. Performance Optimization
- Enable gzip compression
- Set up CDN
- Configure caching headers
- Optimize images
- Enable HTTP/2

### 3. Security
- [ ] HTTPS enabled
- [ ] CORS configured
- [ ] Environment variables secure
- [ ] No sensitive data in code
- [ ] CSP headers set

### 4. Monitoring
- Set up error tracking (Sentry)
- Configure analytics (Google Analytics)
- Monitor performance (Lighthouse)
- Set up uptime monitoring

## Custom Domain

### Vercel
```bash
vercel domains add yourdomain.com
```

### Netlify
1. Go to Domain Settings
2. Add custom domain
3. Configure DNS records

## CI/CD Pipeline

### GitHub Actions

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

## Troubleshooting

### Build Fails
```bash
# Clear cache
rm -rf node_modules package-lock.json
npm install
npm run build
```

### 404 on Refresh
Configure your hosting to redirect all routes to `index.html`

**Netlify** - Create `public/_redirects`:
```
/*    /index.html   200
```

**Vercel** - Create `vercel.json`:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/" }]
}
```

### Environment Variables Not Working
- Ensure variables start with `VITE_`
- Restart dev server after changes
- Check hosting platform settings

### Slow Load Times
- Enable compression
- Optimize images
- Use CDN
- Implement code splitting
- Enable caching

## Rollback

### Vercel
```bash
vercel rollback
```

### Netlify
Use the Netlify dashboard to rollback to previous deployment

## Maintenance

### Update Dependencies
```bash
npm update
npm audit fix
```

### Monitor Bundle Size
```bash
npm run build
# Check dist folder size
```

### Performance Testing
```bash
npm install -g lighthouse
lighthouse https://your-site.com
```

## Support

For deployment issues:
1. Check hosting platform docs
2. Review build logs
3. Test locally first
4. Check environment variables
5. Verify API connectivity

---

**Recommended**: Start with Vercel or Netlify for easiest deployment with automatic CI/CD.
