import { Transform, Type } from 'class-transformer'
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsDate,
  IsEnum,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  MaxLength,
  ValidateNested,
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
  CaseIndictmentRulingDecision,
  CaseLegalProvisions,
  CaseType,
  CourtDocument,
  CourtSessionType,
  IndictmentCaseReviewDecision,
  IndictmentDecision,
  RequestSharedWithDefender,
  SessionArrangements,
  UserRole,
} from '@island.is/judicial-system/types'

import { nationalIdTransformer } from '../../../transformers'

class UpdateDateLog {
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  @ApiPropertyOptional({ type: Date })
  readonly date?: Date

  @IsOptional()
  @IsString()
  @MaxLength(255)
  @ApiPropertyOptional({ type: String })
  readonly location?: string
}

export class UpdateCaseDto {
  @IsOptional()
  @IsEnum(CaseType)
  @ApiPropertyOptional({ enum: CaseType })
  readonly type?: CaseType

  @IsOptional()
  @IsObject()
  @ApiPropertyOptional({ type: Object })
  readonly indictmentSubtypes?: IndictmentSubtypeMap

  @IsOptional()
  @IsString()
  @MaxLength(255)
  @ApiPropertyOptional({ type: String })
  readonly description?: string

  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  @MaxLength(255, { each: true })
  @ApiPropertyOptional({ type: String, isArray: true })
  readonly policeCaseNumbers?: string[]

  @IsOptional()
  @IsString()
  @MaxLength(255)
  @ApiPropertyOptional({ type: String })
  readonly defenderName?: string

  @IsOptional()
  @IsString()
  @Length(10, 10)
  @Transform(nationalIdTransformer)
  @ApiPropertyOptional({ type: String })
  readonly defenderNationalId?: string

  @IsOptional()
  @IsString()
  @MaxLength(255)
  @ApiPropertyOptional({ type: String })
  readonly defenderEmail?: string

  @IsOptional()
  @IsString()
  @MaxLength(255)
  @ApiPropertyOptional({ type: String })
  readonly defenderPhoneNumber?: string

