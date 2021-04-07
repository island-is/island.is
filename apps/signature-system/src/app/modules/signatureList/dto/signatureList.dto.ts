import {
  IsEnum,
  IsOptional,
  IsString,
  ValidateNested,
  IsArray,
} from 'class-validator'
import { ValidationRuleDto } from './validationRule.dto'
import { Type } from 'class-transformer'
import { SignatureMetaField, SignatureTag } from '../signatureList.model'
export class SignatureListDto {
  @IsString()
  title!: string

  @IsOptional()
  @IsString()
  description = ''

  @IsOptional()
  @IsArray()
  @IsEnum(SignatureMetaField, { each: true })
  signatureMeta = [] as SignatureMetaField[]

  @IsOptional()
  @IsArray()
  @IsEnum(SignatureTag, { each: true })
  tags = [] as SignatureTag[]

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ValidationRuleDto)
  @IsArray()
  validationRules = [] as ValidationRuleDto[]
}
