import { IsString, IsOptional, IsEnum, IsBoolean } from 'class-validator'
import { ApiPropertyOptional } from '@nestjs/swagger'

import {
  CaseCustodyProvisions,
  CaseCustodyRestrictions,
  CaseAppealDecision,
} from '@island.is/judicial-system/types'

export class UpdateCaseDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly policeCaseNumber: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly accusedNationalId: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly accusedName: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly accusedAddress: string

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
  readonly requestedCustodyRestrictions: CaseCustodyRestrictions[]

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly caseFacts: string

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

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly courtDate: Date

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly courtRoom: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly defenderName: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly defenderEmail: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly courtStartTime: Date

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly courtEndTime: Date

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly courtAttendees: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly policeDemands: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly accusedPlea: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly litigationPresentations: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly ruling: string

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ type: String })
  readonly rejecting: boolean

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly custodyEndDate: Date

  @IsOptional()
  @IsEnum(CaseCustodyRestrictions, { each: true })
  @ApiPropertyOptional({ enum: CaseCustodyRestrictions, isArray: true })
  readonly custodyRestrictions: CaseCustodyRestrictions[]

  @IsOptional()
  @IsEnum(CaseAppealDecision, { each: true })
  @ApiPropertyOptional({ enum: CaseAppealDecision })
  readonly accusedAppealDecision: CaseAppealDecision

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly accusedAppealAnnouncement: string

  @IsOptional()
  @IsEnum(CaseAppealDecision, { each: true })
  @ApiPropertyOptional({ enum: CaseAppealDecision })
  readonly prosecutorAppealDecision: CaseAppealDecision

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly prosecutorAppealAnnouncement: string
}
