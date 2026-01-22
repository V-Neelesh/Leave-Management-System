"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStudentLeaveRequests = exports.submitLeaveRequest = void 0;
const application_1 = require("../models/application");
// Submit a leave request
async function submitLeaveRequest(req, res) {
    try {
        const { account_id, type_of_leave, date_start, date_end, days_total, leave_reason } = req.body;
        const application = await application_1.Application.create({
            account_id,
            type_of_leave,
            date_start,
            date_end,
            days_total,
            leave_reason,
            application_status: 'Pending',
        });
        res.status(201).json({ success: true, application });
    }
    catch (err) {
        res.status(500).json({ success: false, message: 'Error submitting leave request', error: err });
    }
}
exports.submitLeaveRequest = submitLeaveRequest;
// Get all leave requests for a student
async function getStudentLeaveRequests(req, res) {
    try {
        const { account_id } = req.query;
        const requests = await application_1.Application.findAll({ where: { account_id } });
        res.json(requests);
    }
    catch (err) {
        res.status(500).json({ success: false, message: 'Error fetching leave requests', error: err });
    }
}
exports.getStudentLeaveRequests = getStudentLeaveRequests;
