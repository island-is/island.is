import { IsOptional, IsString } from 'class-validator'
import { ApiPropertyOptional } from '@nestjs/swagger'

export class UpdateTranslationDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    example: 'This is the display name in english',
  })
  readonly value?: string

  @IsOptional()
  @IsString({ each: true })
  @ApiPropertyOptional({
    type: [String],
    example: ['Development', 'Staging'],
  })
  readonly environments?: string[]
}
