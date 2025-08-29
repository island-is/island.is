import { ApiPropertyOptional } from '@nestjs/swagger'
import { LanguageType } from '../../../../dataTypes/languageType.model'
import { Dependency } from '../../../../dataTypes/dependency.model'
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator'
import { Type } from 'class-transformer'

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
  applicationDaysToRemove?: number

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional()
  stopProgressOnValidatingScreen?: boolean

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional()
  hasSummaryScreen?: boolean

  @ValidateNested()
  @Type(() => LanguageType)
  @IsOptional()
  @ApiPropertyOptional({ type: LanguageType })
  completedMessage?: LanguageType

  @ValidateNested()
  @Type(() => Dependency)
  @IsArray()
  @IsOptional()
  @ApiPropertyOptional({ type: [Dependency] })
  dependencies?: Dependency[]
}
