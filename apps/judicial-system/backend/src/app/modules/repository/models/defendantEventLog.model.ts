import {
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript'

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { DefendantEventType } from '@island.is/judicial-system/types'

import { Case } from './case.model'
import { Defendant } from './defendant.model'

@Table({
  tableName: 'defendant_event_log',
  timestamps: true,
})
export class DefendantEventLog extends Model {
  static getEventLogByEventType(
    eventType: DefendantEventType | DefendantEventType[],
    eventLogs: DefendantEventLog[] | undefined,
  ): DefendantEventLog | undefined {
    if (!eventLogs) {
      return undefined
    }

    const eventTypes = Array.isArray(eventType) ? eventType : [eventType]
    const relevantLogs = eventLogs
      .filter((eventLog) => eventTypes.includes(eventLog.eventType))
      // Don't assume any ordering
      .sort((a, b) => b.created.getTime() - a.created.getTime())

    if (relevantLogs.length === 0) {
      return undefined
    }

    return relevantLogs[0]
  }

  static getEventLogDateByEventType(
    eventType: DefendantEventType | DefendantEventType[],
    eventLogs: DefendantEventLog[] | undefined,
  ): Date | undefined {
    return DefendantEventLog.getEventLogByEventType(eventType, eventLogs)
      ?.created
  }

  static hasValidOpenByPrisonAdminEvent(
    eventLogs: DefendantEventLog[],
  ): boolean {
    const sentToPrisonAdminDate = DefendantEventLog.getEventLogDateByEventType(
      DefendantEventType.SENT_TO_PRISON_ADMIN,
      eventLogs,
    )
    const openedByPrisonAdminDate =
      DefendantEventLog.getEventLogDateByEventType(
        DefendantEventType.OPENED_BY_PRISON_ADMIN,
        eventLogs,
      )
    return Boolean(
      sentToPrisonAdminDate &&
        openedByPrisonAdminDate &&
        sentToPrisonAdminDate <= openedByPrisonAdminDate,
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

  @Column({ type: DataType.STRING, allowNull: true })
  @ApiPropertyOptional({ type: String })
  nationalId?: string

  @Column({ type: DataType.STRING, allowNull: true })
  @ApiPropertyOptional({ type: String })
  userRole?: string

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
