import {
  IsEnum,
  IsOptional,
  IsString,
  ValidateNested,
  IsArray,
} from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { ValidationRuleDto } from './validationRuleDto'
import { Type } from 'class-transformer'

// TODO: Add this to metadata module
// TODO: Add these to models
export enum SignatureMetaField {
  FULL_NAME = 'fullName',
  ADDRESS = 'address',
}

// TODO: Add these to models
export enum SignatureTag {
  NORDAUSTURKJORDAEMI = 'nordausturkjordaemi',
  NORDVESTURKJORDAEMI = 'nordvesturkjordaemi',
  REYKJAVIKURKJORDAEMI_NORDUR = 'reykjavikurkjordaemiNordur',
  REYKJAVIKURKJORDAEMI_SUDUR = 'reykjavikurkjordaemiSudur',
  SUDURKJORDAEMI = 'sudurkjordaemi',
  SUDVESTURKJORDAEMI = 'sudvesturkjordaemi',
}

export class SignatureListDto {
  @IsString()
  @ApiProperty()
  title!: string

  @IsOptional()
  @IsString()
  @ApiProperty()
  description = ''

  @IsOptional()
  @IsArray()
  @IsEnum(SignatureMetaField, { each: true })
  @ApiProperty()
  signatureMeta = [] as SignatureMetaField[]

  @IsOptional()
  @IsArray()
  @IsEnum(SignatureTag, { each: true })
  @ApiProperty()
  tags = [] as SignatureTag[]

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ValidationRuleDto)
  @IsArray()
  @ApiProperty()
  validationRules = [] as ValidationRuleDto[]
}
