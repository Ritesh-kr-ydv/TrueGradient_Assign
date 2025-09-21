# TrueGradient Assignment - Full Stack Application

A modern full-stack web application built with React frontend and Node.js backend, featuring user authentication, dashboard functionality, and a credit-based system.

## 🚀 Features

- **User Authentication**: Complete sign-up and sign-in flow with JWT tokens
- **Dashboard**: User dashboard with credits system and notifications
- **Modern UI**: Responsive design built with Tailwind CSS
- **State Management**: Redux Toolkit for efficient state management
- **Secure Backend**: Express.js API with MongoDB and password hashing
- **Real-time Updates**: Dynamic UI updates and notifications

## 🛠️ Tech Stack

### Frontend
- **React 19.1.1** - Modern React with hooks
- **Redux Toolkit** - State management
- **React Router DOM** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API calls
- **React Icons** - Icon library

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

## 📋 Prerequisites

Before running this application, make sure you have:

- **Node.js** (v14 or higher)
- **MongoDB** (local installation or MongoDB Atlas)
- **npm** or **yarn** package manager

## 🔧 Installation & Setup

### 1. Clone the Repository
```bash
git clone <your-repository-url>
cd truegradient_assignment
```

### 2. Install Dependencies

**Frontend Dependencies:**
```bash
npm install
```

**Backend Dependencies:**
```bash
cd backend
npm install
cd ..
```

### 3. Environment Configuration

Create a `.env` file in the `backend` directory:
```env
PORT=5001
MONGODB_URI=mongodb://localhost:27017/truegradient
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
```

### 4. Database Setup

Make sure MongoDB is running on your system:
- **Local MongoDB**: Start MongoDB service
- **MongoDB Atlas**: Use your cloud connection string

## 🚀 Running the Application

### Option 1: Run Both Servers Simultaneously
```bash
npm run dev
```

### Option 2: Run Servers Separately

**Terminal 1 - Backend:**
```bash
npm run server
```

**Terminal 2 - Frontend:**
```bash
npm start
```

## 🌐 Access Points

- **Frontend Application**: http://localhost:3000
- **Backend API**: http://localhost:5001
- **API Health Check**: http://localhost:5001/api/health

## 📁 Project Structure

```
truegradient_assignment/
├── backend/                    # Backend server
│   ├── src/
│   │   ├── controllers/        # Route controllers
│   │   │   └── authController.js
│   │   ├── middleware/         # Custom middleware
│   │   │   └── auth.js
│   │   ├── models/            # Database models
│   │   │   └── User.js
│   │   └── routes/            # API routes
│   │       └── auth.js
│   ├── .env                   # Environment variables
│   ├── server.js              # Server entry point
│   └── package.json
├── src/                       # Frontend React app
│   ├── components/           # Reusable components
│   ├── pages/                # Page components
│   │   ├── Dashboard.js
│   │   ├── SignIn.js
│   │   └── SignUp.js
│   ├── services/             # API services
│   │   └── authService.js
│   ├── store/                # Redux store
│   │   ├── authSlice.js
│   │   └── store.js
│   ├── App.js                # Main App component
│   └── index.js              # Entry point
├── public/                   # Static assets
├── package.json              # Frontend dependencies
└── README.md
```

## 🔌 API Endpoints

### Authentication Routes
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | User registration | No |
| POST | `/api/auth/login` | User login | No |
| GET | `/api/auth/profile` | Get user profile | Yes |

### System Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |

### Request/Response Examples

**Register User:**
```bash
POST /api/auth/register
Content-Type: application/json

{
  "username": "testuser",
  "password": "password123"
}
```

**Login User:**
```bash
POST /api/auth/login
Content-Type: application/json

{
  "username": "testuser",
  "password": "password123"
}
```

**Get Profile (Protected):**
```bash
GET /api/auth/profile
Authorization: Bearer <jwt_token>
```

## 🧪 Testing with Postman

### 1. Health Check
- **Method**: GET
- **URL**: `http://localhost:5001/api/health`

### 2. User Registration
- **Method**: POST
- **URL**: `http://localhost:5001/api/auth/register`
- **Body**: 
```json
{
  "username": "testuser",
  "password": "password123"
}
```

### 3. User Login
- **Method**: POST
- **URL**: `http://localhost:5001/api/auth/login`
- **Body**: 
```json
{
  "username": "testuser",
  "password": "password123"
}
```

### 4. Get Profile
- **Method**: GET
- **URL**: `http://localhost:5001/api/auth/profile`
- **Headers**: `Authorization: Bearer <token_from_login>`

## 🔐 Security Features

- **Password Hashing**: bcryptjs with salt rounds
- **JWT Authentication**: Secure token-based auth
- **Input Validation**: Server-side validation
- **CORS Protection**: Configured for frontend origin
- **Environment Variables**: Sensitive data in .env

## 📱 User Features

### Authentication
- ✅ User registration with validation
- ✅ Secure login with JWT tokens
- ✅ Password visibility toggle
- ✅ Form validation and error handling
- ✅ Persistent login state

### Dashboard
- ✅ User profile display
- ✅ Credits system (default: 100 credits)
- ✅ Notifications panel
- ✅ Responsive design
- ✅ Logout functionality

## 🚧 Development Status

### ✅ Completed Features
- [x] User authentication (signup/login)
- [x] JWT token management
- [x] MongoDB integration
- [x] Redux state management
- [x] Responsive UI design
- [x] API error handling
- [x] Password security
- [x] Dashboard layout

### 🔄 In Progress
- [ ] Chat functionality
- [ ] Real-time notifications
- [ ] Credit transactions
- [ ] Advanced dashboard features

### 📋 Future Enhancements
- [ ] Real-time messaging
- [ ] File uploads
- [ ] Push notifications
- [ ] Admin panel
- [ ] Analytics dashboard

## 🐛 Troubleshooting

### Common Issues

**1. MongoDB Connection Error**
```bash
# Make sure MongoDB is running
mongod
# Or start MongoDB service
```

**2. Port Already in Use**
```bash
# Kill process on port 5001
npx kill-port 5001
# Or change PORT in backend/.env
```

**3. CORS Issues**
- Ensure frontend runs on port 3000
- Check backend CORS configuration

**4. JWT Token Issues**
- Verify JWT_SECRET in .env
- Check token expiration (7 days default)

## 📝 Development Notes

- **State Management**: Uses Redux Toolkit for predictable state updates
- **API Communication**: Axios interceptors handle token attachment
- **Error Handling**: Comprehensive error handling in both frontend and backend
- **Code Organization**: Modular structure with separation of concerns
- **Security**: Passwords are hashed before database storage

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is part of the TrueGradient assignment and is for educational purposes.

## 👨‍💻 Author

**Ritik** - TrueGradient Assignment Submission

---

**Happy Coding! 🚀**