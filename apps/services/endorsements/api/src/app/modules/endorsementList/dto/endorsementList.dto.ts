import {
  IsEnum,
  IsOptional,
  IsString,
  ValidateNested,
  IsArray,
  IsObject,
} from 'class-validator'
import { Type } from 'class-transformer'
import { ValidationRuleDto } from './validationRule.dto'
import { EndorsementTag } from '../endorsementList.model'

import { ApiProperty } from '@nestjs/swagger'
import { EndorsementMetaField } from '../../endorsementMetadata/types'
export class EndorsementListDto {
  @ApiProperty()
  @IsString()
  title!: string

  @ApiProperty({ type: String, nullable: true })
  @IsOptional()
  @IsString()
  description = ''

  @ApiProperty({ enum: EndorsementMetaField, isArray: true, nullable: true })
  @IsOptional()
  @IsArray()
  @IsEnum(EndorsementMetaField, { each: true })
  endorsementMeta = [] as EndorsementMetaField[]

  @ApiProperty({ enum: EndorsementTag, isArray: true, nullable: true })
  @IsOptional()
  @IsArray()
  @IsEnum(EndorsementTag, { each: true })
  tags = [] as EndorsementTag[]

  @ApiProperty({ type: [ValidationRuleDto], nullable: true })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ValidationRuleDto)
  @IsArray()
  validationRules = [] as ValidationRuleDto[]

  @ApiProperty({ nullable: true })
  @IsOptional()
  @IsObject()
  meta: object = {}
}
