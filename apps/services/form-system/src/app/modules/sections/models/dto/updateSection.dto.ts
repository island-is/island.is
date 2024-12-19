import { ApiPropertyOptional } from '@nestjs/swagger'
import { LanguageType } from '../../../../dataTypes/languageType.model'
import { IsOptional, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'

export class UpdateSectionDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => LanguageType)
  @ApiPropertyOptional({ type: LanguageType })
  name?: LanguageType

  @IsOptional()
  @ValidateNested()
  @Type(() => LanguageType)
  @ApiPropertyOptional({ type: LanguageType })
  waitingText?: LanguageType
}
