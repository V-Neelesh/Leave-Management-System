"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Leave = void 0;
const sequelize_1 = require("sequelize");
const sequelize_2 = require("./sequelize");
const user_1 = require("./user");
class Leave extends sequelize_1.Model {
}
exports.Leave = Leave;
Leave.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    studentId: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: 'users', key: 'id' },
    },
    leaveType: {
        type: sequelize_1.DataTypes.STRING(50),
        allowNull: false,
    },
    startDate: {
        type: sequelize_1.DataTypes.DATEONLY,
        allowNull: false,
    },
    endDate: {
        type: sequelize_1.DataTypes.DATEONLY,
        allowNull: false,
    },
    reason: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
    status: {
        type: sequelize_1.DataTypes.ENUM('pending', 'approved', 'rejected'),
        defaultValue: 'pending',
    },
}, {
    sequelize: sequelize_2.sequelize,
    tableName: 'leaves',
    timestamps: true,
});
Leave.belongsTo(user_1.User, { foreignKey: 'studentId', as: 'student' });
user_1.User.hasMany(Leave, { foreignKey: 'studentId', as: 'leaves' });
