import { Field, InputType } from '@nestjs/graphql'
import { ApiPropertyOptional } from '@nestjs/swagger'
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  ValidateNested,
} from 'class-validator'
import { Type } from 'class-transformer'
import { LanguageType } from '@island.is/form-system-dataTypes'

@InputType('FormSystemUpdateScreenInput')
export class UpdateScreenDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => LanguageType)
  @ApiPropertyOptional({ type: LanguageType })
  @Field(() => LanguageType, { nullable: true })
  name?: LanguageType

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional()
  @Field(() => Number, { nullable: true })
  multiset?: number

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional()
  @Field(() => Boolean, { nullable: true })
  callRuleset?: boolean
}
