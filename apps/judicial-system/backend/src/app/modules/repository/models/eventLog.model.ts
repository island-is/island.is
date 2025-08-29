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

import { Case } from './case.model'

@Table({
  tableName: 'event_log',
  timestamps: false,
})
export class EventLog extends Model {
  static getEventLogByEventType(
    eventType: EventType | EventType[],
    eventLogs: EventLog[] | undefined,
    userRole?: UserRole,
  ): EventLog | undefined {
    if (!eventLogs) {
      return undefined
    }

    const eventTypes = Array.isArray(eventType) ? eventType : [eventType]
    const relevantLogs = eventLogs
      .filter(
        (eventLog) =>
          eventTypes.includes(eventLog.eventType) &&
          (!userRole || eventLog.userRole === userRole),
      )
      // Don't assume any ordering
      .sort((a, b) => b.created.getTime() - a.created.getTime())

    if (relevantLogs.length === 0) {
      return undefined
    }

    return relevantLogs[0]
  }

  static getEventLogDateByEventType(
    eventType: EventType | EventType[],
    eventLogs: EventLog[] | undefined,
    userRole?: UserRole,
  ): Date | undefined {
    return EventLog.getEventLogByEventType(eventType, eventLogs, userRole)
      ?.created
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
