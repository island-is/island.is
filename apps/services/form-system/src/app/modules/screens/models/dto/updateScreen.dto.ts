import { ApiProperty } from '@nestjs/swagger'
import { LanguageType } from '../../../../dataTypes/languageType.model'
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  ValidateNested,
} from 'class-validator'
import { Type } from 'class-transformer'

export class UpdateScreenDto {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => LanguageType)
  @ApiProperty({ type: LanguageType })
  name!: LanguageType

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  multiset!: number

  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty()
  callRuleset!: boolean
}