  @IsOptional()
  @IsEnum(RequestSharedWithDefender)
  @ApiPropertyOptional({ enum: RequestSharedWithDefender })
  readonly requestSharedWithDefender?: RequestSharedWithDefender

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ type: Boolean })
  readonly isHeightenedSecurityLevel?: boolean

  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional({ type: String })
  readonly courtId?: string

  @IsOptional()
  @IsString()
  @MaxLength(255)
  @ApiPropertyOptional({ type: String })
  readonly leadInvestigator?: string

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  @ApiPropertyOptional({ type: Date })
  readonly arrestDate?: Date

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  @ApiPropertyOptional({ type: Date })
  readonly requestedCourtDate?: Date

  @IsOptional()
  @IsString()
  @MaxLength(255)
  @ApiPropertyOptional({ type: String })
  readonly translator?: string

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  @ApiPropertyOptional({ type: Date })
  readonly requestedValidToDate?: Date

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  readonly demands?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  readonly lawsBroken?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  readonly legalBasis?: string

  @IsOptional()
  @IsArray()
  @IsEnum(CaseLegalProvisions, { each: true })
  @ApiPropertyOptional({ enum: CaseLegalProvisions, isArray: true })
  readonly legalProvisions?: CaseLegalProvisions[]

  @IsOptional()
  @IsArray()
  @IsEnum(CaseCustodyRestrictions, { each: true })
  @ApiPropertyOptional({ enum: CaseCustodyRestrictions, isArray: true })
  readonly requestedCustodyRestrictions?: CaseCustodyRestrictions[]

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  readonly requestedOtherRestrictions?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  readonly caseFacts?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  readonly legalArguments?: string

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ type: Boolean })
  readonly requestProsecutorOnlySession?: boolean

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  readonly prosecutorOnlySessionRequest?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  readonly comments?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  readonly caseFilesComments?: string

  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional({ type: String })
  readonly prosecutorId?: string

  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional({ type: String })
  readonly sharedWithProsecutorsOfficeId?: string

  @IsOptional()
  @IsString()
  @MaxLength(255)
  @ApiPropertyOptional({ type: String })
  readonly courtCaseNumber?: string

  @IsOptional()
  @IsEnum(SessionArrangements)
  @ApiPropertyOptional({ enum: SessionArrangements })
  readonly sessionArrangements?: SessionArrangements

  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateDateLog)
  @ApiPropertyOptional({ type: UpdateDateLog })
  readonly arraignmentDate?: UpdateDateLog

  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateDateLog)
  @ApiPropertyOptional({ type: UpdateDateLog })
  readonly courtDate?: UpdateDateLog

  @IsOptional()
  @IsString()
  @MaxLength(255)
  @ApiPropertyOptional({ type: String })
  readonly courtLocation?: string

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  @ApiPropertyOptional({ type: Date })
  readonly courtStartDate?: Date

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  @ApiPropertyOptional({ type: Date })
  readonly courtEndTime?: Date

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ type: Boolean })
  readonly isClosedCourtHidden?: boolean

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  readonly courtAttendees?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  readonly prosecutorDemands?: string

  @IsOptional()
  @IsArray()
  @IsObject({ each: true })
  @ApiPropertyOptional({ type: Object, isArray: true })
  readonly courtDocuments?: CourtDocument[]

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  readonly sessionBookings?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  readonly courtCaseFacts?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  readonly introduction?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  readonly courtLegalArguments?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  readonly ruling?: string

  @IsOptional()
  @IsEnum(CaseDecision)
  @ApiPropertyOptional({ enum: CaseDecision })
  readonly decision?: CaseDecision

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  @ApiPropertyOptional({ type: Date })
  readonly validToDate?: Date

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ type: Boolean })
  readonly isCustodyIsolation?: boolean

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  @ApiPropertyOptional({ type: Date })
  readonly isolationToDate?: Date

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  readonly conclusion?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  readonly endOfSessionBookings?: string

  @IsOptional()
  @IsEnum(CaseAppealDecision)
  @ApiPropertyOptional({ enum: CaseAppealDecision })
  readonly accusedAppealDecision?: CaseAppealDecision

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  readonly accusedAppealAnnouncement?: string

  @IsOptional()
  @IsEnum(CaseAppealDecision)
  @ApiPropertyOptional({ enum: CaseAppealDecision })
  readonly prosecutorAppealDecision?: CaseAppealDecision

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  readonly prosecutorAppealAnnouncement?: string

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  @ApiPropertyOptional({ type: Date })
  readonly rulingSignatureDate?: Date

  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional({ type: String })
  readonly judgeId?: string

  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional({ type: String })
  readonly registrarId?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  readonly caseModifiedExplanation?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  readonly rulingModifiedHistory?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  readonly caseResentExplanation?: string

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ type: Boolean })
  readonly defendantWaivesRightToCounsel?: boolean

  @IsOptional()
  @IsObject()
  @ApiPropertyOptional({ type: Object })
  readonly crimeScenes?: CrimeSceneMap

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  readonly indictmentIntroduction?: string

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ type: Boolean })
  readonly requestDriversLicenseSuspension?: boolean

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  @ApiPropertyOptional({ type: Date })
  readonly prosecutorStatementDate?: Date

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  @ApiPropertyOptional({ type: Date })
  readonly defendantStatementDate?: Date

  @IsOptional()
  @IsString()
  @MaxLength(255)
  @ApiPropertyOptional({ type: String })
  readonly appealCaseNumber?: string

  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional({ type: String })
  readonly appealAssistantId?: string

  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional({ type: String })
  readonly appealJudge1Id?: string

  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional({ type: String })
  readonly appealJudge2Id?: string

  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional({ type: String })
  readonly appealJudge3Id?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  readonly appealConclusion?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  readonly appealRulingModifiedHistory?: string

  @IsOptional()
  @IsEnum(CaseAppealRulingDecision)
  @ApiPropertyOptional({ enum: CaseAppealRulingDecision })
  readonly appealRulingDecision?: CaseAppealRulingDecision

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  @ApiPropertyOptional({ type: Date })
  readonly appealValidToDate?: Date

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ type: Boolean })
  readonly isAppealCustodyIsolation?: boolean

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  @ApiPropertyOptional({ type: Date })
  readonly appealIsolationToDate?: Date

  @IsOptional()
  @IsArray()
  @IsEnum(UserRole, { each: true })
  @ApiPropertyOptional({ enum: UserRole, isArray: true })
  readonly requestAppealRulingNotToBePublished?: UserRole[]

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  readonly indictmentDeniedExplanation?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  readonly indictmentReturnedExplanation?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  readonly postponedIndefinitelyExplanation?: string

  @IsOptional()
  @IsEnum(CaseIndictmentRulingDecision)
  @ApiPropertyOptional({ enum: CaseIndictmentRulingDecision })
  readonly indictmentRulingDecision?: CaseIndictmentRulingDecision

  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional({ type: String })
  readonly indictmentReviewerId?: string

  @IsOptional()
  @IsEnum(IndictmentCaseReviewDecision)
  @ApiPropertyOptional({ enum: IndictmentCaseReviewDecision })
  readonly indictmentReviewDecision?: IndictmentCaseReviewDecision

  @IsOptional()
  @IsEnum(IndictmentDecision)
  @ApiPropertyOptional({ enum: IndictmentDecision })
  readonly indictmentDecision?: IndictmentDecision

  @IsOptional()
  @IsEnum(CourtSessionType)
  @ApiPropertyOptional({ enum: CourtSessionType })
  readonly courtSessionType?: CourtSessionType

  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional({ type: String })
  readonly mergeCaseId?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  readonly mergeCaseNumber?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  readonly civilDemands?: string

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ type: Boolean })
  readonly hasCivilClaims?: boolean

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ type: Boolean })
  readonly isCompletedWithoutRuling?: boolean

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ type: Boolean })
  readonly publicProsecutorIsRegisteredInPoliceSystem?: boolean

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ type: Boolean })
  readonly isRegisteredInPrisonSystem?: boolean

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  readonly penalties?: string
}
