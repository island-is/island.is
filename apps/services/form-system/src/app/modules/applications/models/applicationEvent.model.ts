import {
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript'
import { CreationOptional } from 'sequelize'
import { Application } from './application.model'
import { Value } from './value.model'
import { ApplicationEvents } from '@island.is/form-system/shared'

@Table({ tableName: 'application_event' })
export class ApplicationEvent extends Model<ApplicationEvent> {
  @Column({
    type: DataType.UUID,
    allowNull: false,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  id!: string

  @CreatedAt
  created!: CreationOptional<Date>

  @UpdatedAt
  modified!: CreationOptional<Date>

  @Column({
    type: DataType.ENUM,
    allowNull: false,
    values: Object.values(ApplicationEvents),
  })
  eventType!: string

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  isFileEvent!: boolean

  @ForeignKey(() => Value)
  @Column({
    type: DataType.STRING,
    allowNull: true,
    field: 'value_id',
  })
  valueId!: string

  @ForeignKey(() => Application)
  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'application_id',
  })
  applicationId!: string
}
