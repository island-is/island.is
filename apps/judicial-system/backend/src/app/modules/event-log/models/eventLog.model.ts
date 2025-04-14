import {
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript'

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { EventType, UserRole } from '@island.is/judicial-system/types'

import { Case } from '../../case/models/case.model'

@Table({
  tableName: 'event_log',
  timestamps: false,
})
export class EventLog extends Model {
  static caseSentToCourtEvent(eventLogs?: EventLog[]) {
    return eventLogs?.find(
      (eventLog) =>
        eventLog.eventType === EventType.CASE_SENT_TO_COURT ||
        eventLog.eventType === EventType.INDICTMENT_CONFIRMED,
    )
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
  @Column({ type: DataType.DATE })
  @ApiProperty({ type: Date })
  created!: Date

  @Column({
    type: DataType.ENUM,
    allowNull: false,
    values: Object.values(EventType),
  })
  @ApiProperty({ enum: EventType })
  eventType!: EventType

  @ForeignKey(() => Case)
  @Column({ type: DataType.UUID, allowNull: true })
  @ApiPropertyOptional({ type: String })
  caseId?: string

  @Column({ type: DataType.STRING, allowNull: true })
  @ApiPropertyOptional({ type: String })
  nationalId?: string

  @Column({
    type: DataType.ENUM,
    allowNull: true,
    values: Object.values(UserRole),
  })
  @ApiPropertyOptional({ enum: UserRole })
  userRole?: UserRole

  @Column({ type: DataType.STRING, allowNull: true })
  @ApiPropertyOptional({ type: String })
  userName?: string

  @Column({ type: DataType.STRING, allowNull: true })
  @ApiPropertyOptional({ type: String })
  userTitle?: string

  @Column({ type: DataType.STRING, allowNull: true })
  @ApiPropertyOptional({ type: String })
  institutionName?: string
}
