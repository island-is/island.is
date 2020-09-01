import { IsEnum, IsObject, IsString, IsOptional } from 'class-validator'
import { ApplicationState } from '../application.model'
import { FormType } from '@island.is/application/schema'
import { ApiPropertyOptional } from '@nestjs/swagger'

export class UpdateApplicationDto {
  @IsOptional()
  @IsEnum(FormType)
  @ApiPropertyOptional({ enum: FormType })
  readonly typeId?: FormType

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly applicant?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly assignee?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly externalId?: string

  @IsOptional()
  @IsEnum(ApplicationState)
  @ApiPropertyOptional({ enum: ApplicationState })
  readonly state?: ApplicationState

  @IsOptional()
  @IsObject()
  @ApiPropertyOptional()
  readonly answers?: object

  @IsOptional()
  @IsObject()
  @ApiPropertyOptional()
  readonly attachments?: object
}
