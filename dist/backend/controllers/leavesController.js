"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rejectLeave = exports.approveLeave = exports.getAllLeaves = exports.getStudentLeaves = exports.applyLeave = void 0;
const models_1 = require("../models");
async function applyLeave(req, res) {
    try {
        const { leaveType, startDate, endDate, reason } = req.body;
        const user = req.user;
        const studentId = user?.id;
        if (!studentId)
            return res.status(400).json({ success: false, message: 'Missing student' });
        const leave = await models_1.Leave.create({ studentId, leaveType, startDate, endDate, reason });
        res.status(201).json({ success: true, data: leave });
    }
    catch (err) {
        res.status(500).json({ success: false, message: 'Error applying leave', error: err });
    }
}
exports.applyLeave = applyLeave;
async function getStudentLeaves(req, res) {
    try {
        const user = req.user;
        const studentId = user?.id;
        const leaves = await models_1.Leave.findAll({ where: { studentId } });
        res.json({ success: true, data: leaves });
    }
    catch (err) {
        res.status(500).json({ success: false, message: 'Error fetching leaves', error: err });
    }
}
exports.getStudentLeaves = getStudentLeaves;
async function getAllLeaves(req, res) {
    try {
        const leaves = await models_1.Leave.findAll({
            include: [{ model: models_1.User, as: 'student', attributes: ['name', 'email', 'role'] }],
        });
        res.json({ success: true, data: leaves });
    }
    catch (err) {
        res.status(500).json({ success: false, message: 'Error fetching leaves', error: err });
    }
}
exports.getAllLeaves = getAllLeaves;
async function approveLeave(req, res) {
    try {
        const { id } = req.params;
        const leave = await models_1.Leave.findByPk(Number(id));
        if (!leave)
            return res.status(404).json({ success: false, message: 'Leave not found' });
        leave.status = 'approved';
        await leave.save();
        res.json({ success: true, data: leave });
    }
    catch (err) {
        res.status(500).json({ success: false, message: 'Error approving leave', error: err });
    }
}
exports.approveLeave = approveLeave;
async function rejectLeave(req, res) {
    try {
        const { id } = req.params;
        const leave = await models_1.Leave.findByPk(Number(id));
        if (!leave)
            return res.status(404).json({ success: false, message: 'Leave not found' });
        leave.status = 'rejected';
        await leave.save();
        res.json({ success: true, data: leave });
    }
    catch (err) {
        res.status(500).json({ success: false, message: 'Error rejecting leave', error: err });
    }
}
exports.rejectLeave = rejectLeave;
