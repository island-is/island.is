import { ValueType } from '../../../../dataTypes/valueTypes/valueType.model'
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
} from 'class-validator'

export class ApplicationJsonValueDto {
  @ApiProperty()
  @IsNumber()
  order!: number

  @ApiProperty({ type: ValueType })
  @ValidateNested()
  @Type(() => ValueType)
  json!: ValueType
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
