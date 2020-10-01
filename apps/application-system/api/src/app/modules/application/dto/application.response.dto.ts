import {
  ApplicationContext,
  ApplicationRole,
  ApplicationStateSchema,
  ApplicationTypes,
  Application,
  ApplicationTemplate,
  ApplicationTemplateHelper,
} from '@island.is/application/template'
import { EventObject, MachineConfig } from 'xstate'

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Exclude, Expose, Type } from 'class-transformer'
import {
  IsArray,
  IsDate,
  IsEnum,
  IsNumber,
  IsObject,
  IsString,
  ValidateNested,
} from 'class-validator'

export class ApplicationResponseDto {
  @ApiProperty()
  @Expose()
  @IsString()
  id!: string

  @ApiProperty()
  @Expose()
  @IsDate()
  created!: Date

  @ApiProperty()
  @Expose()
  @IsDate()
  modified!: Date

  @ApiProperty()
  @Expose()
  @IsString()
  applicant!: string

  @ApiProperty()
  @Expose()
  @IsString()
  assignee!: string

  @ApiPropertyOptional()
  @Expose()
  @IsString()
  externalId?: string

  @ApiProperty()
  @Expose()
  @IsString()
  state!: string

  @ApiPropertyOptional()
  @Expose()
  @IsObject()
  attachments?: object

  @ApiProperty({ enum: ApplicationTypes })
  @Expose()
  @IsEnum(ApplicationTypes)
  typeId!: string

  @ApiProperty()
  @Expose()
  @IsObject()
  answers!: object

  @ApiProperty()
  @Expose()
  @IsObject()
  externalData!: object

  @ApiPropertyOptional()
  @Expose()
  @IsString()
  name?: string

  @ApiPropertyOptional()
  @Expose()
  @IsNumber()
  progress?: number

  constructor(partial: Partial<ApplicationResponseDto>) {
    Object.assign(this, partial)
  }
}
