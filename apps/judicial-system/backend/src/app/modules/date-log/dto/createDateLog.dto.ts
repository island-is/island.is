import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator'

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class CreateDateLogDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly dateType!: string

  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional()
  readonly caseId?: string

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly courtDate!: Date
}
