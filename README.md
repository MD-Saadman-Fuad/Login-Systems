# 🔐 MERN Stack 6-Module Registration System

A comprehensive authentication system built with MongoDB, Express.js, React, and Node.js featuring 6 different registration modules with universal serial numbering.

## 🌟 Features

- **6 Registration Modules**: Different authentication approaches
- **Universal Serial Numbers**: Automatic numbering (0001, 0002, 0003...)
- **JWT Authentication**: Secure token-based authentication
- **MongoDB Atlas**: Cloud database integration
- **Social Login Simulation**: Google, Facebook, GitHub, LinkedIn
- **OTP Verification**: Email/SMS verification system
- **Modern UI**: Enhanced design with animations and gradients
- **Mobile Responsive**: Optimized for all devices
- **Production Ready**: Deployment configurations included

## 📋 Registration Modules

1. **Module 1**: Complete Profile (Name, Email, Phone, Address, Gender, DOB, Strong Password)
2. **Module 2**: Basic + CAPTCHA (Name, Email, Phone, Simple Password)
3. **Module 3**: Professional (Name, Email, Strong Password)
4. **Module 4**: Email Focus (Email, 6-character password with generator)
5. **Module 5**: Social Login (Google, Facebook, GitHub, LinkedIn authentication)
6. **Module 6**: OTP Verification (Email, Phone, Password + 6-digit OTP)

## 🚀 Quick Start

### Development Setup:

## 📁 Project Structure

```
Login Systems/
├── backend/                 # Node.js/Express server
│   ├── models/             # MongoDB models
│   │   └── User.js         # User model with bcrypt
│   ├── routes/             # API routes
│   │   └── auth.js         # Authentication routes
│   ├── middleware/         # Custom middleware
│   │   └── auth.js         # JWT authentication middleware
│   ├── server.js           # Main server file
│   ├── package.json        # Backend dependencies
│   └── .env                # Environment variables
├── frontend/               # React application
│   ├── public/             # Public files
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── Login.js    # Login component
│   │   │   ├── Register.js # Registration component
│   │   │   ├── Dashboard.js # Protected dashboard
│   │   │   ├── Navbar.js   # Navigation component
│   │   │   └── ProtectedRoute.js # Route protection
│   │   ├── context/        # React Context
│   │   │   └── AuthContext.js # Authentication context
│   │   ├── services/       # API services
│   │   │   └── api.js      # Axios configuration
│   │   ├── App.js          # Main App component
│   │   ├── index.js        # React entry point
│   │   └── index.css       # Global styles
│   ├── package.json        # Frontend dependencies
│   └── .env                # Environment variables
└── package.json            # Root package.json with scripts
```

## 🛠️ Technologies Used

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web framework
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB object modeling
- **JWT**: JSON Web Tokens for authentication
- **bcryptjs**: Password hashing
- **express-validator**: Input validation
- **cors**: Cross-origin resource sharing
- **dotenv**: Environment variable management

### Frontend
- **React**: Frontend framework
- **React Router**: Client-side routing
- **Axios**: HTTP client
- **Context API**: State management

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** (v14 or higher)
- **npm** (v6 or higher)
- **MongoDB** (local installation or MongoDB Atlas)

## 🚀 Installation & Setup

### 1. Clone or Navigate to the Project
```bash
cd "e:\\Login Systems"
```

### 2. Install Root Dependencies
```bash
npm install
```

### 3. Install Backend Dependencies
```bash
cd backend
npm install
```

### 4. Install Frontend Dependencies
```bash
cd ../frontend
npm install
```

### 5. Environment Configuration

