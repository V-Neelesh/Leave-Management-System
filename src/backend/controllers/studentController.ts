import { Request, Response } from 'express';
import { Application } from '../models/application';
import { Account } from '../models/account';

// Submit a leave request
export async function submitLeaveRequest(req: Request, res: Response) {
  try {
    const { account_id, type_of_leave, date_start, date_end, days_total, leave_reason } = req.body;
    const application = await Application.create({
      account_id,
      type_of_leave,
      date_start,
      date_end,
      days_total,
      leave_reason,
      application_status: 'Pending',
    });
    res.status(201).json({ success: true, application });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error submitting leave request', error: err });
  }
}

// Get all leave requests for a student
export async function getStudentLeaveRequests(req: Request, res: Response) {
  try {
    const { account_id } = req.query;
    const requests = await Application.findAll({ where: { account_id } });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching leave requests', error: err });
  }
}
