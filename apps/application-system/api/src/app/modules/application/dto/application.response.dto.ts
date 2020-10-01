import { ApplicationTypes } from '@island.is/application/core'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import { IsDate, IsEnum, IsNumber, IsObject, IsString } from 'class-validator'
import { MessageDescriptor } from 'react-intl'

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
  @IsObject()
  name?: MessageDescriptor

  @ApiPropertyOptional()
  @Expose()
  @IsNumber()
  progress?: number

  constructor(partial: Partial<ApplicationResponseDto>) {
    Object.assign(this, partial)
  }
}
