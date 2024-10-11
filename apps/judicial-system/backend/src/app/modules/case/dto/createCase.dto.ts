import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator'

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import type {
  CrimeSceneMap,
  IndictmentSubtypeMap,
} from '@island.is/judicial-system/types'
import {
  CaseType,
  RequestSharedWithDefender,
} from '@island.is/judicial-system/types'

export class CreateCaseDto {
  @IsNotEmpty()
  @IsEnum(CaseType)
  @ApiProperty({ enum: CaseType })
  readonly type!: CaseType

  @IsOptional()
  @IsObject()
  @ApiPropertyOptional({ type: Object })
  readonly indictmentSubtypes?: IndictmentSubtypeMap

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  readonly description?: string

  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  @ApiProperty({ type: String, isArray: true })
  readonly policeCaseNumbers!: string[]

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  readonly defenderName?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  readonly defenderNationalId?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  readonly defenderEmail?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  readonly defenderPhoneNumber?: string

  @IsOptional()
  @IsEnum(RequestSharedWithDefender)
  @ApiPropertyOptional({ enum: RequestSharedWithDefender })
  readonly requestSharedWithDefender?: RequestSharedWithDefender

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  readonly leadInvestigator?: string

  @IsOptional()
  @IsObject()
  @ApiPropertyOptional({ type: Object })
  readonly crimeScenes?: CrimeSceneMap
}
