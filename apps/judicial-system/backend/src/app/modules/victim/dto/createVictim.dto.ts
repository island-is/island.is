import { ApiPropertyOptional } from '@nestjs/swagger'

export class CreateVictimDto {
  @ApiPropertyOptional()
  name?: string

  @ApiPropertyOptional()
  nationalId?: string
}
