# MERN Authentication Project

A full-stack MERN (MongoDB, Express.js, React, Node.js) authentication system with email verification and OTP functionality.

## Features

- ✅ User Registration & Login
- ✅ JWT Authentication with HTTP-only cookies
- ✅ Email verification with OTP
- ✅ Password hashing with bcrypt
- ✅ Email sending via Brevo SMTP
- ✅ MongoDB integration with Mongoose
- ✅ React frontend with Vite
- ✅ Tailwind CSS styling
- ✅ Responsive design

## Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Nodemailer** - Email sending
- **Cookie-parser** - Cookie handling
- **CORS** - Cross-origin requests

### Frontend
- **React** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Axios** - HTTP client
- **React Toastify** - Notifications

## Project Structure

```
MernAuth/
├── Server/                 # Backend
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Auth middleware
│   ├── models/            # Database models
│   ├── Routes/            # API routes
│   ├── config/            # Database & email config
│   └── server.js          # Entry point
├── client/vite-project/   # Frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   └── assets/        # Images & icons
│   └── ...
└── .gitignore             # Git ignore rules
```

## Setup Instructions

### Prerequisites
- Node.js (v20+)
- MongoDB Atlas account
- Brevo SMTP account

### Backend Setup
1. Navigate to Server folder:
   ```bash
   cd Server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   SMTP_HOST=smtp-relay.brevo.com
   SMTP_PORT=587
   SMTP_USER=your_brevo_email
   SMTP_PASS=your_brevo_password
   SENDER_EMAIL=your_sender_email
   NODE_ENV=development
   ```

4. Start the server:
   ```bash
   npm start
   # or for development
   npm run server
   ```

### Frontend Setup
1. Navigate to client folder:
   ```bash
   cd client/vite-project
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Email Verification
- `POST /api/auth/send-verify-otp` - Send OTP for verification
- `POST /api/auth/verify-account` - Verify account with OTP

### Debug (Development)
- `POST /api/auth/debug-token` - Debug JWT tokens

## Environment Variables

Create a `.env` file in the Server directory with the following variables:

| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for JWT signing |
| `SMTP_HOST` | SMTP server host |
| `SMTP_PORT` | SMTP server port |
| `SMTP_USER` | SMTP username |
| `SMTP_PASS` | SMTP password |
| `SENDER_EMAIL` | Email address for sending emails |
| `NODE_ENV` | Environment (development/production) |

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Commit your changes
5. Push to the branch
6. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).
