import { Field, InputType, ObjectType } from '@nestjs/graphql'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { LanguageType } from '../languageType.model'
import {
  IsBoolean,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator'
import { Type } from 'class-transformer'
import { ListTypesEnum } from '../listTypes/listTypes.enum'
import { TimeIntervals } from '@island.is/form-system-enums'

@InputType('FormSystemFieldSettingsInput')
@ObjectType('FormSystemFieldSettings')
export class FieldSettings {
  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({ type: Number })
  @Field(() => Number, { nullable: true })
  minValue?: number

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({ type: Number })
  @Field(() => Number, { nullable: true })
  maxValue?: number

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({ type: Number })
  @Field(() => Number, { nullable: true })
  minLength?: number

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({ type: Number })
  @Field(() => Number, { nullable: true })
  maxLength?: number

  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional({ type: Date })
  @Field(() => Date, { nullable: true })
  minDate?: string

  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional({ type: Date })
  @Field(() => Date, { nullable: true })
  maxDate?: string

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({ type: Number })
  @Field(() => Number, { nullable: true })
  minAmount?: number

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({ type: Number })
  @Field(() => Number, { nullable: true })
  maxAmount?: number

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({ type: Number })
  @Field(() => Number, { nullable: true })
  year?: number

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ type: Boolean })
  @Field(() => Boolean, { nullable: true })
  hasLink?: boolean

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  @Field(() => String, { nullable: true })
  url?: string

  @IsOptional()
  @ValidateNested()
  @Type(() => LanguageType)
  @ApiPropertyOptional({ type: LanguageType })
  @Field(() => LanguageType, { nullable: true })
  buttonText?: LanguageType

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ type: Boolean })
  @Field(() => Boolean, { nullable: true })
  isLarge?: boolean

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ type: Boolean })
  @Field(() => Boolean, { nullable: true })
  hasPropertyInput?: boolean

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ type: Boolean })
  @Field(() => Boolean, { nullable: true })
  hasPropertyList?: boolean

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ enum: ListTypesEnum })
  @Field(() => String, { nullable: true })
  listType?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  @Field(() => String, { nullable: true })
  fileTypes?: string

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({ type: Number })
  @Field(() => Number, { nullable: true })
  fileMaxSize?: number

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({ type: Number })
  @Field(() => Number, { nullable: true })
  maxFiles?: number

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ enum: TimeIntervals })
  @Field(() => String, { nullable: true })
  timeInterval?: string
}
