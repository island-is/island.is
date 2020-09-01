import {
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsString,
  IsArray,
  IsOptional,
} from 'class-validator'
import { ApplicationState, FormType } from '@island.is/application/schema'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class CreateApplicationDto {
  @IsNotEmpty()
  @IsEnum(FormType)
  @ApiProperty({ enum: FormType })
  readonly typeId: FormType

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
  @ApiPropertyOptional()
  readonly externalId: string

  @IsNotEmpty()
  @IsEnum(ApplicationState)
  @ApiProperty({ enum: ApplicationState })
  readonly state: ApplicationState

  @IsNotEmpty()
  @IsObject()
  @ApiProperty()
  readonly answers: object

  @IsOptional()
  @IsArray()
  @ApiPropertyOptional()
  readonly attachments: string[]
}
