import {
  Column,
  CreatedAt,
  DataType,
  HasMany,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript'

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { Notification } from './notification.model'
import {
  CaseCustodyProvisions,
  CaseCustodyRestrictions,
  CaseState,
} from './case.types'

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
  @ApiPropertyOptional()
  suspectName: string

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiPropertyOptional()
  suspectAddress: string

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiPropertyOptional()
  court: string

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  @ApiPropertyOptional()
  arrestDate: Date

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  @ApiPropertyOptional()
  requestedCourtDate: Date

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  @ApiPropertyOptional()
  requestedCustodyEndDate: Date

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiPropertyOptional()
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
  @ApiPropertyOptional()
  // Málsatvik rakin
  caseFacts: string

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiPropertyOptional()
  // Framburðir
  witnessAccounts: string

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiPropertyOptional()
  // Staða rannsóknar og næstu skref
  investigationProgress: string

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiPropertyOptional()
  // Lagarök
  legalArguments: string

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiPropertyOptional()
  // Athugasemdir til dómara
  comments: string

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiPropertyOptional()
  // Málsnúmer héraðsdóms
  courtCaseNumber: string

  @HasMany(() => Notification)
  @ApiPropertyOptional({ type: Notification, isArray: true })
  notifications: Notification[]
}
