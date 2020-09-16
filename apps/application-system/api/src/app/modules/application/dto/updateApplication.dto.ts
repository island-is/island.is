import { IsObject, IsString, IsOptional } from 'class-validator'
import { ApiPropertyOptional } from '@nestjs/swagger'

export class UpdateApplicationDto {
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
  @IsObject()
  @ApiPropertyOptional()
  readonly answers?: object

  @IsOptional()
  @IsObject()
  @ApiPropertyOptional()
  readonly attachments?: object
}
