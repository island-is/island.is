import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional, IsString, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'
import { LanguageType } from '../../../../dataTypes/languageType.model'

export class OrganizationZendeskInstanceDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  zendeskInstance?: string

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  zendeskBrandId?: string

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  organizationId?: string

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  formId?: string

  @ApiPropertyOptional({ type: LanguageType })
  @ValidateNested()
  @Type(() => LanguageType)
  @IsOptional()
  name?: LanguageType

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  logo?: string
}
