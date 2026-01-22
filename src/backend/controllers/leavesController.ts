import { Request, Response } from 'express';
import { Leave, User } from '../models';

export async function applyLeave(req: Request, res: Response) {
  try {
    const { leaveType, startDate, endDate, reason } = req.body;
    const user = (req as any).user;
    const studentId = user?.id;
    if (!studentId) return res.status(400).json({ success: false, message: 'Missing student' });
    const leave = await Leave.create({ studentId, leaveType, startDate, endDate, reason });
    res.status(201).json({ success: true, data: leave });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error applying leave', error: err });
  }
}

export async function getStudentLeaves(req: Request, res: Response) {
  try {
    const user = (req as any).user;
    const studentId = user?.id;
    const leaves = await Leave.findAll({ where: { studentId } });
    res.json({ success: true, data: leaves });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching leaves', error: err });
  }
}

export async function getAllLeaves(req: Request, res: Response) {
  try {
    const leaves = await Leave.findAll({
      include: [{ model: User, as: 'student', attributes: ['name', 'email', 'role'] }],
    });
    res.json({ success: true, data: leaves });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching leaves', error: err });
  }
}

export async function approveLeave(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const leave = await Leave.findByPk(Number(id));
    if (!leave) return res.status(404).json({ success: false, message: 'Leave not found' });
    leave.status = 'approved';
    await leave.save();
    res.json({ success: true, data: leave });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error approving leave', error: err });
  }
}

export async function rejectLeave(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const leave = await Leave.findByPk(Number(id));
    if (!leave) return res.status(404).json({ success: false, message: 'Leave not found' });
    leave.status = 'rejected';
    await leave.save();
    res.json({ success: true, data: leave });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error rejecting leave', error: err });
  }
}
