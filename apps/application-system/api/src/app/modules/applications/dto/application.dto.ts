import { IsEnum, IsNotEmpty, IsObject, IsString } from 'class-validator';
import { ApplicationState } from '../../../core/db/models/application.model'
import { SchemaType } from '@island.is/application/schema'
import { ApiProperty } from '@nestjs/swagger'

export class ApplicationDto {
  @IsNotEmpty()
  @IsString()
  @IsEnum(SchemaType)
  @ApiProperty({ enum: SchemaType })
  readonly typeId: SchemaType

  @IsNotEmpty()
  @ApiProperty()
  readonly applicant: string

  @IsNotEmpty()
  @IsEnum(ApplicationState)
  @ApiProperty({ enum: ApplicationState })
  readonly state: string

  @IsNotEmpty()
  @IsObject()
  @ApiProperty()
  readonly answers: object
}
