# Project Tracker Application

## Description
The Task Tracker Application is a full-stack MERN (MongoDB, Express, React, Node.js) project designed to help users manage their tasks efficiently. It allows users to create, update, delete, and track tasks with a user-friendly interface.

## Features
- User authentication and authorization.
- Create, read, update, and delete tasks.
- Secure API endpoints with JWT authentication.
- Input sanitization and protection against XSS and NoSQL injection.
- Responsive frontend built with React.
- Backend API built with Express and MongoDB.

## Installation

### Backend Setup
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend` directory and configure the following:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   NODE_ENV=
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRES_IN=
   EMAIL=set email
   PASSWORD=set app password for nodemailer
   ```
4. Start the backend server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `frontend` directory and configure the following:
   VITE_API_URL=http://localhost:5000
   ```
4. Build the frontend:
   ```bash
   npm run build
   ```

## Scripts
- `npm run dev`: Start the backend server in development mode.
- `npm run prod`: Start the backend server in production mode.

## Technologies Used
- **Frontend**: React, HTML, CSS
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Authentication**: JSON Web Tokens (JWT)
- **Security**: express-mongo-sanitize, xss-clean

## Author
Manish Mandal

## License
This project is licensed under the ISC License.