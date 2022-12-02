import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsBoolean,
  IsArray,
  ArrayMinSize,
  IsObject,
} from 'class-validator'

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { CaseType } from '@island.is/judicial-system/types'
import type {
  IndictmentSubtypeMap,
  CrimeSceneMap,
} from '@island.is/judicial-system/types'

export class CreateCaseDto {
  @IsNotEmpty()
  @IsString()
  @ApiPropertyOptional({ enum: CaseType })
  readonly type!: CaseType

  @IsOptional()
  @IsObject()
  @ApiPropertyOptional()
  readonly indictmentSubtypes?: IndictmentSubtypeMap

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly description?: string

  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  @ApiProperty()
  readonly policeCaseNumbers!: string[]

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly defenderName?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly defenderNationalId?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly defenderEmail?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly defenderPhoneNumber?: string

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional()
  readonly sendRequestToDefender?: boolean

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly leadInvestigator?: string

  @IsOptional()
  @IsObject()
  @ApiPropertyOptional()
  readonly crimeScenes?: CrimeSceneMap
}
