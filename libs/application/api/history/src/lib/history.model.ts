import {
  Column,
  DataType,
  Model,
  Table,
  ForeignKey,
  CreatedAt,
} from 'sequelize-typescript'
import { ApiProperty } from '@nestjs/swagger'
import { Application } from '@island.is/application/api/core'
@Table({
  tableName: 'history',
  timestamps: true,
  freezeTableName: true,
  indexes: [
    {
      fields: ['application_id'],
    },
  ],
})
export class History extends Model {
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
  date!: Date

  @ApiProperty()
  @ForeignKey(() => Application)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  application_id!: Application['id']

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  contentfulId?: string
}
