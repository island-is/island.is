import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { LanguageType } from '../../../../dataTypes/languageType.model'
import { IsNotEmpty, IsOptional, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'

export class UpdateSectionDto {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => LanguageType)
  @ApiProperty({ type: LanguageType })
  name!: LanguageType

  @IsOptional()
  @ValidateNested()
  @Type(() => LanguageType)
  @ApiPropertyOptional({ type: LanguageType })
  waitingText?: LanguageType
}
