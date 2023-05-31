import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'

export class UpdateApplicationExtradataDto {
  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Extra data that should follow application',
    example: 'TBD',
  })
  @ApiPropertyOptional()
  extraData?: string
}
