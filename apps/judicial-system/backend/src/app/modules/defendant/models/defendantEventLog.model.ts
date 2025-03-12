import {
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript'

import { ApiProperty } from '@nestjs/swagger'

import { DefendantEventType } from '@island.is/judicial-system/types'

import { Case } from '../../case/models/case.model'
import { Defendant } from './defendant.model'

@Table({
  tableName: 'defendant_event_log',
  timestamps: true,
})
export class DefendantEventLog extends Model {
  // gets the latest log date of a given type, since the defendant event logs are sorted
  static getDefendantEventLogTypeDate(
    eventType: DefendantEventType,
    defendantEventLogs?: DefendantEventLog[],
  ) {
    return defendantEventLogs?.find(
      (defendantEventLog) => defendantEventLog.eventType === eventType,
    )?.created
  }

  @Column({
    type: DataType.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: DataType.UUIDV4,
  })
  @ApiProperty({ type: String })
  id!: string

  @CreatedAt
  @ApiProperty({ type: Date })
  created!: Date

  @UpdatedAt
  @ApiProperty({ type: Date })
  modified!: Date

  @ForeignKey(() => Case)
  @Column({ type: DataType.UUID, allowNull: false })
  @ApiProperty({ type: String })
  caseId!: string

  @ForeignKey(() => Defendant)
  @Column({ type: DataType.UUID, allowNull: false })
  @ApiProperty({ type: String })
  defendantId!: string

  @Column({
    type: DataType.ENUM,
    allowNull: false,
    values: Object.values(DefendantEventType),
  })
  @ApiProperty({ enum: DefendantEventType })
  eventType!: DefendantEventType
}
