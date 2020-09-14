import { IsString, IsOptional, IsEnum } from 'class-validator'
import { ApiPropertyOptional } from '@nestjs/swagger'

import {
  CaseState,
  CaseCustodyRestrictions,
  CaseCustodyProvisions,
} from '../case.types'

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
  @IsEnum(CaseState)
  @ApiPropertyOptional({ enum: CaseCustodyRestrictions })
  readonly custodyProvisions: CaseCustodyProvisions[]

  @IsOptional()
  @IsEnum(CaseState)
  @ApiPropertyOptional({ enum: CaseCustodyRestrictions })
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
}
