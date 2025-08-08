import { Type } from 'class-transformer'
import { IsDate, IsOptional } from 'class-validator'
import { Column, DataType } from 'sequelize-typescript'

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import {
  InformationForDefendant,
  ServiceRequirement,
  VerdictAppealDecision,
} from '@island.is/judicial-system/types'

export class UpdateVerdictDto {
  @Column({
    type: DataType.ENUM,
    allowNull: true,
    values: Object.values(ServiceRequirement),
  })
  @ApiProperty({ enum: ServiceRequirement })
  serviceRequirement?: ServiceRequirement

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  @ApiPropertyOptional({ type: Date })
  readonly serviceDate?: Date

  @Column({ type: DataType.STRING, allowNull: true })
  @ApiPropertyOptional({ type: String })
  servedBy?: string

  @Column({
    type: DataType.ENUM,
    allowNull: true,
    values: Object.values(VerdictAppealDecision),
  })
  @ApiPropertyOptional({ enum: VerdictAppealDecision })
  appealDecision?: VerdictAppealDecision

  @Column({ type: DataType.DATE, allowNull: true })
  @ApiPropertyOptional({ type: Date })
  appealDate?: Date

  @Column({
    type: DataType.ARRAY(DataType.ENUM),
    allowNull: true,
    values: Object.values(InformationForDefendant),
  })
  @ApiPropertyOptional({ enum: InformationForDefendant, isArray: true })
  serviceInformationForDefendant?: InformationForDefendant[]
}