#### Backend Environment (.env in backend folder)
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/loginSystem
JWT_SECRET=your_jwt_secret_key_here_change_this_in_production
```

#### Frontend Environment (.env in frontend folder)
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 6. Database Setup

#### Option A: Local MongoDB
1. Install MongoDB locally
2. Start MongoDB service
3. The app will create the database automatically

#### Option B: MongoDB Atlas (Cloud)
1. Create a MongoDB Atlas account
2. Create a new cluster
3. Get your connection string
4. Replace `MONGODB_URI` in backend `.env` file

## 🏃‍♂️ Running the Application

### Development Mode (Recommended)
Run both frontend and backend concurrently:
```bash
npm run dev
```

### Run Backend Only
```bash
npm run server
```

### Run Frontend Only
```bash
npm run client
```

### Production Build
```bash
npm run build
```

## 📱 Usage

1. **Start the application** using `npm run dev`
2. **Frontend** will be available at: http://localhost:3000
3. **Backend API** will be available at: http://localhost:5000
4. **Register** a new account or **login** with existing credentials
5. **Access the dashboard** after successful authentication

## 🔐 API Endpoints

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| POST | `/register` | Register new user | No |
| POST | `/login` | User login | No |
| GET | `/profile` | Get user profile | Yes |

### Request/Response Examples

#### Register User
```javascript
POST /api/auth/register
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

#### Login User
```javascript
POST /api/auth/login
{
  "login": "johndoe", // username or email
  "password": "password123"
}
```

## 🔧 Configuration

### JWT Token
- Tokens expire in 7 days
- Include token in Authorization header: `Bearer <token>`

### Password Security
- Minimum 6 characters
- Automatically hashed with bcrypt

### Database Schema
```javascript
User {
  username: String (unique, required)
  email: String (unique, required)
  password: String (hashed, required)
  firstName: String (required)
  lastName: String (required)
  isActive: Boolean (default: true)
  createdAt: Date (default: now)
}
```

## 🚀 Deployment

### Backend Deployment
1. Set production environment variables
2. Deploy to platforms like Heroku, Railway, or DigitalOcean
3. Update CORS settings for production domain

### Frontend Deployment
1. Build the project: `npm run build`
2. Deploy to platforms like Netlify, Vercel, or AWS S3
3. Update API URL in environment variables

## 🔒 Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Authentication**: Secure token-based auth
- **Input Validation**: Server-side validation
- **CORS Protection**: Configurable cross-origin requests
- **Environment Variables**: Sensitive data protection

## 🚀 Production Deployment

### Quick Deployment Options:

#### Option 1: Vercel + Railway (Recommended)
```bash
# Frontend (Vercel)
cd frontend
npx vercel

# Backend (Railway)
cd backend
npx @railway/cli deploy
```

#### Option 2: Heroku
```bash
# Backend
cd backend
heroku create your-app-backend
git push heroku main

# Frontend (Vercel/Netlify)
cd frontend
npm run build
# Deploy build folder
```

### Pre-Deployment Checklist:
- [ ] Set production environment variables
- [ ] Update API URLs for production
- [ ] Configure MongoDB Atlas
- [ ] Test all 6 registration modules
- [ ] Verify CORS settings

📖 **Full deployment guide**: See [DEPLOYMENT.md](./DEPLOYMENT.md)  
✅ **Deployment checklist**: See [PRODUCTION-CHECKLIST.md](./PRODUCTION-CHECKLIST.md)

## 🤝 Contributing

1. Fork the project
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB Atlas is running
   - Check connection string in `.env`
   - Verify IP whitelist settings

2. **CORS Errors**
   - Check FRONTEND_URL in backend `.env`
   - Verify REACT_APP_API_URL in frontend

3. **Module Registration Issues**
   - Ensure all required fields are filled
   - Check OTP generation for Module 6
   - Verify social login simulation works

4. **Deployment Issues**
   - Follow production checklist
   - Check environment variables
   - Verify build processes

### Development Tips

- Use MongoDB Compass for database visualization
- Install React Developer Tools for debugging
- Use Postman for API testing
- Test each module individually
- Monitor backend logs for errors

## 📞 Support

If you encounter any issues:
1. Check the troubleshooting section
2. Review deployment documentation
3. Verify all environment variables
4. Test locally before deployment

**Live Demo**: [Add your deployed URL here]  
**Backend API**: [Add your backend URL here]

---

Happy coding! 🎉