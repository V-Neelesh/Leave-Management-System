import { Router } from 'express';
import { getAllLeaveRequests, updateLeaveStatus } from '../controllers/hodController';

const router = Router();

// Get all leave requests (dashboard)
router.get('/leave', getAllLeaveRequests);

// Approve or reject a leave request
router.put('/leave/:id', updateLeaveStatus);

export default router;
