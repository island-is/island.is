import {
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript'
import { Application } from './application'
import { ApplicationStatus } from '@island.is/university-gateway'

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
  @ForeignKey(() => Application)
  applicationId!: string

  @Column({
    type: DataType.ENUM,
    values: Object.values(ApplicationStatus),
    allowNull: false,
  })
  status!: ApplicationStatus

  @CreatedAt
  readonly created!: Date

  @UpdatedAt
  readonly modified!: Date
}
