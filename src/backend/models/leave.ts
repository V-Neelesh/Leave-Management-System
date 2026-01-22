import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from './sequelize';
import { User } from './user';

export interface LeaveAttributes {
  id: number;
  studentId: number;
  leaveType: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface LeaveCreationAttributes extends Optional<LeaveAttributes, 'id' | 'status'> {}

export class Leave extends Model<LeaveAttributes, LeaveCreationAttributes> implements LeaveAttributes {
  public id!: number;
  public studentId!: number;
  public leaveType!: string;
  public startDate!: string;
  public endDate!: string;
  public reason!: string;
  public status!: 'pending' | 'approved' | 'rejected';
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Leave.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    studentId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: { model: 'users', key: 'id' },
    },
    leaveType: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    reason: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected'),
      defaultValue: 'pending',
    },
  },
  {
    sequelize,
    tableName: 'leaves',
    timestamps: true,
  }
);

Leave.belongsTo(User, { foreignKey: 'studentId', as: 'student' });
User.hasMany(Leave, { foreignKey: 'studentId', as: 'leaves' });
