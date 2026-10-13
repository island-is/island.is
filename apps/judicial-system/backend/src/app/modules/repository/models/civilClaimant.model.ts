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

import { Case } from './case.model'

@Table({
  tableName: 'civil_claimant',
  timestamps: false,
})
export class CivilClaimant extends Model {
  static isConfirmedSpokespersonOfCivilClaimant(
    spokespersonNationalId: string,
    civilClaimants?: CivilClaimant[],
  ) {
    return civilClaimants?.some(
      (civilClaimant) =>
        civilClaimant.hasSpokesperson &&
        civilClaimant.isSpokespersonConfirmed &&
        civilClaimant.spokespersonNationalId === spokespersonNationalId,
    )
  }

  static isConfirmedSpokespersonOfCivilClaimantWithCaseFileAccess(
    spokespersonNationalId: string,
    civilClaimants?: CivilClaimant[],
  ) {
    return civilClaimants?.some(
      (civilClaimant) =>
        civilClaimant.hasSpokesperson &&
        civilClaimant.isSpokespersonConfirmed &&
        civilClaimant.caseFilesSharedWithSpokesperson &&
        civilClaimant.spokespersonNationalId === spokespersonNationalId,
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
  @ApiProperty({ type: () => Case })
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

  // The appeal proceeding's own advocate, mirroring the district court columns
  // above. Kept apart rather than reused because the court of appeals decides
  // the question afresh: a claimant represented at the district court may go
  // unrepresented on appeal, and the other way round.
  //
  // The lawyer / spokesperson distinction carries the same meaning as above
  // and matters more here - a spokesperson is formally appointed by the court,
  // a lawyer the claimant retains is not.
  @Column({ type: DataType.BOOLEAN, allowNull: true })
  @ApiPropertyOptional({ type: Boolean })
  hasAppealSpokesperson?: boolean

  @Column({ type: DataType.BOOLEAN, allowNull: true })
  @ApiPropertyOptional({ type: Boolean })
  appealSpokespersonIsLawyer?: boolean

  @Column({ type: DataType.STRING, allowNull: true })
  @ApiPropertyOptional({ type: String })
  appealSpokespersonNationalId?: string

  @Column({ type: DataType.STRING, allowNull: true })
  @ApiPropertyOptional({ type: String })
  appealSpokespersonName?: string

  @Column({ type: DataType.STRING, allowNull: true })
  @ApiPropertyOptional({ type: String })
  appealSpokespersonEmail?: string

  @Column({ type: DataType.STRING, allowNull: true })
  @ApiPropertyOptional({ type: String })
  appealSpokespersonPhoneNumber?: string

  @Column({ type: DataType.BOOLEAN, allowNull: true })
  @ApiPropertyOptional({ type: Boolean })
  isAppealSpokespersonConfirmed?: boolean

  @Column({ type: DataType.ARRAY(DataType.STRING), allowNull: true })
  @ApiPropertyOptional({ type: String, isArray: true })
  policeCaseNumbers?: string[]

  @Column({ type: DataType.ARRAY(DataType.STRING), allowNull: true })
  @ApiPropertyOptional({ type: String, isArray: true })
  defendantIds?: string[]
}
