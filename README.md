<<<<<<< HEAD
# Mentora: Learn. Solve. Grow Together !!

**Mentora** is an all-in-one, student-powered platform built for doubt-solving, mentorship, and freelancing. It’s a space where students help students—whether it’s cracking DSA, preparing for placements, or landing freelance gigs.

> Built for students, by students.

---

## What is Mentora?

Mentora is more than just a platform—it's a **community-driven ecosystem** that turns confusion into clarity and efforts into opportunities. Designed with the everyday student in mind, Mentora empowers you to:

- Ask academic or career-related doubts  
- Get mentorship from peers and pros  
- Build a portfolio by taking or offering freelance projects  


## Mission

> To build a trusted, all-in-one space where students can solve doubts instantly, get mentored by peers, and kickstart freelancing opportunities—empowering every student to learn, grow, and earn together.


## Core Features

### 1. Ask Zone (Doubt-Solving)
- Post doubts in academics, coding, or career topics  
- Tag topics like `DSA`, `DBMS`, `Resume`  
- Get answers from peers, mentors, and upvote helpful ones  

### 2. Mentor Match (Mentorship)
- Get matched with mentors based on goals  
- 1:1 or group sessions, short-term mentorship challenges  
- Example: “Crack Arrays in 5 Days”  

### 3. Freelance Board
- Offer or take student-led gigs (e.g. resume design, dev help)  
- Build experience and earn credits or testimonials  
- Safe space to work with real clients  

### 4. Profile & XP System
- Earn XP and badges for contributions  
- Showcase learning, teaching, and freelance experience  
- Build your student portfolio while helping others  

---

## Tech Stack (Suggested)

- **Frontend:** React.js, Tailwind CSS  
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB  
- **Authentication:** JWT, OAuth (Google)  
- **Others:** Socket.io (for chat), Zoom API / Jitsi (for mentorship calls)  


## Team Roles & Functionalities

### Member 1 – Freelancer Section
- Freelancer registration  
- Portfolio uploads (skills/tags)  
- Task bidding/applications  
- Payment/credit system  
- Ratings & reviews  
- Freelancer dashboard  

### Member 2 – Mentor Section
- Mentor registration/approval  
- Session scheduling & booking  
- In-app chat or call (Zoom/Meet integration)  
- Reviews post-session  
- Earnings dashboard  

### Member 3 – Doubt Section
- Post, search, and discuss doubts  
- Match tutors/freelancers  
- Bookmark & track doubts  
- Forum-like peer discussions  
- Notifications on replies  

### Member 4 – Admin Panel
- Approve mentors/freelancers  
- Manage tags/categories  
- Monitor transactions & analytics  
- Handle reports/blocks  
- Push updates/announcements  

---

## Who Is This For?

- Students stuck in coding or academics  
- Juniors looking for mentors  
- Creatives, coders, or designers wanting freelance work  
- Anyone tired of learning alone  


## Tagline Options

- *Learn. Solve. Grow. Together.*  
- *Mentora — because growth shouldn’t be lonely.*  
- *Your doubts. Your mentors. Your arena.*  


## Contributing

We welcome student developers, designers, and collaborators!  
Please open an issue or a pull request to get started.


## Live Preview

Coming soon...


## Connect With Us

For collaborations, ideas, or issues—feel free to raise an issue or contact us via GitHub.

---

**Mentora – Empowering students to learn, solve, and grow together.**
=======
# Mentora - Learn. Solve. Grow Together

A comprehensive student-powered ecosystem for doubt-solving, mentorship, and freelancing that connects learners, tutors, mentors, and freelancers in one unified platform.

## 🌟 Project Overview

Mentora is a full-stack web application built with React.js (frontend) and Node.js/Express (backend) that provides three core services:

1. **Ask Zone** - Doubt solving and Q&A platform
2. **Mentorship** - One-on-one mentoring sessions with industry experts
3. **Freelance Board** - Project marketplace for freelancers and clients

## 🚀 Features & Functionalities

### 🔐 Authentication & User Management
- **Multi-role Registration**: Students, Tutors, Freelancers, and Admins
- **JWT-based Authentication** with token refresh
- **Role-based Access Control** with protected routes
- **Profile Management** with completion tracking
- **XP & Leveling System** for gamification
- **User Approval System** (Tutors and Freelancers require admin approval)

### 👥 User Roles & Capabilities

