# 🚀 AI Resume Builder

A comprehensive MERN stack application that leverages artificial intelligence to help users create professional resumes, track job applications, and get personalized insights for career growth.

![AI Resume Builder](https://img.shields.io/badge/AI-Resume%20Builder-blue?style=for-the-badge&logo=react)
![MERN Stack](https://img.shields.io/badge/MERN-Stack-green?style=for-the-badge&logo=mongodb)
![React](https://img.shields.io/badge/React-18.0-blue?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-18.0-green?style=for-the-badge&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?style=for-the-badge&logo=mongodb)

## ✨ Features

### 🎯 Core Functionality
- **AI-Powered Resume Analysis** - Get intelligent feedback on your resume using HuggingFace models
- **Job Application Tracker** - Manage and track all your job applications in one place
- **Match Score Calculation** - See how well your resume matches job requirements
- **Professional Analytics** - Detailed insights and statistics about your job search
- **User Authentication** - Secure login and registration system
- **Admin Dashboard** - Complete admin panel for user and system management

### 🤖 AI Features
- **Resume Summarization** - Using `facebook/bart-large-cnn` model
- **Missing Keywords Detection** - Using `google/flan-t5-base` model
- **Match Score Analysis** - Intelligent scoring system
- **Improvement Suggestions** - AI-generated recommendations

### 👑 Admin Features
- **User Management** - View, manage, and control user accounts
- **System Analytics** - Comprehensive system statistics and monitoring
- **Job Application Overview** - Monitor all job applications across users
- **Role Management** - Promote users to admin (single admin system)
- **System Health Monitoring** - Real-time system status and performance metrics

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI library
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client for API calls
- **React Hot Toast** - Beautiful notifications
- **CSS3** - Custom styling with animations
- **Context API** - State management

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation

### AI Integration
- **HuggingFace Inference API** - AI model integration
- **Natural Language Processing** - Text analysis and processing

### Database
- **MongoDB Atlas** - Cloud database service

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas account
- HuggingFace account with API key
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/KhaanFaizan/ai-resume-builder.git
   cd ai-resume-builder
   ```

2. **Install dependencies**
   ```bash
   # Install server dependencies
   cd server
   npm install

   # Install client dependencies
   cd ../client
   npm install
   ```

3. **Environment Setup**
   
   Create a `.env` file in the `server` directory:
   ```env
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_jwt_secret_key
   HUGGINGFACE_API_KEY=your_huggingface_api_key
   PORT=5000
   ```

4. **Start the application**
   
   **Terminal 1 - Start the server:**
   ```bash
   cd server
   npm start
   ```
   
   **Terminal 2 - Start the client:**
   ```bash
   cd client
   npm start
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 📱 Usage

### For Regular Users
1. **Register/Login** - Create an account or sign in
2. **Create Resume** - Use the AI analysis tool to improve your resume
3. **Track Jobs** - Add and manage your job applications
4. **View Analytics** - Monitor your job search progress
5. **Update Settings** - Customize your profile and preferences

### For Admins
1. **Admin Registration** - First user can register as admin
2. **User Management** - View and manage all users
3. **System Monitoring** - Monitor system health and performance
4. **Analytics Dashboard** - View comprehensive system statistics
5. **Job Overview** - Monitor all job applications

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/register-admin` - Admin registration
- `GET /api/auth/can-register-admin` - Check admin registration availability
- `GET /api/auth/me` - Get current user

### Job Management
- `GET /api/jobs` - Get user's jobs
- `POST /api/jobs` - Create new job application
- `PUT /api/jobs/:id` - Update job application
- `DELETE /api/jobs/:id` - Delete job application

### AI Analysis
- `POST /api/ai/analyze` - Analyze resume with AI

### Settings
- `GET /api/settings` - Get user settings
- `PUT /api/settings` - Update user settings
- `PUT /api/settings/profile` - Update profile
- `PUT /api/settings/notifications` - Update notifications
- `PUT /api/settings/privacy` - Update privacy settings
- `PUT /api/settings/preferences` - Update preferences
- `PUT /api/settings/security` - Update security settings
- `PUT /api/settings/password` - Change password
- `GET /api/settings/export` - Export user data
- `DELETE /api/settings/account` - Delete account

### Admin (Protected)
- `GET /api/admin/dashboard` - Admin dashboard overview
- `GET /api/admin/users` - Get all users
- `GET /api/admin/users/:id` - Get user details
- `PUT /api/admin/users/:id/status` - Update user status
- `PUT /api/admin/users/:id/promote` - Promote user to admin
- `PUT /api/admin/users/:id/demote` - Demote admin to user
- `DELETE /api/admin/users/:id` - Delete user
- `GET /api/admin/analytics` - System analytics
- `GET /api/admin/jobs` - All job applications
- `GET /api/admin/logs` - System logs

## 🎨 UI/UX Features

### Design System
- **Modern Interface** - Clean, professional design
- **Responsive Layout** - Works on all devices
- **Light Blue Theme** - Consistent color scheme
- **Smooth Animations** - Engaging user interactions
- **Professional Typography** - Easy-to-read fonts

### Components
- **Dashboard** - Main user interface
- **Job Tracker** - Application management
- **AI Analysis** - Resume analysis tool
- **Analytics** - Data visualization
- **Settings** - User preferences
- **Admin Panel** - System administration

## 🔒 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - bcrypt encryption
- **Input Validation** - Server-side validation
- **Role-Based Access** - Admin and user permissions
- **CORS Protection** - Cross-origin request security
- **Environment Variables** - Secure configuration

## 📊 Database Schema

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (user/admin),
  isActive: Boolean,
  lastLogin: Date,
  loginCount: Number,
  lastActivity: Date,
  adminPromotedBy: ObjectId,
  adminPromotedAt: Date
}
```

### Job Model
```javascript
{
  user: ObjectId (ref: User),
  company: String,
  role: String,
  status: String,
  appliedDate: Date,
  deadline: Date,
  matchPercentage: Number,
  notes: String
}
```

### UserSettings Model
```javascript
{
  user: ObjectId (ref: User),
  profile: {
    firstName: String,
    lastName: String,
    phone: String,
    location: String,
    bio: String,
    website: String,
    linkedin: String,
    github: String
  },
  notifications: { /* notification preferences */ },
  privacy: { /* privacy settings */ },
  preferences: { /* app preferences */ },
  security: { /* security settings */ },
  dataManagement: { /* data settings */ }
}
```

## 🚀 Deployment

### Frontend (Netlify/Vercel)
1. Build the React app: `npm run build`
2. Deploy the `build` folder to your hosting service
3. Set environment variables for API endpoints

### Backend (Heroku/Railway)
1. Set up MongoDB Atlas
2. Configure environment variables
3. Deploy the server code
4. Update CORS settings for production

### Environment Variables
```env
MONGODB_URI=your_production_mongodb_uri
JWT_SECRET=your_production_jwt_secret
HUGGINGFACE_API_KEY=your_huggingface_api_key
NODE_ENV=production
PORT=5000
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Faizan**
- GitHub: [@faizanlearner](https://github.com/faizanlearner)
- LinkedIn: [Faizan's LinkedIn](https://linkedin.com/in/faizanlearner)
- Email: faizan.learner@gmail.com

## 🙏 Acknowledgments

- [HuggingFace](https://huggingface.co/) for AI model APIs
- [React](https://reactjs.org/) for the amazing frontend library
- [MongoDB](https://www.mongodb.com/) for the database
- [Express.js](https://expressjs.com/) for the backend framework

## 📈 Roadmap

- [ ] Resume templates
- [ ] PDF export functionality
- [ ] Email notifications
- [ ] Advanced analytics
- [ ] Mobile app
- [ ] Integration with job boards
- [ ] AI-powered cover letter generation
- [ ] Interview preparation tools

## 🐛 Bug Reports

If you find a bug, please open an issue with:
- Description of the bug
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable

## 💡 Feature Requests

Have an idea? We'd love to hear it! Please open an issue with:
- Detailed description
- Use case
- Potential implementation ideas

---

⭐ **Star this repository if you found it helpful!**

![GitHub stars](https://img.shields.io/github/stars/yourusername/ai-resume-builder?style=social)
![GitHub forks](https://img.shields.io/github/forks/yourusername/ai-resume-builder?style=social)
![GitHub issues](https://img.shields.io/github/issues/yourusername/ai-resume-builder?style=social)