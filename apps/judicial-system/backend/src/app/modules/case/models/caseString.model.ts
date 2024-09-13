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

import { StringType } from '@island.is/judicial-system/types'

import { Case } from './case.model'

@Table({
  tableName: 'case_string',
  timestamps: true,
})
export class CaseString extends Model {
  static postponedIndefinitelyExplanation(caseStrings?: CaseString[]) {
    return caseStrings?.find(
      (caseString) =>
        caseString.stringType === StringType.POSTPONED_INDEFINITELY_EXPLANATION,
    )?.value
  }

  static civilDemands(caseStrings?: CaseString[]) {
    return caseStrings?.find(
      (caseString) => caseString.stringType === StringType.CIVIL_DEMANDS,
    )?.value
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

  @Column({
    type: DataType.ENUM,
    allowNull: false,
    values: Object.values(StringType),
  })
  @ApiProperty({ enum: StringType })
  stringType!: StringType

  @ForeignKey(() => Case)
  @Column({ type: DataType.UUID, allowNull: false })
  @ApiPropertyOptional({ type: String })
  caseId!: string

  @Column({ type: DataType.TEXT, allowNull: false })
  @ApiPropertyOptional({ type: String })
  value!: string
}
