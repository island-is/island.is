import { Field, InputType } from '@nestjs/graphql'
import { ApiPropertyOptional } from '@nestjs/swagger'
import {
  IsBoolean,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator'
import { Type } from 'class-transformer'
import { LanguageType } from '@island.is/form-system-dataTypes'

@InputType('FormSystemUpdateListItem')
export class UpdateListItemDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => LanguageType)
  @ApiPropertyOptional({ type: LanguageType })
  @Field(() => LanguageType, { nullable: true })
  label?: LanguageType

  @IsOptional()
  @ValidateNested()
  @Type(() => LanguageType)
  @ApiPropertyOptional({ type: LanguageType })
  @Field(() => LanguageType, { nullable: true })
  description?: LanguageType

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  @Field(() => String, { nullable: true })
  value?: string

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional()
  @Field(() => Boolean, { nullable: true })
  isSelected?: boolean
}

@InputType('FormSystemUpdateListItemInput')
export class UpdateListItemInput {
  @Field(() => String)
  id!: string

  @Field(() => UpdateListItemDto)
  updateListItemDto!: UpdateListItemDto
}
