import { Router } from 'express';
import { authenticateToken, authorizeRole } from '../middleware/auth';
import { applyLeave, getStudentLeaves, getAllLeaves, approveLeave, rejectLeave } from '../controllers/leavesController';

const router = Router();

router.post('/apply', authenticateToken, authorizeRole(['student']), applyLeave);
router.get('/student', authenticateToken, authorizeRole(['student']), getStudentLeaves);
router.get('/all', authenticateToken, authorizeRole(['hod']), getAllLeaves);
router.put('/approve/:id', authenticateToken, authorizeRole(['hod']), approveLeave);
router.put('/reject/:id', authenticateToken, authorizeRole(['hod']), rejectLeave);

export default router;
