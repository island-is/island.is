import { Table, Model, Column } from "sequelize-typescript";

@Table
export class Profile extends Model<Profile> {
  @Column
  profile_id: string
}