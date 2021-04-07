import {
  IsEnum,
  IsOptional,
  IsString,
  ValidateNested,
  IsArray,
} from 'class-validator'
import { ValidationRuleDto } from './ValidationRule.dto'
import { Type } from 'class-transformer'
import { EndorsementMetaField, EndorsementTag } from '../endorsementList.model'
export class EndorsementListDto {
  @IsString()
  title!: string

  @IsOptional()
  @IsString()
  description = ''

  @IsOptional()
  @IsArray()
  @IsEnum(EndorsementMetaField, { each: true })
  endorsementMeta = [] as EndorsementMetaField[]

  @IsOptional()
  @IsArray()
  @IsEnum(EndorsementTag, { each: true })
  tags = [] as EndorsementTag[]

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ValidationRuleDto)
  @IsArray()
  validationRules = [] as ValidationRuleDto[]
}
