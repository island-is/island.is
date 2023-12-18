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
import {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from 'sequelize'

@Table({
  tableName: 'application_status_history',
})
export class ApplicationStatusHistory extends Model<
  InferAttributes<ApplicationStatusHistory>,
  InferCreationAttributes<ApplicationStatusHistory>
> {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
  })
  id!: CreationOptional<string>

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
  readonly created!: CreationOptional<Date>

  @UpdatedAt
  readonly modified!: CreationOptional<Date>
}
