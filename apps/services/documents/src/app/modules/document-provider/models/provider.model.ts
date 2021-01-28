import {
  Column,
  DataType,
  Model,
  Table,
  CreatedAt,
  UpdatedAt,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript'
import { ApiProperty } from '@nestjs/swagger'
import { Organisation } from './organisation.model'

@Table({ tableName: 'provider' })
export class Provider extends Model<Provider> {
  @Column({
    type: DataType.STRING,
    primaryKey: true,
    allowNull: false,
    defaultValue: DataType.UUIDV4,
  })
  @ApiProperty()
  id!: string

  @ForeignKey(() => Organisation)
  @Column
  organisationId!: string

  @BelongsTo(() => Organisation)
  // eslint-disable-next-line
  organisation!: any

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  endpoint?: string

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  endpointType?: string

  @Column({
    type: DataType.STRING,
  })
  @ApiProperty()
  apiScope?: string

  @Column({
    type: DataType.STRING,
  })
  @ApiProperty()
  createdBy?: string

  @CreatedAt
  @ApiProperty()
  readonly created!: Date

  @UpdatedAt
  @ApiProperty()
  readonly modified?: Date
}
