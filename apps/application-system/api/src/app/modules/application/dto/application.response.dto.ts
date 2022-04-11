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
} from 'class-validator'

class ActionCardTag {
  @ApiPropertyOptional()
  @Expose()
  @IsString()
  label?: string

  @ApiPropertyOptional()
  @Expose()
  @IsString()
  variant?: string
}

class ActionCardMetaData {
  @ApiPropertyOptional()
  @Expose()
  @IsString()
  title?: string

  @ApiPropertyOptional()
  @Expose()
  @IsString()
  description?: string

  @ApiPropertyOptional()
  @Expose()
  @IsObject()
  tag?: ActionCardTag

  @ApiPropertyOptional()
  @Expose()
  @IsObject()
  delete?: boolean
}

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
  @IsObject()
  actionCard?: ActionCardMetaData

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
  @IsString()
  institution?: string

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
