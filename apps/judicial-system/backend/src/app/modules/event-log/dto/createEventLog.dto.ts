import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator'

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class CreateEventLogDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly eventType!: string

  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional()
  readonly caseId?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly nationalId?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly userRole?: string
}
