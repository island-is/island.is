import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { LanguageType } from '../../../../dataTypes/languageType.model'
import { CertificationTypeDto } from '../../../certifications/models/dto/certificationType.dto'
import { FormApplicantDto } from '../../../applicants/models/dto/formApplicant.dto'
import { Dependency } from '../../../../dataTypes/dependency.model'
import {
  IsArray,
  IsBoolean,
  IsDate,
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
  isTranslated?: boolean

  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional()
  applicationDaysToRemove?: number

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional()
  stopProgressOnValidatingScreen?: boolean

  @ValidateNested()
  @Type(() => LanguageType)
  @IsOptional()
  @ApiPropertyOptional({ type: LanguageType })
  completedMessage?: LanguageType

  // @ValidateNested()
  @Type(() => Dependency)
  @IsOptional()
  @ApiPropertyOptional({ type: Dependency })
  dependencies?: Dependency

  @ValidateNested()
  @Type(() => CertificationTypeDto)
  @IsArray()
  @IsOptional()
  @ApiPropertyOptional({ type: [CertificationTypeDto] })
  certificationTypes?: CertificationTypeDto[]

  @ValidateNested()
  @Type(() => FormApplicantDto)
  @IsArray()
  @IsOptional()
  @ApiPropertyOptional({ type: [FormApplicantDto] })
  applicants?: FormApplicantDto[]
}
