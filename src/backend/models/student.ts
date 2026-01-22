import { DataTypes, Model, Sequelize } from 'sequelize';

export class Student extends Model {
  public student_id!: number;
  public name!: string;
  public email!: string;
  public department!: string;
  public year!: string;
  public section!: string;
  public roll_number!: string;
}
// Initialization moved to index.ts
