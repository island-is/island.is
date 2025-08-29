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

import {
  CaseFileCategory,
  CaseFileState,
  HashAlgorithm,
} from '@island.is/judicial-system/types'

import { Case } from './case.model'
import { CivilClaimant } from './civilClaimant.model'
import { Defendant } from './defendant.model'

// TODO Find a way to import from an index file

@Table({
  tableName: 'case_file',
  timestamps: true,
})
export class CaseFile extends Model {
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

  @ForeignKey(() => Defendant)
  @Column({ type: DataType.UUID, allowNull: true })
  @ApiProperty({ type: String })
  defendantId?: string

  @ForeignKey(() => CivilClaimant)
  @Column({ type: DataType.UUID, allowNull: true })
  @ApiProperty({ type: String })
  civilClaimantId?: string

  @Column({ type: DataType.STRING, allowNull: false })
  @ApiProperty({ type: String })
  name!: string

  @Column({ type: DataType.STRING, allowNull: false })
  @ApiProperty({ type: String })
  type!: string

  @Column({
    type: DataType.ENUM,
    allowNull: true,
    values: Object.values(CaseFileCategory),
  })
  @ApiPropertyOptional({ enum: CaseFileCategory })
  category?: CaseFileCategory

  @Column({
    type: DataType.ENUM,
    allowNull: false,
    values: Object.values(CaseFileState),
  })
  @ApiProperty({ enum: CaseFileState })
  state!: CaseFileState

  @Column({ type: DataType.STRING, allowNull: true })
  @ApiPropertyOptional({ type: String })
  key?: string

  @Column({ type: DataType.INTEGER, allowNull: false })
  @ApiProperty({ type: Number })
  size!: number

  @Column({ type: DataType.STRING, allowNull: true })
  @ApiPropertyOptional({ type: String })
  policeCaseNumber?: string

  @Column({ type: DataType.STRING, allowNull: true })
  @ApiPropertyOptional({ type: String })
  userGeneratedFilename?: string

  @Column({ type: DataType.INTEGER, allowNull: true })
  @ApiPropertyOptional({ type: Number })
  chapter?: number

  @Column({ type: DataType.INTEGER, allowNull: true })
  @ApiPropertyOptional({ type: Number })
  orderWithinChapter?: number

  @Column({ type: DataType.DATE, allowNull: true })
  @ApiPropertyOptional({ type: Date })
  displayDate?: Date

  @Column({ type: DataType.STRING, allowNull: true })
  @ApiPropertyOptional({ type: String })
  policeFileId?: string

  @Column({ type: DataType.STRING, allowNull: true })
  @ApiPropertyOptional({ type: String })
  hash?: string

  @Column({
    type: DataType.ENUM,
    allowNull: true,
    values: Object.values(HashAlgorithm),
  })
  @ApiPropertyOptional({ enum: HashAlgorithm })
  hashAlgorithm?: HashAlgorithm

  @Column({ type: DataType.STRING, allowNull: true })
  @ApiPropertyOptional({ type: String })
  submittedBy?: string

  // custom case file submission for example when documents are submitted in person to court
  @Column({ type: DataType.DATE, allowNull: true })
  @ApiPropertyOptional({ type: Date })
  submissionDate?: Date

  // when users submit files on behalf of case representatives
  @Column({ type: DataType.STRING, allowNull: true })
  @ApiPropertyOptional({ type: String })
  fileRepresentative?: string
}
