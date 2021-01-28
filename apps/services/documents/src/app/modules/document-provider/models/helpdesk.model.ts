import {
  Column,
  DataType,
  Model,
  Table,
  CreatedAt,
  UpdatedAt,
  ForeignKey,
} from 'sequelize-typescript'
import { ApiProperty } from '@nestjs/swagger'
import { Organisation } from './organisation.model'

@Table({ tableName: 'helpdesk' })
export class Helpdesk extends Model<Helpdesk> {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: DataType.UUIDV4,
  })
  @ApiProperty()
  id!: string

  @ForeignKey(() => Organisation)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  organisationId!: string

  @Column({
    type: DataType.STRING,
  })
  @ApiProperty()
  email?: string

  @Column({
    type: DataType.STRING,
  })
  @ApiProperty()
  phoneNumber?: string

  @CreatedAt
  @ApiProperty()
  readonly created!: Date

  @UpdatedAt
  @ApiProperty()
  readonly modified?: Date
}
