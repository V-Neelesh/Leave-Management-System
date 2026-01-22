import { Request, Response } from 'express';
import { Application } from '../models/application';
import { Account } from '../models/account';

// Get all leave requests (dashboard)
export async function getAllLeaveRequests(req: Request, res: Response) {
  try {
    const requests = await Application.findAll({
      include: [{ model: Account, attributes: ['user_name', 'user_role'] }],
    });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching leave requests', error: err });
  }
}

// Approve or reject a leave request
export async function updateLeaveStatus(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const application = await Application.findByPk(Number(id));
    if (!application) {
      return res.status(404).json({ success: false, message: 'Leave request not found' });
    }
    application.application_status = status;
    await application.save();
    res.json({ success: true, application });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error updating leave status', error: err });
  }
}
