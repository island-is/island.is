import {
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript'

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { AppealEventType, UserRole } from '@island.is/judicial-system/types'

import { AppealCase } from './appealCase.model'
import { Case } from './case.model'
import { CivilClaimant } from './civilClaimant.model'
import { Defendant } from './defendant.model'
import { User } from './user.model'

@Table({
  tableName: 'appeal_event_log',
  timestamps: false,
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

  static groupLatestByDefendant(
    eventType: AppealEventType,
    eventLogs: AppealEventLog[] | undefined,
  ): { defendantId: string; statementDate: Date }[] {
    if (!eventLogs) {
      return []
    }

    const latest = new Map<string, Date>()
    for (const log of eventLogs) {
      if (log.eventType !== eventType || !log.defendantId) continue
      const current = latest.get(log.defendantId)
      if (!current || log.created > current) {
        latest.set(log.defendantId, log.created)
      }
    }

    return Array.from(latest, ([defendantId, statementDate]) => ({
      defendantId,
      statementDate,
    }))
  }

  static groupLatestByCivilClaimant(
    eventType: AppealEventType,
    eventLogs: AppealEventLog[] | undefined,
  ): { civilClaimantId: string; statementDate: Date }[] {
    if (!eventLogs) {
      return []
    }

    const latest = new Map<string, Date>()
    for (const log of eventLogs) {
      if (log.eventType !== eventType || !log.civilClaimantId) continue
      const current = latest.get(log.civilClaimantId)
      if (!current || log.created > current) {
        latest.set(log.civilClaimantId, log.created)
      }
    }

    return Array.from(latest, ([civilClaimantId, statementDate]) => ({
      civilClaimantId,
      statementDate,
    }))
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

  @ForeignKey(() => Defendant)
  @Column({ type: DataType.UUID, allowNull: true })
  @ApiPropertyOptional({ type: String })
  defendantId?: string

  @ForeignKey(() => CivilClaimant)
  @Column({ type: DataType.UUID, allowNull: true })
  @ApiPropertyOptional({ type: String })
  civilClaimantId?: string

  /**********
   * Actor snapshot - the human who performed the event, captured at event
   * time so the record survives prosecutor/defender reassignment. userId is the
   * acting system user (null for defenders, who are not system users -
   * national_id/user_name identify them instead).
   *
   * userRole is the appellant's side, not necessarily the actor's role. For an
   * out-of-court appeal the two coincide (the appellant performs it). For an
   * in-court APPEALED event the party appeals but the court records it, so the
   * actor snapshot is the confirming judge while userRole + defendantId /
   * civilClaimantId identify who appealed.
   **********/
  @Column({
    type: DataType.ENUM,
    allowNull: false,
    values: Object.values(UserRole),
  })
  @ApiProperty({ enum: UserRole })
  userRole!: UserRole

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: true })
  @ApiPropertyOptional({ type: String })
  userId?: string

  @Column({ type: DataType.STRING, allowNull: true })
  @ApiPropertyOptional({ type: String })
  nationalId?: string

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
