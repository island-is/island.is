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
import { Defendant } from './defendant.model'

@Table({
  tableName: 'case_defendant_police_case_number',
  timestamps: true,
})
export class CaseDefendantPoliceCaseNumber extends Model {
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
  theCase?: Case

  @ForeignKey(() => Defendant)
  @Column({ type: DataType.UUID, allowNull: true })
  @ApiPropertyOptional({ type: String })
  defendantId?: string

  @BelongsTo(() => Defendant, 'defendantId')
  @ApiPropertyOptional({ type: () => Defendant })
  defendant?: Defendant

  @Column({ type: DataType.STRING, allowNull: false })
  @ApiProperty({ type: String })
  policeCaseNumber!: string
}
