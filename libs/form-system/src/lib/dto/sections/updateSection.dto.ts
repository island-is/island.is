import { Field, InputType } from '@nestjs/graphql'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'
import { LanguageType } from '@island.is/form-system-dataTypes'

@InputType('FormSystemUpdateSectionInput')
export class UpdateSectionDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => LanguageType)
  @ApiPropertyOptional({ type: LanguageType })
  @Field(() => LanguageType, { nullable: true })
  name?: LanguageType

  @IsOptional()
  @ValidateNested()
  @Type(() => LanguageType)
  @ApiPropertyOptional({ type: LanguageType })
  @Field(() => LanguageType, { nullable: true })
  waitingText?: LanguageType
}
