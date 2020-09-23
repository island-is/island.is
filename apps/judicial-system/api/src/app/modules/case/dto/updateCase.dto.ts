import { IsString, IsOptional, IsEnum } from 'class-validator'
import { ApiPropertyOptional } from '@nestjs/swagger'

import { CaseState } from '@island.is/judicial-system/types'

import { CaseCustodyRestrictions, CaseCustodyProvisions } from '../models'

export class UpdateCaseDto {
  @IsOptional()
  @IsEnum(CaseState)
  @ApiPropertyOptional({ enum: CaseState })
  readonly state: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly policeCaseNumber: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly suspectNationalId: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly suspectName: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly suspectAddress: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly court: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly arrestDate: Date

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly requestedCourtDate: Date

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly requestedCustodyEndDate: Date

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly lawsBroken: string

  @IsOptional()
  @IsEnum(CaseCustodyProvisions, { each: true })
  @ApiPropertyOptional({ enum: CaseCustodyProvisions, isArray: true })
  readonly custodyProvisions: CaseCustodyProvisions[]

  @IsOptional()
  @IsEnum(CaseCustodyRestrictions, { each: true })
  @ApiPropertyOptional({ enum: CaseCustodyRestrictions, isArray: true })
  readonly custodyRestrictions: CaseCustodyRestrictions[]

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly caseFacts: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly witnessAccounts: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly investigationProgress: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly legalArguments: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly comments: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly courtCaseNumber: string
}
