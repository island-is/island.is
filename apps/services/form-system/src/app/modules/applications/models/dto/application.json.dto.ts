import { ValueType } from '../../../../dataTypes/valueTypes/valueType.model'
import { LanguageType } from '../../../../dataTypes/languageType.model'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsOptional,
  IsNumber,
  IsString,
  ValidateNested,
  IsObject,
} from 'class-validator'

export class ApplicationJsonValueDto {
  @ApiProperty()
  @IsNumber()
  order!: number

  // @ApiProperty({ type: Object })
  // @IsObject()
  // json!: Record<string, unknown>

  @ApiProperty({ type: ValueType })
  @ValidateNested()
  @Type(() => ValueType)
  json!: ValueType
}

export class ApplicationJsonListItemDto {
  @ApiProperty({ type: LanguageType })
  @ValidateNested()
  @Type(() => LanguageType)
  label!: LanguageType

  @IsOptional()
  @ApiPropertyOptional({ type: LanguageType })
  @ValidateNested()
  @Type(() => LanguageType)
  description?: LanguageType

  @ApiProperty()
  @IsString()
  value!: string

  @ApiProperty()
  @IsNumber()
  displayOrder!: number

  @ApiProperty()
  @IsBoolean()
  isSelected!: boolean
}
export class ApplicationJsonFieldDto {
  @ApiProperty()
  @IsString()
  identifier!: string

  @ApiProperty()
  @IsString()
  screenIdentifier!: string

  @ApiProperty()
  @IsString()
  fieldType!: string

  @ApiPropertyOptional({ type: [ApplicationJsonListItemDto] })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ApplicationJsonListItemDto)
  list?: ApplicationJsonListItemDto[]

  @ApiProperty({ type: [ApplicationJsonValueDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ApplicationJsonValueDto)
  values!: ApplicationJsonValueDto[]
}

export class ApplicationJsonDto {
  @ApiProperty()
  @IsString()
  id!: string

  @ApiProperty()
  @IsString()
  slug!: string

  @ApiProperty()
  @IsBoolean()
  isTest!: boolean

  @ApiProperty()
  @IsString()
  status!: string

  @ApiPropertyOptional({ type: Date, nullable: true })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  submittedAt?: Date | null

  @ApiProperty({ type: [ApplicationJsonFieldDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ApplicationJsonFieldDto)
  fields!: ApplicationJsonFieldDto[]
}
