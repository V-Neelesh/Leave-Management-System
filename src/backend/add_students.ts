import { sequelize, Account, Student } from './models/index';
import bcrypt from 'bcryptjs';

async function addStudents() {
  await sequelize.authenticate();

  // Example students to add
  const students = [
    {
      user_name: 'student2',
      user_password: 'password2',
      name: 'Student Two',
      email: 'student2@example.com',
      department: 'CSE',
      year: '2',
      section: 'A',
      roll_number: 'CSE2002'
    },
    {
      user_name: 'student3',
      user_password: 'password3',
      name: 'Student Three',
      email: 'student3@example.com',
      department: 'CSE',
      year: '3',
      section: 'B',
      roll_number: 'CSE3003'
    }
  ];

  for (const s of students) {
    // Hash password
    const hashed = await bcrypt.hash(s.user_password, 10);
    // Create account
    const account = await Account.create({
      user_name: s.user_name,
      user_password: hashed,
      user_role: 'student'
    });
    // Create student profile
    await Student.create({
      name: s.name,
      email: s.email,
      department: s.department,
      year: s.year,
      section: s.section,
      roll_number: s.roll_number
    });
    console.log(`Added student: ${s.user_name}`);
  }

  await sequelize.close();
}

addStudents().catch(console.error);
