import { DataTypes, Model, Sequelize } from 'sequelize';

export class Account extends Model {
  public account_id!: number;
  public user_name!: string;
  public user_password!: string;
  public user_role!: 'student' | 'hod';
}
// Initialization moved to index.ts
