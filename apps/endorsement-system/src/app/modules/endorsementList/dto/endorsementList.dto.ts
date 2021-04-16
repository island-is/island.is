import {
  IsEnum,
  IsOptional,
  IsString,
  ValidateNested,
  IsArray,
} from 'class-validator'
import { Type } from 'class-transformer'
import { ValidationRuleDto } from './validationRule.dto'
import { EndorsementTag } from '../endorsementList.model'
import { EndorsementMetaField } from '../../endorsementMetadata/endorsementMetadata.service'
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
