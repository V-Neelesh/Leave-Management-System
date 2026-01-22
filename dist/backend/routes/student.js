"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const studentController_1 = require("../controllers/studentController");
const router = (0, express_1.Router)();
// Submit a leave request
router.post('/leave', studentController_1.submitLeaveRequest);
// Get all leave requests for a student
router.get('/leave', studentController_1.getStudentLeaveRequests);
exports.default = router;
