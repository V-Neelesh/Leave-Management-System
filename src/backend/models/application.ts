import { DataTypes, Model, Sequelize } from 'sequelize';

export class Application extends Model {
  public application_id!: number;
  public account_id!: number;
  public type_of_leave!: string;
  public date_start!: Date;
  public date_end!: Date;
  public days_total!: number;
  public leave_reason!: string;
  public application_status!: 'Pending' | 'Approved' | 'Rejected';
}
// Initialization moved to index.ts
