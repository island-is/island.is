import {
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsString,
  IsArray,
  IsOptional,
} from 'class-validator'
import { ApplicationState } from '../application.model'
import { SchemaType } from '@island.is/application/schema'
import { ApiProperty } from '@nestjs/swagger'

export class ApplicationDto {
  @IsNotEmpty()
  @IsString()
  @IsEnum(SchemaType)
  @ApiProperty({ enum: SchemaType })
  readonly typeId: SchemaType

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly applicant: string

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly assignee: string

  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly externalId: string

  @IsNotEmpty()
  @IsEnum(ApplicationState)
  @ApiProperty({ enum: ApplicationState })
  readonly state: string

  @IsNotEmpty()
  @IsObject()
  @ApiProperty()
  readonly answers: object

  @IsOptional()
  @IsArray()
  @ApiProperty()
  readonly attachments: string[]
}
