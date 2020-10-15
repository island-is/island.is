import {
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsString,
  IsOptional,
  IsArray,
} from 'class-validator'
import { ApplicationTypes } from '@island.is/application/core'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class CreateApplicationDto {
  @IsNotEmpty()
  @IsEnum(ApplicationTypes)
  @ApiProperty({ enum: ApplicationTypes })
  readonly typeId!: ApplicationTypes

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly applicant!: string

  @IsNotEmpty()
  @IsArray()
  @ApiProperty()
  readonly assignees!: string[]

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly externalId?: string

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly state!: string

  @IsNotEmpty()
  @IsObject()
  @ApiProperty()
  readonly answers!: object

  @IsOptional()
  @IsObject()
  @ApiPropertyOptional()
  readonly attachments?: object
}
