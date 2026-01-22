import { Router } from 'express';
import { submitLeaveRequest, getStudentLeaveRequests } from '../controllers/studentController';

const router = Router();

// Submit a leave request
router.post('/leave', submitLeaveRequest);

// Get all leave requests for a student
router.get('/leave', getStudentLeaveRequests);

export default router;
