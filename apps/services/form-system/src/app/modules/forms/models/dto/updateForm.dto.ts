import { ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator'
import { CompletedSectionInfo } from '../../../../dataTypes/completedSectionInfo.model'
import { Dependency } from '../../../../dataTypes/dependency.model'
import { LanguageType } from '../../../../dataTypes/languageType.model'

export class UpdateFormDto {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  organizationId?: string

  @ValidateNested()
  @Type(() => LanguageType)
  @IsOptional()
  @ApiPropertyOptional({ type: LanguageType })
  name?: LanguageType

  @ValidateNested()
  @Type(() => LanguageType)
  @IsOptional()
  @ApiPropertyOptional({ type: LanguageType })
  organizationDisplayName?: LanguageType

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  slug?: string

  @IsDateString()
  @IsOptional()
  @ApiPropertyOptional({ type: Date })
  invalidationDate?: Date

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional()
  zendeskInternal?: boolean

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional()
  useValidate?: boolean

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional()
  usePopulate?: boolean

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  submissionServiceUrl?: string

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional()
  hasPayment?: boolean

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional()
  beenPublished?: boolean

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional()
  isTranslated?: boolean

  @IsInt()
  @Min(1)
  @Max(60)
  @IsOptional()
  @ApiPropertyOptional()
  draftDaysToLive?: number

  @IsInt()
  @Min(1)
  @Max(30)
  @IsOptional()
  @ApiPropertyOptional()
  submissionDaysToLive?: number

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional()
  allowProceedOnValidationFail?: boolean

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional()
  hasSummaryScreen?: boolean

  @ValidateNested()
  @Type(() => CompletedSectionInfo)
  @IsOptional()
  @ApiPropertyOptional({ type: CompletedSectionInfo })
  completedSectionInfo?: CompletedSectionInfo

  @ValidateNested()
  @Type(() => Dependency)
  @IsArray()
  @IsOptional()
  @ApiPropertyOptional({ type: [Dependency] })
  dependencies?: Dependency[]
}
