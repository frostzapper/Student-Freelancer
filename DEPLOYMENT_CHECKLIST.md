# 🚀 Deployment Checklist - FlashWork

## ✅ Changes Made

### 1. Frontend Configuration
- ✅ Updated `flashwork/frontend/js/config.js` to use production API URL
- ✅ API now points to: `https://payburst-backend.onrender.com/api`

### 2. Dark Theme Implementation
- ✅ Converted `global.css` to dark theme
- ✅ Updated `components.css` for dark theme
- ✅ Updated `landing.css` for dark theme
- ✅ Changed color scheme:
  - Background: `#0F0F0F` (dark black)
  - Secondary: `#1A1A1A` (lighter black)
  - Text: `#FFFFFF` (white)
  - Accent: Orange-Pink gradient (`#FF8C5A` to `#FF8CB8`)

### 3. Component Updates
- ✅ Navbar: Dark with gradient accents
- ✅ Buttons: Gradient backgrounds
- ✅ Cards: Dark backgrounds with colored borders on hover
- ✅ Toast notifications: Dark theme with colored borders
- ✅ Job cards: Dark with gradient top border

## 📋 Deployment Steps

### Step 1: Commit Changes
```bash
git add .
git commit -m "feat: Switch to production API and implement dark theme"
git push origin main
```

### Step 2: Deploy Frontend
If using a static hosting service (Netlify, Vercel, GitHub Pages):
1. Push changes to your repository
2. Service will auto-deploy

If using Render for frontend:
1. Push changes
2. Render will auto-deploy

### Step 3: Verify Backend Environment Variables
Make sure Render has these environment variables:
- `DATABASE_URL` - Your Neon pooled connection URL
- `DIRECT_URL` - Your Neon direct connection URL
- `JWT_SECRET` - Your JWT secret key
- `PORT` - 5000 (optional, Render sets this)

### Step 4: Test Deployment
1. Open your deployed frontend URL
2. Check browser console (F12) for errors
3. Try to register a new account
4. Try to login
5. Check if API calls are working (Network tab)

## 🔄 Switching Between Local and Production

### For Local Development:
Edit `flashwork/frontend/js/config.js`:
```javascript
export const API_BASE_URL = 'http://localhost:5000/api'; // Local
// export const API_BASE_URL = 'https://payburst-backend.onrender.com/api'; // Production
```

### For Production:
Edit `flashwork/frontend/js/config.js`:
```javascript
// export const API_BASE_URL = 'http://localhost:5000/api'; // Local
export const API_BASE_URL = 'https://payburst-backend.onrender.com/api'; // Production
```

## 🎨 Dark Theme Features

### Color Palette:
- **Primary Background**: `#0F0F0F`
- **Secondary Background**: `#1A1A1A`
- **Border Color**: `#2A2A2A`
- **Text Primary**: `#FFFFFF`
- **Text Secondary**: `#A0A0A0`
- **Accent Orange**: `#FF8C5A`
- **Accent Pink**: `#FF8CB8`
- **Accent Green**: `#34D399`
- **Accent Blue**: `#60A5FA`

### Gradient Buttons:
All primary buttons now use orange-pink gradient:
```css
background: linear-gradient(135deg, #FF8C5A, #FF8CB8);
```

### Card Hover Effects:
Cards now have colored borders and shadows on hover:
```css
border-color: var(--accent-orange);
box-shadow: 0 8px 24px rgba(255, 140, 90, 0.3);
```

## 🐛 Troubleshooting

### Frontend not showing changes:
1. Clear browser cache (Ctrl+Shift+Delete)
2. Hard refresh (Ctrl+F5)
3. Check if files are deployed (view source)

### API calls failing:
1. Check backend is deployed and running
2. Verify environment variables in Render
3. Check CORS settings in backend
4. Look at Network tab in browser DevTools

### Dark theme not applying:
1. Check if CSS files are loaded (Network tab)
2. Verify no CSS conflicts
3. Check browser console for CSS errors

## 📊 Verification Checklist

After deployment, verify:
- [ ] Frontend loads without errors
- [ ] Dark theme is applied correctly
- [ ] Can register new account
- [ ] Can login successfully
- [ ] Can navigate between pages
- [ ] API calls work (check Network tab)
- [ ] Buttons have gradient backgrounds
- [ ] Cards have dark backgrounds
- [ ] Hover effects work correctly
- [ ] Toast notifications appear correctly

## 🔐 Security Notes

- ✅ API URL is in config file (not hardcoded)
- ✅ No sensitive data in frontend code
- ✅ Environment variables used for backend secrets
- ✅ HTTPS used for production API

## 📝 Next Steps

1. Test all features in production
2. Monitor backend logs for errors
3. Check database for test data
4. Set up monitoring/alerts
5. Configure custom domain (optional)

---

**Deployment Date**: {{ DATE }}
**Version**: 2.0.0 - Dark Theme
**Status**: Ready for Production ✅
