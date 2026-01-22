import dotenv from 'dotenv';
dotenv.config();
import { sequelize, User, Leave } from './models';
import bcrypt from 'bcrypt';
async function setupDatabase() {
  try {
    console.log('Setting up database...');
    
    // Authenticate connection
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    
    // Sync all models
    await sequelize.sync({ force: true }); // Use force: true to recreate tables
    console.log('Database tables created successfully.');
    
    // Create test data
    console.log('Creating test data...');
    
    const hodPassword = await bcrypt.hash('hod123', 10);
    const studentPassword = await bcrypt.hash('student123', 10);
    const hod = await User.create({
      name: 'Dr. John Smith',
      email: 'hod@university.edu',
      password: hodPassword,
      role: 'hod',
    });
    const student = await User.create({
      name: 'John Doe',
      email: 'john.doe@university.edu',
      password: studentPassword,
      role: 'student',
    });
    const student1 = await User.create({
      name: 'Student One',
      email: 'student1@university.edu',
      password: studentPassword,
      role: 'student',
    });
    const student2 = await User.create({
      name: 'Student Two',
      email: 'student2@university.edu',
      password: studentPassword,
      role: 'student',
    });
    const student3 = await User.create({
      name: 'Student Three',
      email: 'student3@university.edu',
      password: studentPassword,
      role: 'student',
    });
    const student4 = await User.create({
      name: 'Student Four',
      email: 'student4@university.edu',
      password: studentPassword,
      role: 'student',
    });
    const student5 = await User.create({
      name: 'Student Five',
      email: 'student5@university.edu',
      password: studentPassword,
      role: 'student',
    });
    await Leave.create({
      studentId: student.id,
      leaveType: 'Sick',
      startDate: '2026-01-10',
      endDate: '2026-01-12',
      reason: 'Fever',
      status: 'pending',
    });
    
    console.log('Test data created successfully!');
    console.log('\nTest Credentials:');
    console.log('HOD Login:');
    console.log('  Username: hod@university.edu');
    console.log('  Password: hod123');
    console.log('  Role: hod');
    console.log('\nStudent Login:');
    console.log('  Username: john.doe@university.edu');
    console.log('  Password: student123');
    console.log('  Role: student');
    console.log('\nAdditional Students:');
    console.log('  Username: student1@university.edu | Password: student123 | Role: student');
    console.log('  Username: student2@university.edu | Password: student123 | Role: student');
    console.log('  Username: student3@university.edu | Password: student123 | Role: student');
    console.log('  Username: student4@university.edu | Password: student123 | Role: student');
    console.log('  Username: student5@university.edu | Password: student123 | Role: student');
    
  } catch (error) {
    console.error('Error setting up database:', error);
  } finally {
    await sequelize.close();
  }
}

setupDatabase();
