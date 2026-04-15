import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsOptional,
  IsNumber,
  IsObject,
  IsString,
  ValidateNested,
} from 'class-validator'

export class ApplicationXroadValueDto {
  @ApiProperty()
  @IsNumber()
  order!: number

  @ApiProperty({ type: Object })
  @IsObject()
  json!: Record<string, unknown>
}

export class ApplicationXroadFieldDto {
  @ApiProperty()
  @IsString()
  identifier!: string

  @ApiProperty()
  @IsString()
  screenIdentifier!: string

  @ApiProperty()
  @IsString()
  fieldType!: string

  @ApiProperty({ type: [ApplicationXroadValueDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ApplicationXroadValueDto)
  values!: ApplicationXroadValueDto[]
}

export class ApplicationXroadDto {
  @ApiProperty()
  @IsString()
  id!: string

  @ApiProperty()
  @IsString()
  formId!: string

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

  @ApiProperty({ type: [ApplicationXroadFieldDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ApplicationXroadFieldDto)
  fields!: ApplicationXroadFieldDto[]
}
