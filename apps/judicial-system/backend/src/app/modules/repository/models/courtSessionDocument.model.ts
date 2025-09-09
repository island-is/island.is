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

import { CourtSessionDocumentType } from '@island.is/judicial-system/types'

import { Case } from './case.model'
import { CaseFile } from './caseFile.model'
import { CourtSession } from './courtSession.model'

@Table({
  tableName: 'court_session_document',
  timestamps: true,
})
export class CourtSessionDocument extends Model {
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

  @ForeignKey(() => CourtSession)
  @Column({ type: DataType.UUID, allowNull: false })
  @ApiProperty({ type: String })
  courtSessionId!: string

  @Column({
    type: DataType.ENUM,
    allowNull: true,
    values: Object.values(CourtSessionDocumentType),
  })
  @ApiProperty({ type: String })
  documentType!: CourtSessionDocumentType

  @Column({ type: DataType.INTEGER, allowNull: false })
  @ApiProperty({ type: Number })
  order!: number

  @Column({ type: DataType.STRING, allowNull: false })
  @ApiProperty({ type: String })
  name!: string

  @ForeignKey(() => CaseFile)
  @Column({ type: DataType.UUID, allowNull: true })
  @ApiPropertyOptional({ type: String })
  caseFileId?: string

  @Column({ type: DataType.STRING, allowNull: true })
  @ApiPropertyOptional({ type: String })
  generatedPdfUri?: string
}