#### Students (Auto-approved)
- Ask questions in Ask Zone
- Browse and book mentorship sessions
- View freelance projects
- Earn XP through platform activities

#### Tutors (Requires approval)
- Answer questions in Ask Zone
- Offer mentorship sessions
- Set hourly rates and availability
- Build expertise profile

#### Freelancers (Requires approval)
- Browse and bid on projects
- Create portfolio and services
- Manage project proposals
- Track earnings and project progress

#### Admins
- Approve/reject tutor and freelancer applications
- Manage platform users
- Access analytics and reports

### 🎯 Ask Zone (Q&A Platform)
- **Question Posting** with rich text editor
- **Tagging System** for categorization
- **Search & Filter** functionality
- **Upvoting/Downvoting** system
- **Best Answer Selection**
- **Real-time Notifications**
- **Trending Topics** sidebar
- **Featured Mentors** integration

### 🎓 Mentorship Platform
- **Mentor Discovery** with advanced filtering
- **Profile Browsing** with ratings and reviews
- **Session Booking** with calendar integration
- **Messaging System** for communication
- **Rating & Review System**
- **Availability Management**
- **Expertise-based Matching**

### 💼 Freelance Marketplace
- **Project Posting** with detailed requirements
- **Proposal System** with cover letters
- **Budget Range Management**
- **Skill-based Filtering**
- **Project Status Tracking**
- **Milestone & Payment Management**
- **Client-Freelancer Communication**

### 🎨 UI/UX Features
- **Modern Design** with Styled Components
- **Responsive Layout** for all devices
- **Dark/Light Theme Support**
- **Smooth Animations** with Framer Motion
- **Interactive Components**
- **Loading States** and error handling
- **Toast Notifications**

## 🛠 Technology Stack

### Frontend
- **React 18** with TypeScript
- **Styled Components** for styling
- **Framer Motion** for animations
- **React Router** for navigation
- **React Query** for state management
- **Axios** for API calls
- **Lucide React** for icons

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Express Validator** for input validation
- **Helmet** for security headers
- **Rate Limiting** for API protection
- **CORS** configuration

### Development Tools
- **Concurrently** for running both servers
- **Nodemon** for auto-restart
- **ESLint** and **Prettier** for code quality

## 📡 API Endpoints

### Authentication Routes (`/api/auth`)
```
POST   /register          - Register new user
POST   /login             - User login
GET    /me                - Get current user profile
POST   /refresh           - Refresh JWT token
POST   /logout            - User logout
```

### User Management (`/api/users`)
```
GET    /profile           - Get user profile
PUT    /profile           - Update user profile
PUT    /tutor-profile     - Update tutor-specific profile
PUT    /freelancer-profile - Update freelancer-specific profile
GET    /search            - Search users by name/skills
GET    /leaderboard       - Get top users by XP
GET    /:id               - Get user by ID
POST   /add-xp            - Add XP points to user
```

### Doubts/Questions (`/api/doubts`) - *Coming Soon*
```
GET    /                  - Get all doubts with pagination
POST   /                  - Create new doubt/question
GET    /:id               - Get specific doubt
PUT    /:id               - Update doubt
DELETE /:id               - Delete doubt
POST   /:id/answers       - Add answer to doubt
PUT    /:id/vote          - Vote on doubt/answer
```

### Mentorship (`/api/mentors`) - *Coming Soon*
```
GET    /                  - Get all mentors
GET    /:id               - Get mentor profile
POST   /sessions          - Book mentorship session
GET    /my-sessions       - Get user's sessions
PUT    /sessions/:id      - Update session status
```

### Freelance (`/api/freelance`) - *Coming Soon*
```
GET    /                  - Get all projects
POST   /                  - Create new project
GET    /:id               - Get project details
PUT    /:id               - Update project
DELETE /:id               - Delete project
POST   /:id/apply         - Apply to project
GET    /my-projects       - Get user's projects
GET    /my-proposals      - Get user's proposals
```

### Admin (`/api/admin`) - *Coming Soon*
```
GET    /users             - Get all users (admin only)
PUT    /users/:id/approve - Approve/reject user
GET    /analytics         - Get platform analytics
GET    /reports           - Get detailed reports
```

### Health Check
```
GET    /api/health        - API health status
```

## 🔧 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- npm or yarn package manager

### Environment Variables
Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/mentora

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
JWT_EXPIRE=7d

# Cloudinary Configuration (for file uploads)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Email Configuration (for notifications)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Payment Configuration (for freelance payments)
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

