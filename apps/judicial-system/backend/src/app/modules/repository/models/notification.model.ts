import {
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript'

import { ApiProperty } from '@nestjs/swagger'

import { TrackedNotificationType } from '@island.is/judicial-system/types'

import { Case } from './case.model'

export interface Recipient {
  success: boolean
  address?: string
}

@Table({
  tableName: 'notification',
  timestamps: false,
})
export class Notification extends Model {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: DataType.UUIDV4,
  })
  @ApiProperty({ type: String })
  id!: string

  @CreatedAt
  @Column({ type: DataType.DATE })
  @ApiProperty({ type: Date })
  created!: Date

  @ForeignKey(() => Case)
  @Column({ type: DataType.UUID, allowNull: false })
  @ApiProperty({ type: String })
  caseId!: string

  @Column({
    type: DataType.ENUM,
    allowNull: false,
    values: Object.values(TrackedNotificationType),
  })
  @ApiProperty({ enum: TrackedNotificationType })
  type!: TrackedNotificationType

  @Column({
    type: DataType.ARRAY(DataType.JSON),
    allowNull: false,
    defaultValue: [],
  })
  @ApiProperty({ type: Object, isArray: true })
  recipients!: Recipient[]
}
