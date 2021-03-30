import { IsEnum, IsOptional, IsString, ValidateNested } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { ValidationRuleDto } from './validationRuleDto'

// TODO: Add this to metadata module
// TODO: Add these to models
export enum SignatureMetaField {
  FULL_NAME = 'fullName',
  ADDRESS = 'address',
}

// TODO: Add these to models
export enum SignatureTag {
  SUDURKJORDAEMI = 'sudurkjordaemi',
  NORDURKJORDAEMI = 'nordurkjordaemi',
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
  @IsEnum(SignatureMetaField, { each: true })
  @ApiProperty()
  signatureMeta = [] as SignatureMetaField[]

  @IsOptional()
  @IsEnum(SignatureTag, { each: true })
  @ApiProperty()
  tags = [] as SignatureTag[]

  @IsOptional()
  @ValidateNested({ each: true })
  @ApiProperty()
  validationRules = [] as ValidationRuleDto[]
}