### Installation Steps

1. **Clone the repository**
```bash
git clone <repository-url>
cd Mentora
```

2. **Install dependencies**
```bash
# Install root dependencies
npm install

# Install frontend dependencies
npm run install-client

# Install backend dependencies
npm run install-server

# Or install all at once
npm run install-all
```

3. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Start the application**
```bash
# Development mode (runs both frontend and backend)
npm run dev

# Or run separately
npm run server  # Backend only
npm run client  # Frontend only
```

5. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- API Health Check: http://localhost:5000/api/health

## 🔑 Default Credentials & Test Data

### Test User Accounts
The application uses mock data for demonstration. In production, you would create accounts through the registration system.

**Default Admin Account** (when implemented):
- Email: admin@mentora.com
- Password: admin123
- Role: Admin

**Sample User Roles**:
- **Students**: Auto-approved upon registration
- **Tutors**: Require admin approval after registration
- **Freelancers**: Require admin approval after registration

### Mock Data Available
- **6 Sample Mentors** with different expertise areas
- **4 Sample Freelance Projects** with various skill requirements
- **Sample User Profiles** with different roles and experience levels
- **Mock Proposals and Project Data** for testing

## 🏗 Project Structure

```
Mentora/
├── backend/
│   ├── middleware/
│   │   └── auth.js              # Authentication middleware
│   ├── models/
│   │   └── User.js              # User schema with all roles
│   ├── routes/
│   │   ├── auth.js              # Authentication routes
│   │   ├── users.js             # User management routes
│   │   ├── doubts.js            # Q&A routes (placeholder)
│   │   ├── mentors.js           # Mentorship routes (placeholder)
│   │   ├── freelance.js         # Freelance routes (placeholder)
│   │   └── admin.js             # Admin routes (placeholder)
│   └── server.js                # Express server setup
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       │   ├── common/          # Reusable components
│       │   ├── messaging/       # Chat components
│       │   └── booking/         # Session booking components
│       ├── contexts/
│       │   └── AuthContext.tsx  # Authentication context
│       ├── pages/
│       │   ├── Home.tsx         # Landing page
│       │   ├── Login.tsx        # Login page
│       │   ├── Register.tsx     # Registration page
│       │   ├── Dashboard.tsx    # User dashboard
│       │   ├── AskZone.tsx      # Q&A platform
│       │   ├── Mentors.tsx      # Mentorship platform
│       │   ├── Freelance.tsx    # Freelance marketplace
│       │   └── Profile.tsx      # User profile
│       ├── services/
│       │   └── api.ts           # API service layer
│       ├── styles/
│       │   └── theme.ts         # Styled components theme
│       └── App.tsx              # Main app component
├── .env                         # Environment variables
├── package.json                 # Root package.json
└── README.md                    # This file
```

## 🔒 Security Features

- **JWT Authentication** with secure token handling
- **Password Hashing** using bcryptjs with salt rounds
- **Input Validation** using express-validator
- **Rate Limiting** to prevent API abuse
- **CORS Configuration** for cross-origin requests
- **Helmet** for security headers
- **Role-based Access Control**
- **Protected Routes** on both frontend and backend

## 🎮 Gamification System

- **XP Points** for various activities:
  - Asking questions: +10 XP
  - Answering questions: +20 XP
  - Getting best answer: +50 XP
  - Completing projects: +100 XP
  - Mentoring sessions: +30 XP

- **Level System**: Level = floor(XP / 100) + 1
- **Badges System** for achievements
- **Leaderboard** to encourage participation

## 🚧 Upcoming Features

### Phase 1 (In Development)
- Complete Doubts/Q&A API implementation
- Real-time messaging system
- File upload functionality
- Email notifications

### Phase 2 (Planned)
- Video calling for mentorship sessions
- Payment integration for freelance projects
- Advanced search and filtering
- Mobile app development

### Phase 3 (Future)
- AI-powered question recommendations
- Automated project matching
- Advanced analytics dashboard
- Multi-language support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Mentora Team** - Full-stack development and design

## 📞 Support

For support and questions:
- Email: support@mentora.com
- Phone: +1 (555) 123-4567
- Address: 123 Education St, Learning City, LC 12345

## 🙏 Acknowledgments

- React and Node.js communities for excellent documentation
- All contributors and beta testers
- Educational institutions supporting the project

---

**Made with ❤️ for learners everywhere**

*Last updated: December 2024*
>>>>>>> master
