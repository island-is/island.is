import { ApiProperty } from '@nestjs/swagger'
import { LanguageType } from '../../../../dataTypes/languageType.model'
import { IsNotEmpty, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'

export class UpdateFormApplicantTypeDto {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => LanguageType)
  @ApiProperty({ type: LanguageType })
  name!: LanguageType
}
