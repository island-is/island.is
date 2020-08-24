import { IsString, IsOptional } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class UpdateCaseDto {
  @IsString()
  @ApiProperty()
  readonly id: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly description: string
}
