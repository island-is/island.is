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

import { normalizeAndFormatNationalId } from '@island.is/judicial-system/formatters'

import { Case } from '../../case/models/case.model'

@Table({
  tableName: 'civil_claimant',
  timestamps: false,
})
export class CivilClaimant extends Model {
  static isSpokespersonOfCivilClaimant(
    spokespersonNationalId: string,
    civilClaimants?: CivilClaimant[],
  ) {
    return civilClaimants?.some(
      (civilClaimant) =>
        civilClaimant.hasSpokesperson &&
        civilClaimant.spokespersonNationalId &&
        normalizeAndFormatNationalId(spokespersonNationalId).includes(
          civilClaimant.spokespersonNationalId,
        ),
    )
  }

  static isSpokespersonOfCivilClaimantWithCaseFileAccess(
    spokespersonNationalId: string,
    civilClaimants?: CivilClaimant[],
  ) {
    return civilClaimants?.some(
      (civilClaimant) =>
        civilClaimant.hasSpokesperson &&
        civilClaimant.spokespersonNationalId &&
        normalizeAndFormatNationalId(spokespersonNationalId).includes(
          civilClaimant.spokespersonNationalId,
        ) &&
        civilClaimant.caseFilesSharedWithSpokesperson,
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
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  @ApiProperty({ type: String })
  caseId!: string

  @BelongsTo(() => Case, 'caseId')
  @ApiProperty({ type: Case })
  case?: Case

  @Column({ type: DataType.BOOLEAN, allowNull: true })
  @ApiPropertyOptional({ type: Boolean })
  noNationalId?: boolean

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiPropertyOptional({ type: String })
  name?: string

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiPropertyOptional({ type: String })
  nationalId?: string

  @Column({ type: DataType.BOOLEAN, allowNull: true })
  @ApiPropertyOptional({ type: Boolean })
  hasSpokesperson?: boolean

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  @ApiPropertyOptional({ type: Boolean })
  spokespersonIsLawyer?: boolean

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiPropertyOptional({ type: String })
  spokespersonNationalId?: string

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiPropertyOptional({ type: String })
  spokespersonName?: string

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiPropertyOptional({ type: String })
  spokespersonEmail?: string

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiPropertyOptional({ type: String })
  spokespersonPhoneNumber?: string

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  @ApiPropertyOptional({ type: Boolean })
  caseFilesSharedWithSpokesperson?: boolean

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  @ApiPropertyOptional({ type: Boolean })
  isSpokespersonConfirmed?: boolean
}
