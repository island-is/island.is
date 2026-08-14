import { IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class CopyFormDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  organizationNationalId!: string

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  organizationId?: string
}
