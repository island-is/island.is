import {
  Column,
  DataType,
  Default,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript'

@Table({ tableName: 'applicationTemplates' })
export class ApplicationTemplate extends Model<ApplicationTemplate> {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: DataType.UUIDV4,
  })
  id!: string
}
