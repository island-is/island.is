import {
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript'

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { Case } from '../../case/models/case.model'

@Table({
  tableName: 'civil_claimant',
  timestamps: false,
})
export class CivilClaimant extends Model {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: DataType.UUIDV4,
  })
  @ApiProperty({ type: String })
  id!: string

  @CreatedAt
  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW,
    allowNull: false,
  })
  @ApiProperty({ type: Date })
  created!: Date

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
}
