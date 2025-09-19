import {
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript'

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import {
  CourtSessionClosedLegalBasis,
  CourtSessionRulingType,
} from '@island.is/judicial-system/types'

import { Case } from './case.model'
import { CourtDocument } from './courtDocument.model'
import { User } from './user.model'

@Table({
  tableName: 'court_session',
  timestamps: true,
})
export class CourtSession extends Model {
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

  @Column({ type: DataType.STRING, allowNull: true })
  @ApiPropertyOptional({ type: String })
  location?: string

  @Column({ type: DataType.DATE, allowNull: true })
  @ApiPropertyOptional({ type: Date })
  startDate?: Date

  @Column({ type: DataType.DATE, allowNull: true })
  @ApiPropertyOptional({ type: Date })
  endDate?: Date

  @Column({ type: DataType.BOOLEAN, allowNull: true })
  @ApiPropertyOptional({ type: Boolean })
  isClosed?: boolean

  @Column({
    type: DataType.ARRAY(DataType.ENUM),
    allowNull: true,
    values: Object.values(CourtSessionClosedLegalBasis),
  })
  @ApiPropertyOptional({ enum: CourtSessionClosedLegalBasis, isArray: true })
  closedLegalProvisions?: CourtSessionClosedLegalBasis[]

  @Column({ type: DataType.TEXT, allowNull: true })
  @ApiPropertyOptional({ type: String })
  attendees?: string

  @Column({ type: DataType.TEXT, allowNull: true })
  @ApiPropertyOptional({ type: String })
  entries?: string

  @Column({
    type: DataType.ENUM,
    allowNull: true,
    values: Object.values(CourtSessionRulingType),
  })
  @ApiPropertyOptional({ enum: CourtSessionRulingType })
  rulingType?: CourtSessionRulingType

  @Column({ type: DataType.TEXT, allowNull: true })
  @ApiPropertyOptional({ type: String })
  ruling?: string

  @Column({ type: DataType.BOOLEAN, allowNull: true })
  @ApiPropertyOptional({ type: Boolean })
  isAttestingWitness?: boolean

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: true })
  @ApiPropertyOptional({ type: String })
  attestingWitnessId?: string

  @BelongsTo(() => User, 'attestingWitnessId')
  @ApiPropertyOptional({ type: () => User })
  attestingWitness?: User

  @Column({ type: DataType.TEXT, allowNull: true })
  @ApiPropertyOptional({ type: String })
  closingEntries?: string

  @HasMany(() => CourtDocument, 'courtSessionId')
  @ApiPropertyOptional({ type: () => [CourtDocument] })
  filedDocuments?: CourtDocument[]

  @Column({ type: DataType.BOOLEAN, allowNull: true })
  @ApiPropertyOptional({ type: Boolean })
  isConfirmed?: boolean
}
