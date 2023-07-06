import { Column, DataType, Model, Table, UpdatedAt } from 'sequelize-typescript'
import { ApplicationStatus } from '../types'

@Table({
  tableName: 'application_status_history',
})
export class ApplicationStatusHistory extends Model {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
  })
  id!: string

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  applicationId!: string

  @Column({
    type: DataType.ENUM,
    values: Object.values(ApplicationStatus),
    allowNull: false,
  })
  oldStatus!: ApplicationStatus

  @Column({
    type: DataType.ENUM,
    values: Object.values(ApplicationStatus),
    allowNull: false,
  })
  newStatus!: ApplicationStatus

  @UpdatedAt
  readonly modified!: Date
}
