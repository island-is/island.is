import {
  IsString,
  IsOptional,
  IsEnum,
  IsUUID,
  IsBoolean,
} from 'class-validator'

import { ApiPropertyOptional } from '@nestjs/swagger'

import {
  CaseCustodyProvisions,
  CaseCustodyRestrictions,
  CaseAppealDecision,
  CaseGender,
  CaseDecision,
  AccusedPleaDecision,
} from '@island.is/judicial-system/types'

export class UpdateCaseDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly policeCaseNumber?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly accusedNationalId?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly accusedName?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly accusedAddress?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ enum: CaseGender })
  readonly accusedGender?: CaseGender

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly defenderName?: string

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
  readonly court?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly arrestDate?: Date

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly requestedCourtDate?: Date

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly requestedCustodyEndDate?: Date

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly otherDemands?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly lawsBroken?: string

  @IsOptional()
  @IsEnum(CaseCustodyProvisions, { each: true })
  @ApiPropertyOptional({ enum: CaseCustodyProvisions, isArray: true })
  readonly custodyProvisions?: CaseCustodyProvisions[]

  @IsOptional()
  @IsEnum(CaseCustodyRestrictions, { each: true })
  @ApiPropertyOptional({ enum: CaseCustodyRestrictions, isArray: true })
  readonly requestedCustodyRestrictions?: CaseCustodyRestrictions[]

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly requestedOtherRestrictions?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly caseFacts?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly legalArguments?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly comments?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly caseFilesComments?: string

  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional()
  readonly prosecutorId?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly courtCaseNumber?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly courtDate?: Date

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly courtRoom?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly courtStartTime?: Date

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly courtEndTime?: Date

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly courtAttendees?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly policeDemands?: string

  @IsOptional()
  @IsString({ each: true })
  @ApiPropertyOptional({ isArray: true })
  readonly courtDocuments?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly additionToConclusion?: string

  @IsOptional()
  @IsEnum(AccusedPleaDecision)
  @ApiPropertyOptional({ enum: AccusedPleaDecision })
  readonly accusedPleaDecision?: AccusedPleaDecision

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly accusedPleaAnnouncement?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly litigationPresentations?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly ruling?: string

  @IsOptional()
  @IsEnum(CaseDecision)
  @ApiPropertyOptional({ enum: CaseDecision })
  readonly decision?: CaseDecision

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly custodyEndDate?: Date

  @IsOptional()
  @IsEnum(CaseCustodyRestrictions, { each: true })
  @ApiPropertyOptional({ enum: CaseCustodyRestrictions, isArray: true })
  readonly custodyRestrictions?: CaseCustodyRestrictions[]

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly otherRestrictions?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly isolationTo?: Date

  @IsOptional()
  @IsEnum(CaseAppealDecision)
  @ApiPropertyOptional({ enum: CaseAppealDecision })
  readonly accusedAppealDecision?: CaseAppealDecision

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly accusedAppealAnnouncement?: string

  @IsOptional()
  @IsEnum(CaseAppealDecision)
  @ApiPropertyOptional({ enum: CaseAppealDecision })
  readonly prosecutorAppealDecision?: CaseAppealDecision

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly prosecutorAppealAnnouncement?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly accusedPostponedAppealDate?: Date

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly prosecutorPostponedAppealDate?: Date

  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional()
  readonly judgeId?: string

  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional()
  readonly registrarId?: string
}
