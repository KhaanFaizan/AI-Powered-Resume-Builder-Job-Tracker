# AI Resume Builder - MERN Stack Application

A full-stack web application for building professional resumes with AI assistance, built using MongoDB, Express.js, React, and Node.js.

## Features

### Backend
- **Authentication System**: JWT-based authentication with bcrypt password hashing
- **User Management**: Complete user registration, login, and profile management
- **MongoDB Integration**: MongoDB Atlas connection with Mongoose ODM
- **API Endpoints**: RESTful APIs for authentication and user management
- **Input Validation**: Express-validator for request validation
- **Security**: Password hashing, JWT tokens, and CORS protection

### Frontend
- **Modern React**: Built with React 18 and functional components
- **Authentication Context**: Global state management for user authentication
- **Protected Routes**: Route protection based on authentication status
- **Form Validation**: Client-side validation with real-time error feedback
- **Toast Notifications**: User-friendly notifications for success/error messages
- **Responsive Design**: Mobile-first responsive design with CSS
- **Professional UI/UX**: Clean, modern interface with gradient designs

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB (Atlas)
- Mongoose
- JWT (jsonwebtoken)
- bcryptjs
- express-validator
- cors
- dotenv

### Frontend
- React 18
- React Router DOM
- Axios
- React Hot Toast
- CSS3 (Custom styling)

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account
- Git

### Backend Setup

1. **Navigate to server directory:**
   ```bash
   cd server
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   Create a `.env` file in the root directory with:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```

4. **Start the server:**
   ```bash
   npm run dev
   ```

### Frontend Setup

1. **Navigate to client directory:**
   ```bash
   cd client
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```

### Quick Start (Both Backend & Frontend)

1. **Install all dependencies:**
   ```bash
   npm run install-all
   ```

2. **Start both servers:**
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user (protected)

### Health Check
- `GET /health` - Server health status

## Project Structure

```
AI_Resume_Builder/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── contexts/       # React contexts
│   │   └── ...
│   └── package.json
├── server/                 # Express backend
│   ├── config/            # Configuration files
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Custom middleware
│   ├── models/           # Database models
│   ├── routers/          # API routes
│   ├── server.js         # Main server file
│   └── package.json
├── package.json          # Root package.json
└── README.md
```

## Features Overview

### Authentication System
- **Registration**: Users can create accounts with email validation
- **Login**: Secure login with JWT token generation
- **Protected Routes**: Automatic redirection for unauthenticated users
- **Password Security**: bcrypt hashing with salt rounds
- **Form Validation**: Both client-side and server-side validation

### User Interface
- **Landing Page**: Professional homepage with feature showcase
- **Login/Register Forms**: Clean, validated forms with error handling
- **Dashboard**: User dashboard with account information
- **Responsive Design**: Works on all device sizes
- **Toast Notifications**: Real-time feedback for user actions

### Security Features
- **JWT Tokens**: Secure authentication tokens
- **Password Hashing**: bcrypt with salt rounds
- **Input Validation**: Comprehensive validation on both ends
- **CORS Protection**: Cross-origin request security
- **Environment Variables**: Secure configuration management

## Environment Variables

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=5000

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key_here
```

## Development

### Running in Development Mode
```bash
# Install all dependencies
npm run install-all

# Start both frontend and backend
npm run dev
```

### Individual Server Commands
```bash
# Backend only
cd server && npm run dev

# Frontend only
cd client && npm start
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, email support@airesumebuilder.com or create an issue in the repository.
