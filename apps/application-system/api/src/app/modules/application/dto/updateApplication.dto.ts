import { IsObject, IsString, IsOptional, IsArray } from 'class-validator'
import { ApiPropertyOptional } from '@nestjs/swagger'

export class UpdateApplicationDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly applicant?: string

  @IsOptional()
  @IsArray()
  @ApiPropertyOptional()
  readonly assignees?: string[]

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly externalId?: string

  @IsOptional()
  @IsObject()
  @ApiPropertyOptional()
  readonly answers?: object

  @IsOptional()
  @IsObject()
  @ApiPropertyOptional()
  readonly attachments?: object
}
