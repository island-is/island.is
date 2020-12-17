import {
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript'

import { ApiProperty } from '@nestjs/swagger'

import {
  CaseState,
  CaseCustodyProvisions,
  CaseAppealDecision,
  CaseCustodyRestrictions,
  CaseGender,
  CaseDecision,
} from '@island.is/judicial-system/types'

import { User } from '../../user'

@Table({
  tableName: 'case',
  timestamps: true,
})
export class Case extends Model<Case> {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: DataType.UUIDV4,
  })
  @ApiProperty()
  id: string

  @CreatedAt
  @ApiProperty()
  created: Date

  @UpdatedAt
  @ApiProperty()
  modified: Date

  @Column({
    type: DataType.ENUM,
    allowNull: false,
    values: Object.values(CaseState),
    defaultValue: CaseState.NEW,
  })
  @ApiProperty({ enum: CaseState })
  state: CaseState

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty()
  policeCaseNumber: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty()
  accusedNationalId: string

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  accusedName: string

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  accusedAddress: string

  @Column({
    type: DataType.ENUM,
    allowNull: true,
    values: Object.values(CaseGender),
  })
  accusedGender: CaseGender

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  requestedDefenderName: string

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  requestedDefenderEmail: string

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  court: string

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  @ApiProperty()
  arrestDate: Date

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  @ApiProperty()
  requestedCourtDate: Date

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  @ApiProperty()
  alternativeTravelBan: boolean

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  @ApiProperty()
  requestedCustodyEndDate: Date

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  lawsBroken: string

  @Column({
    type: DataType.ARRAY(DataType.ENUM),
    allowNull: true,
    values: Object.values(CaseCustodyProvisions),
  })
  @ApiProperty({ enum: CaseCustodyProvisions, isArray: true })
  custodyProvisions: CaseCustodyProvisions[]

  @Column({
    type: DataType.ARRAY(DataType.ENUM),
    allowNull: true,
    values: Object.values(CaseCustodyRestrictions),
  })
  @ApiProperty({ enum: CaseCustodyRestrictions, isArray: true })
  requestedCustodyRestrictions: CaseCustodyRestrictions[]

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  caseFacts: string

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  legalArguments: string

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  comments: string

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  @ApiProperty()
  prosecutorId: string

  @BelongsTo(() => User, 'prosecutorId')
  @ApiProperty({ type: User })
  prosecutor: User

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  courtCaseNumber: string

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  @ApiProperty()
  courtDate: Date

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  courtRoom: string

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  defenderName: string

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  defenderEmail: string

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  @ApiProperty()
  courtStartTime: Date

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  @ApiProperty()
  courtEndTime: Date

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  courtAttendees: string

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  policeDemands: string

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  accusedPlea: string

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  litigationPresentations: string

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  ruling: string

  @Column({
    type: DataType.ENUM,
    allowNull: true,
    values: Object.values(CaseDecision),
  })
  @ApiProperty({ enum: CaseDecision })
  decision: CaseDecision

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  @ApiProperty()
  custodyEndDate: Date

  @Column({
    type: DataType.ARRAY(DataType.ENUM),
    allowNull: true,
    values: Object.values(CaseCustodyRestrictions),
  })
  @ApiProperty({ enum: CaseCustodyRestrictions, isArray: true })
  custodyRestrictions: CaseCustodyRestrictions[]

  @Column({
    type: DataType.ENUM,
    allowNull: true,
    values: Object.values(CaseAppealDecision),
  })
  @ApiProperty({ enum: CaseAppealDecision })
  accusedAppealDecision: CaseAppealDecision

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  accusedAppealAnnouncement: string

  @Column({
    type: DataType.ENUM,
    allowNull: true,
    values: Object.values(CaseAppealDecision),
  })
  @ApiProperty({ enum: CaseAppealDecision })
  prosecutorAppealDecision: CaseAppealDecision

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  prosecutorAppealAnnouncement: string

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  @ApiProperty()
  judgeId: string

  @BelongsTo(() => User, 'judgeId')
  @ApiProperty({ type: User })
  judge: User
}
