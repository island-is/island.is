import {
  ApplicationStatus,
  ApplicationTypes,
} from '@island.is/application/core'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import {
  IsDate,
  IsEnum,
  IsNumber,
  IsObject,
  IsString,
  IsArray,
  IsBoolean,
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
  @IsArray()
  assignees!: string[]

  @ApiProperty()
  @Expose()
  @IsString()
  state!: string

  @ApiPropertyOptional()
  @Expose()
  @IsString()
  stateTitle?: string

  @ApiPropertyOptional()
  @Expose()
  @IsString()
  stateDescription?: string

  @ApiPropertyOptional()
  @Expose()
  @IsObject()
  attachments?: object

  @ApiProperty({ enum: ApplicationTypes })
  @Expose()
  @IsEnum(ApplicationTypes)
  typeId!: ApplicationTypes

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

  @ApiProperty({ enum: ApplicationStatus })
  @Expose()
  @IsEnum(ApplicationStatus)
  status!: ApplicationStatus

  constructor(partial: Partial<ApplicationResponseDto>) {
    Object.assign(this, partial)
  }
}
