import { Field, InputType } from '@nestjs/graphql'
import { ApiPropertyOptional } from '@nestjs/swagger'
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator'
import { Type } from 'class-transformer'
import { Dependency, LanguageType } from '@island.is/form-system-dataTypes'

@InputType('FormSystemUpdateFormInput')
export class UpdateFormDto {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  @Field(() => String, { nullable: true })
  organizationId?: string

  @ValidateNested()
  @Type(() => LanguageType)
  @IsOptional()
  @ApiPropertyOptional({ type: LanguageType })
  @Field(() => LanguageType, { nullable: true })
  name?: LanguageType

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  @Field(() => String, { nullable: true })
  slug?: string

  @IsDateString()
  @IsOptional()
  @ApiPropertyOptional({ type: Date })
  @Field(() => Date, { nullable: true })
  invalidationDate?: Date

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional()
  @Field(() => Boolean, { nullable: true })
  beenPublished?: boolean

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional()
  @Field(() => Boolean, { nullable: true })
  isTranslated?: boolean

  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional()
  @Field(() => Number, { nullable: true })
  applicationDaysToRemove?: number

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional()
  @Field(() => Boolean, { nullable: true })
  stopProgressOnValidatingScreen?: boolean

  @ValidateNested()
  @Type(() => LanguageType)
  @IsOptional()
  @ApiPropertyOptional({ type: LanguageType })
  @Field(() => LanguageType, { nullable: true })
  completedMessage?: LanguageType

  @ValidateNested()
  @Type(() => Dependency)
  @IsArray()
  @IsOptional()
  @ApiPropertyOptional({ type: [Dependency] })
  @Field(() => [Dependency], { nullable: 'itemsAndList' })
  dependencies?: Dependency[]
}
