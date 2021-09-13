import {
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript'

import { ApiProperty } from '@nestjs/swagger'

import { NotificationType } from '@island.is/judicial-system/types'

import { Case } from '../../case'

@Table({
  tableName: 'notification',
  timestamps: false,
})
export class Notification extends Model<Notification> {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: DataType.UUIDV4,
  })
  @ApiProperty()
  id!: string

  @CreatedAt
  @Column({
    type: DataType.DATE,
  })
  @ApiProperty()
  created!: Date

  @ForeignKey(() => Case)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  @ApiProperty()
  caseId!: string

  @Column({
    type: DataType.ENUM,
    allowNull: false,
    values: Object.values(NotificationType),
  })
  @ApiProperty({ enum: NotificationType })
  type!: NotificationType

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  condition?: string

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  recipients?: string
}
