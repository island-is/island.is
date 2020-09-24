import {
  Column,
  CreatedAt,
  DataType,
  HasMany,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript'

import { ApiProperty } from '@nestjs/swagger'

import { CaseState } from '@island.is/judicial-system/types'

import { Notification } from './notification.model'
import { CaseCustodyProvisions, CaseCustodyRestrictions } from './case.types'

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
    defaultValue: CaseState.DRAFT,
  })
  @ApiProperty({ enum: CaseState })
  state: string

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
  suspectNationalId: string

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  suspectName: string

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  suspectAddress: string

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
  // Lagaákvæði sem brot varða við
  lawsBroken: string

  @Column({
    type: DataType.ARRAY(DataType.ENUM),
    allowNull: true,
    values: Object.values(CaseCustodyProvisions),
  })
  @ApiProperty({ enum: CaseCustodyProvisions, isArray: true })
  // Lagaákvæði sem krafan byggir á
  custodyProvisions: CaseCustodyProvisions[]

  @Column({
    type: DataType.ARRAY(DataType.ENUM),
    allowNull: true,
    values: Object.values(CaseCustodyRestrictions),
  })
  @ApiProperty({ enum: CaseCustodyRestrictions, isArray: true })
  // Takmarkanir á gæslu
  custodyRestrictions: CaseCustodyRestrictions[]

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  // Málsatvik rakin
  caseFacts: string

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  // Framburðir
  witnessAccounts: string

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  // Staða rannsóknar og næstu skref
  investigationProgress: string

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  // Lagarök
  legalArguments: string

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  // Athugasemdir til dómara
  comments: string

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  // Málsnúmer héraðsdóms
  courtCaseNumber: string

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
  // Viðstaddir og hlutverk þeirra
  courtAttendees: string

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  // Krafa lögreglu
  policeDemands: string

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  // Afstaða kærða
  suspectPlea: string

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  // Málflutningsræður
  litigationPresentations: string

  @HasMany(() => Notification)
  @ApiProperty({ type: Notification, isArray: true })
  notifications: Notification[]
}
