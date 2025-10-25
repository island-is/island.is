import { ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
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
  hasPayment?: boolean

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional()
  beenPublished?: boolean

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional()
  isTranslated?: boolean

  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional()
  daysUntilApplicationPrune?: number

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
