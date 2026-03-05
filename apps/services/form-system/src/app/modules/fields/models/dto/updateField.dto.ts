import { ApiPropertyOptional } from '@nestjs/swagger'
import { LanguageType } from '../../../../dataTypes/languageType.model'
import { FieldTypesEnum } from '@island.is/form-system/shared'
import { IsEnum, IsOptional, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'
import { FieldSettings } from '../../../../dataTypes/fieldSettings/fieldSettings.model'

export class UpdateFieldDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => LanguageType)
  @ApiPropertyOptional({ type: LanguageType })
  name?: LanguageType

  @IsOptional()
  @ValidateNested()
  @Type(() => LanguageType)
  @ApiPropertyOptional({ type: LanguageType })
  description?: LanguageType

  @IsOptional()
  @ApiPropertyOptional({ type: Boolean })
  isPartOfMultiset?: boolean

  @IsOptional()
  @ApiPropertyOptional({ type: Boolean })
  isRequired?: boolean

  @IsOptional()
  @ValidateNested()
  @Type(() => FieldSettings)
  @ApiPropertyOptional({ type: FieldSettings })
  fieldSettings?: FieldSettings

  @IsOptional()
  @IsEnum(FieldTypesEnum)
  @ApiPropertyOptional()
  fieldType?: string
}
