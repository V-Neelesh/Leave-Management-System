import { DataTypes, Model, Sequelize } from 'sequelize';

export class HOD extends Model {
  public hod_id!: number;
  public name!: string;
  public email!: string;
  public department!: string;
  public phone!: string;
}
// Initialization moved to index.ts
