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

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { AppealCase } from './appealCase.model'
import { Case } from './case.model'
import { CivilClaimant } from './civilClaimant.model'
import { Defendant } from './defendant.model'

// The deadline the court of appeals has given one party of a verdict appeal to
// file its written statement. One row per party and appeal: a defendant, a
// civil claimant, or the prosecution when neither is named. An extension moves
// the deadline on the same row; the appeal event log keeps who did what, when.
@Table({
  tableName: 'appeal_statement_deadline',
  timestamps: true,
})
export class AppealStatementDeadline extends Model {
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

  @BelongsTo(() => Case, 'caseId')
  @ApiPropertyOptional({ type: () => Case })
  case?: Case

  @ForeignKey(() => AppealCase)
  @Column({ type: DataType.UUID, allowNull: false })
  @ApiProperty({ type: String })
  appealCaseId!: string

  @BelongsTo(() => AppealCase, 'appealCaseId')
  @ApiPropertyOptional({ type: () => AppealCase })
  appealCase?: AppealCase

  @ForeignKey(() => Defendant)
  @Column({ type: DataType.UUID, allowNull: true })
  @ApiPropertyOptional({ type: String })
  defendantId?: string

  @ForeignKey(() => CivilClaimant)
  @Column({ type: DataType.UUID, allowNull: true })
  @ApiPropertyOptional({ type: String })
  civilClaimantId?: string

  @Column({ type: DataType.DATE, allowNull: false })
  @ApiProperty({ type: Date })
  deadline!: Date
}
