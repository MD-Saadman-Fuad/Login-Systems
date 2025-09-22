# 🔧 Production Deployment Checklist

## Before Deployment:

### Backend Configuration:
- [ ] Copy `.env.example` to `.env` with production values
- [ ] Generate strong JWT secret (32+ characters)
- [ ] Set `NODE_ENV=production`
- [ ] Configure MongoDB Atlas connection string
- [ ] Update CORS origins with production frontend URL
- [ ] Test health endpoint: `/api/health`

### Frontend Configuration:
- [ ] Set `REACT_APP_API_URL` to production backend URL
- [ ] Test build process: `npm run build`
- [ ] Verify environment variables are loaded correctly
- [ ] Check that all API calls use the environment variable

### Security:
- [ ] Remove any hardcoded secrets or URLs
- [ ] Ensure `.env` files are in `.gitignore`
- [ ] Update default passwords/secrets
- [ ] Enable HTTPS redirects
- [ ] Verify CORS is properly configured

### Database:
- [ ] MongoDB Atlas cluster is running
- [ ] Database user has proper permissions
- [ ] IP whitelist includes deployment server IPs
- [ ] Connection string is correct in environment variables

### Testing:
- [ ] All 6 registration modules work locally
- [ ] JWT authentication functions properly
- [ ] OTP system works as expected
- [ ] Social login simulation works
- [ ] Welcome page displays serial numbers correctly

## Deployment Steps:

### 1. Deploy Backend First:
- [ ] Choose platform (Heroku, Railway, Render, VPS)
- [ ] Set all environment variables
- [ ] Deploy and verify health endpoint
- [ ] Test database connectivity

### 2. Deploy Frontend:
- [ ] Update `REACT_APP_API_URL` to backend URL
- [ ] Deploy to platform (Vercel, Netlify, AWS)
- [ ] Verify static files load correctly
- [ ] Test routing works (React Router)

### 3. Final Testing:
- [ ] Complete user registration flow
- [ ] Test all 6 modules end-to-end
- [ ] Verify serial number generation
- [ ] Check mobile responsiveness
- [ ] Test error handling

## Post-Deployment:

### Monitoring:
- [ ] Set up health check monitoring
- [ ] Configure error logging
- [ ] Monitor database performance
- [ ] Set up alerts for downtime

### Documentation:
- [ ] Update README with deployment URLs
- [ ] Document environment variables
- [ ] Create user manual if needed
- [ ] Update API documentation

## Quick Commands:

### Local Testing:
```bash
# Backend
cd backend && npm start

# Frontend (new terminal)
cd frontend && npm start
```

### Build Testing:
```bash
# Frontend build
cd frontend && npm run build

# Serve build locally
npx serve -s build
```

### Environment Check:
```bash
# Check if all env vars are set
node -e "console.log(process.env.MONGODB_URI ? '✓ DB' : '✗ DB missing')"
node -e "console.log(process.env.JWT_SECRET ? '✓ JWT' : '✗ JWT missing')"
```

## Common Issues:

### CORS Errors:
- Backend not allowing frontend domain
- Missing FRONTEND_URL environment variable
- HTTP vs HTTPS mismatch

### Database Connection:
- Wrong connection string format
- IP not whitelisted in Atlas
- Database user lacks permissions

### Build Failures:
- Missing environment variables
- Node version mismatch
- Dependency conflicts

## Emergency Rollback:
- [ ] Keep previous deployment version tagged
- [ ] Have rollback plan documented
- [ ] Monitor error rates post-deployment
- [ ] Be ready to revert DNS changes if needed