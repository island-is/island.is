import { IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator'

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { DataGroups } from '@island.is/judicial-system/types'

import { DateFilter } from './types'

export class CaseDataExportDto {
  @IsNotEmpty()
  @ApiProperty({ type: DataGroups })
  readonly type!: DataGroups

  @IsOptional()
  @IsObject()
  @ApiPropertyOptional({ type: () => DateFilter })
  readonly period?: DateFilter
}
