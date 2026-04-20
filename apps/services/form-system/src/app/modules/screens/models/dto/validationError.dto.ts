import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { LanguageType } from '../../../../dataTypes/languageType.model'
import { Type } from 'class-transformer'
import { IsBoolean, ValidateNested } from 'class-validator'

export class ValidationErrorDto {
  @ApiProperty({ type: Boolean })
  @Type(() => Boolean)
  @IsBoolean()
  hasError!: boolean

  @ApiPropertyOptional({ type: LanguageType })
  @Type(() => LanguageType)
  @ValidateNested()
  title?: LanguageType

  @ApiPropertyOptional({ type: LanguageType })
  @Type(() => LanguageType)
  @ValidateNested()
  message?: LanguageType
}
