import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class PoliceCaseInfo {
  @ApiProperty()
  policeCaseNumber!: string

  @ApiPropertyOptional()
  place?: string

  @ApiPropertyOptional()
  date?: Date
}
