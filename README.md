# Leave Management System - Authentication Setup

This document provides instructions for setting up and testing the authentication system.

## Prerequisites

- Node.js (v14 or higher)
- MySQL database server
- npm (Node package manager)

## Installation

1. **Install Dependencies**
   ```bash
   cd leave-management-system
   npm install
   ```

2. **Database Setup**
   - Ensure MySQL is running
   - Create a database named `lms_db` (or update the DB_NAME in .env)
   - Update the database credentials in `.env` file if needed

3. **Environment Configuration**
   The `.env` file should contain:
   ```
   DB_NAME=lms_db
   DB_USER=root
   DB_PASS=yourpassword
   DB_HOST=127.0.0.1
   DB_PORT=3306
   PORT=3000
   JWT_SECRET=your-very-secure-secret-key-here
   ```

## Setup Database and Test Data

Run the setup script to create database tables and add test users:

```bash
npm run setup
```

This will create:
- Database tables (accounts, students, hods, applications)
- Test HOD user: `hod_admin` / `hod123`
- Test Student user: `student_john` / `student123`

## Running the Application

1. **Development Mode**
   ```bash
   npm run dev
   ```

2. **Production Mode**
   ```bash
   npm run build
   npm start
   ```

The server will run on `http://localhost:3000`

## Testing Authentication

### Manual Testing

1. **Start the server** using one of the commands above
2. **Open the login page** at `http://localhost:3000/login.html`
3. **Test with these credentials:**
   - HOD: Username: `hod_admin`, Password: `hod123`, Role: `hod`
   - Student: Username: `student_john`, Password: `student123`, Role: `student`

### Automated Testing

Run the authentication test script:

```bash
node test-auth.js
```

This will test:
- HOD login
- Student login
- Protected route access
- Invalid credentials handling

## API Endpoints

### Authentication
- `POST /api/login` - User login

### Protected Routes (require JWT token)
- `GET /api/student/profile` - Get student profile
- `GET /api/hod/profile` - Get HOD profile

## Test Credentials

### HOD Account
- **Username:** `hod_admin`
- **Password:** `hod123`
- **Role:** `hod`
- **Name:** Dr. John Smith
- **Department:** Computer Science

### Student Account
- **Username:** `student_john`
- **Password:** `student123`
- **Role:** `student`
- **Name:** John Doe
- **Department:** Computer Science
- **Year:** 3rd Year
- **Section:** A
- **Roll Number:** CS2023001

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Check if MySQL is running
   - Verify database credentials in `.env`
   - Ensure the database `lms_db` exists

2. **Missing Dependencies**
   - Run `npm install` to install all dependencies
   - Check for any installation errors

3. **JWT Token Issues**
   - Ensure `JWT_SECRET` is set in `.env`
   - Check that the token is being sent in the Authorization header

4. **TypeScript Compilation Errors**
   - Run `npm run build` to check for compilation issues
   - Ensure all required type definitions are installed

### Reset Database

To reset the database and start fresh:

1. Drop the existing database
2. Run `npm run setup` again

## Security Notes

- The JWT_SECRET should be a strong, unique string in production
- Passwords are hashed using bcrypt
- All protected routes require valid JWT tokens
- The system uses HTTPS-ready configuration (add SSL certificates for production)

## Next Steps

After authentication is working:
1. Implement additional student and HOD functionality
2. Add leave application features
3. Create admin dashboard
4. Add email notifications
5. Implement role-based permissions
