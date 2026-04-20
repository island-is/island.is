import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsArray, ValidateNested } from 'class-validator'
import { LanguageType } from './languageType.model'

export class CompletedSectionInfo {
  @ApiProperty({ type: LanguageType })
  @ValidateNested()
  @Type(() => LanguageType)
  title!: LanguageType

  @ApiProperty({ type: LanguageType })
  @ValidateNested()
  @Type(() => LanguageType)
  confirmationHeader!: LanguageType

  @ApiProperty({ type: LanguageType })
  @ValidateNested()
  @Type(() => LanguageType)
  confirmationText!: LanguageType

  @ApiProperty({ type: LanguageType, isArray: true })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LanguageType)
  additionalInfo: LanguageType[] = []
}
