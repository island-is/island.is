import {
  Column,
  DataType,
  Model,
  Table,
  ForeignKey,
  BelongsTo,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Application } from '../application/application.model'
import { JsonObject } from 'type-fest'

///Payment table to hold onto fulfilled payments and expiring payments.
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
export class Payment extends Model<Application> {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
    unique: true,
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
  definition?: string

  @Column({
    type: DataType.NUMBER,
    allowNull: false,
  })
  @ApiProperty()
  amount!: number

  @Column({
    type: DataType.DATE,
  })
  @ApiProperty()
  expires_at!: Date
}
