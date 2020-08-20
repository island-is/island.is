import {
  IsEnum,
  IsObject,
  IsString,
  IsArray,
  IsOptional,
} from 'class-validator'
import { ApplicationState } from '../application.model'
import { FormType } from '@island.is/application/schema'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class UpdateApplicationDto {
  @IsString()
  @ApiProperty()
  readonly id: string

  @IsOptional()
  @IsEnum(FormType)
  @ApiPropertyOptional({ enum: FormType })
  readonly typeId: FormType

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly applicant: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly assignee: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly externalId: string

  @IsOptional()
  @IsEnum(ApplicationState)
  @ApiPropertyOptional({ enum: ApplicationState })
  readonly state: ApplicationState

  @IsOptional()
  @IsObject()
  @ApiPropertyOptional()
  readonly answers: object

  @IsOptional()
  @IsArray()
  @ApiPropertyOptional()
  readonly attachments: string[]
}
