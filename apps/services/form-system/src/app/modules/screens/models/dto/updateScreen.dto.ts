import { ApiPropertyOptional } from '@nestjs/swagger'
import { LanguageType } from '../../../../dataTypes/languageType.model'
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  ValidateNested,
} from 'class-validator'
import { Type } from 'class-transformer'

export class UpdateScreenDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => LanguageType)
  @ApiPropertyOptional({ type: LanguageType })
  name?: LanguageType

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional()
  multiset?: number

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional()
  callRuleset?: boolean
}
