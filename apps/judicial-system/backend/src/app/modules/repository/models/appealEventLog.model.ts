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

import { AppealEventType, UserRole } from '@island.is/judicial-system/types'

import { AppealCase } from './appealCase.model'
import { Case } from './case.model'
import { CivilClaimant } from './civilClaimant.model'
import { Defendant } from './defendant.model'

@Table({
  tableName: 'appeal_event_log',
  timestamps: true,
})
export class AppealEventLog extends Model {
  static getEventLogByEventType(
    eventType: AppealEventType | AppealEventType[],
    eventLogs: AppealEventLog[] | undefined,
  ): AppealEventLog | undefined {
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
    eventType: AppealEventType | AppealEventType[],
    eventLogs: AppealEventLog[] | undefined,
  ): Date | undefined {
    return AppealEventLog.getEventLogByEventType(eventType, eventLogs)?.created
  }

  static getLatestDateByRole(
    eventType: AppealEventType,
    userRole: UserRole | UserRole[],
    eventLogs: AppealEventLog[] | undefined,
  ): Date | undefined {
    if (!eventLogs) {
      return undefined
    }

    const roles = Array.isArray(userRole) ? userRole : [userRole]

    return AppealEventLog.getEventLogDateByEventType(
      eventType,
      eventLogs.filter((eventLog) => roles.includes(eventLog.userRole)),
    )
  }

  static getEarliestDateByRole(
    eventType: AppealEventType,
    userRole: UserRole | UserRole[],
    eventLogs: AppealEventLog[] | undefined,
  ): Date | undefined {
    if (!eventLogs) {
      return undefined
    }

    const roles = Array.isArray(userRole) ? userRole : [userRole]
    const relevantLogs = eventLogs
      .filter(
        (eventLog) =>
          eventLog.eventType === eventType && roles.includes(eventLog.userRole),
      )
      .sort((a, b) => a.created.getTime() - b.created.getTime())

    return relevantLogs[0]?.created
  }

  static getDateForDefendant(
    eventType: AppealEventType,
    defendantId: string,
    eventLogs: AppealEventLog[] | undefined,
  ): Date | undefined {
    if (!eventLogs) {
      return undefined
    }

    return AppealEventLog.getEventLogDateByEventType(
      eventType,
      eventLogs.filter((eventLog) => eventLog.defendantId === defendantId),
    )
  }

  static getDateForCivilClaimant(
    eventType: AppealEventType,
    civilClaimantId: string,
    eventLogs: AppealEventLog[] | undefined,
  ): Date | undefined {
    if (!eventLogs) {
      return undefined
    }

    return AppealEventLog.getEventLogDateByEventType(
      eventType,
      eventLogs.filter(
        (eventLog) => eventLog.civilClaimantId === civilClaimantId,
      ),
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

  @ForeignKey(() => AppealCase)
  @Column({ type: DataType.UUID, allowNull: false })
  @ApiProperty({ type: String })
  appealCaseId!: string

  @Column({
    type: DataType.ENUM,
    allowNull: false,
    values: Object.values(AppealEventType),
  })
  @ApiProperty({ enum: AppealEventType })
  eventType!: AppealEventType

  @Column({
    type: DataType.ENUM,
    allowNull: false,
    values: Object.values(UserRole),
  })
  @ApiProperty({ enum: UserRole })
  userRole!: UserRole

  @ForeignKey(() => Defendant)
  @Column({ type: DataType.UUID, allowNull: true })
  @ApiPropertyOptional({ type: String })
  defendantId?: string

  @ForeignKey(() => CivilClaimant)
  @Column({ type: DataType.UUID, allowNull: true })
  @ApiPropertyOptional({ type: String })
  civilClaimantId?: string
}
