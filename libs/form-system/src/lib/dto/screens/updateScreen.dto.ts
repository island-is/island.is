import { ApiPropertyOptional } from '@nestjs/swagger'
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  ValidateNested,
} from 'class-validator'
import { Type } from 'class-transformer'
import { LanguageType } from '@island.is/form-system-dataTypes'

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
