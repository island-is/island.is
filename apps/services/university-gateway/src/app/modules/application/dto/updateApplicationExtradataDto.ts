import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'

export class UpdateApplicationExtradataDto {
  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Column description for extra data',
    example: 'Example value for extra data',
  })
  @ApiPropertyOptional()
  extraData?: string
}
