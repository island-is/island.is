import {
  Column,
  DataType,
  Model,
  Table,
  ForeignKey,
} from 'sequelize-typescript'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Application } from '../application/application.model'
import { JsonObject } from 'type-fest'


///Payment table to hold onto fulfilled payments and expiring payments.
@Table({
  tableName: 'payment',
  timestamps: true,
  indexes: [
    {
      fields: ['applicationId'],
    },
  ],
})
export class Payment extends Model<Application> {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: DataType.UUIDV4,
  })
  @ApiProperty()
  id!: string
  
  @ForeignKey(() => Application)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  ApplicationId!: string
  
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  @ApiProperty()
  fulfilled!: boolean
  
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  @ApiProperty()
  referenceId!: string
  
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty()
  user4!: string
  
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
  expiresAt!: Date
}