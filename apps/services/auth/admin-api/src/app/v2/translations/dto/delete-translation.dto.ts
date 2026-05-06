import { IsOptional, IsString } from 'class-validator'
import { ApiPropertyOptional } from '@nestjs/swagger'

export class DeleteTranslationDto {
  @IsOptional()
  @IsString({ each: true })
  @ApiPropertyOptional({
    type: [String],
    example: ['Development', 'Staging'],
  })
  readonly environments?: string[]
}
