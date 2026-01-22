"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const hodController_1 = require("../controllers/hodController");
const router = (0, express_1.Router)();
// Get all leave requests (dashboard)
router.get('/leave', hodController_1.getAllLeaveRequests);
// Approve or reject a leave request
router.put('/leave/:id', hodController_1.updateLeaveStatus);
exports.default = router;
