import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsEnum,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator'

import { ApiPropertyOptional } from '@nestjs/swagger'

import type {
  CrimeSceneMap,
  IndictmentSubtypeMap,
} from '@island.is/judicial-system/types'
import {
  CaseAppealDecision,
  CaseAppealRulingDecision,
  CaseCustodyRestrictions,
  CaseDecision,
  CaseLegalProvisions,
  CaseType,
  CourtDocument,
  RequestSharedWithDefender,
  SessionArrangements,
} from '@island.is/judicial-system/types'

export class UpdateCaseDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ enum: CaseType })
  readonly type?: CaseType

  @IsOptional()
  @IsObject()
  @ApiPropertyOptional()
  readonly indictmentSubtypes?: IndictmentSubtypeMap

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly description?: string

  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  @ApiPropertyOptional()
  readonly policeCaseNumbers?: string[]

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
  @IsEnum(RequestSharedWithDefender)
  @ApiPropertyOptional({ enum: RequestSharedWithDefender })
  readonly requestSharedWithDefender?: RequestSharedWithDefender

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional()
  readonly isHeightenedSecurityLevel?: boolean

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly courtId?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly leadInvestigator?: string

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
  readonly translator?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly requestedValidToDate?: Date

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly demands?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly lawsBroken?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly legalBasis?: string

  @IsOptional()
  @IsEnum(CaseLegalProvisions, { each: true })
  @ApiPropertyOptional({ enum: CaseLegalProvisions, isArray: true })
  readonly legalProvisions?: CaseLegalProvisions[]

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
  @IsBoolean()
  @ApiPropertyOptional()
  readonly requestProsecutorOnlySession?: boolean

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly prosecutorOnlySessionRequest?: string

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
  @IsUUID()
  @ApiPropertyOptional()
  readonly sharedWithProsecutorsOfficeId?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly courtCaseNumber?: string

  @IsOptional()
  @IsEnum(SessionArrangements)
  @ApiPropertyOptional({ enum: SessionArrangements })
  readonly sessionArrangements?: SessionArrangements

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly courtDate?: Date

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly courtLocation?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly courtRoom?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly courtStartDate?: Date

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly courtEndTime?: Date

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional()
  readonly isClosedCourtHidden?: boolean

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly courtAttendees?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly prosecutorDemands?: string

  @IsOptional()
  @IsObject({ each: true })
  @ApiPropertyOptional({ isArray: true })
  readonly courtDocuments?: CourtDocument[]

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly sessionBookings?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly courtCaseFacts?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly introduction?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly courtLegalArguments?: string

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
  readonly validToDate?: Date

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional()
  readonly isCustodyIsolation?: boolean

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly isolationToDate?: Date

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly conclusion?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly endOfSessionBookings?: string

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
  @IsUUID()
  @ApiPropertyOptional()
  readonly judgeId?: string

  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional()
  readonly registrarId?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly caseModifiedExplanation?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly rulingModifiedHistory?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly caseResentExplanation?: string

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional()
  readonly defendantWaivesRightToCounsel?: boolean

  @IsOptional()
  @IsObject()
  @ApiPropertyOptional()
  readonly crimeScenes?: CrimeSceneMap

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly indictmentIntroduction?: string

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional()
  readonly requestDriversLicenseSuspension?: boolean

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly prosecutorStatementDate?: Date

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly defendantStatementDate?: Date

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly appealCaseNumber?: string

  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional()
  readonly appealAssistantId?: string

  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional()
  readonly appealJudge1Id?: string

  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional()
  readonly appealJudge2Id?: string

  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional()
  readonly appealJudge3Id?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly appealConclusion?: string

  @IsOptional()
  @IsEnum(CaseAppealRulingDecision)
  @ApiPropertyOptional({ enum: CaseAppealRulingDecision })
  readonly appealRulingDecision?: CaseAppealRulingDecision
}
