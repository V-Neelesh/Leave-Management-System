"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateLeaveStatus = exports.getAllLeaveRequests = void 0;
const application_1 = require("../models/application");
const account_1 = require("../models/account");
// Get all leave requests (dashboard)
async function getAllLeaveRequests(req, res) {
    try {
        const requests = await application_1.Application.findAll({
            include: [{ model: account_1.Account, attributes: ['user_name', 'user_role'] }],
        });
        res.json(requests);
    }
    catch (err) {
        res.status(500).json({ success: false, message: 'Error fetching leave requests', error: err });
    }
}
exports.getAllLeaveRequests = getAllLeaveRequests;
// Approve or reject a leave request
async function updateLeaveStatus(req, res) {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const application = await application_1.Application.findByPk(Number(id));
        if (!application) {
            return res.status(404).json({ success: false, message: 'Leave request not found' });
        }
        application.application_status = status;
        await application.save();
        res.json({ success: true, application });
    }
    catch (err) {
        res.status(500).json({ success: false, message: 'Error updating leave status', error: err });
    }
}
exports.updateLeaveStatus = updateLeaveStatus;
