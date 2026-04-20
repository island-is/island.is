import {
  Column,
  DataType,
  Model,
  Table,
  ForeignKey,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Application } from '@island.is/application/api/core'
@Table({
  tableName: 'payment',
  timestamps: true,
  freezeTableName: true,
  indexes: [
    {
      fields: ['application_id'],
    },
  ],
})
export class Payment extends Model {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: DataType.UUIDV4,
  })
  @ApiProperty()
  id!: string

  @CreatedAt
  @ApiProperty()
  created!: Date

  @UpdatedAt
  @ApiProperty()
  modified!: Date

  @ApiProperty()
  @ForeignKey(() => Application)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  application_id!: Application['id']

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  @ApiProperty()
  fulfilled!: boolean

  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  @ApiProperty()
  reference_id?: string

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  user4?: string

  @Column({
    type: DataType.JSONB,
    defaultValue: {},
  })
  @ApiPropertyOptional()
  definition?: object

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty()
  amount!: number

  @Column({
    type: DataType.DATE,
  })
  @ApiProperty()
  expires_at!: Date

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  request_id?: string
}
