import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class PoliceCaseInfo {
  @ApiProperty({ type: String })
  policeCaseNumber!: string

  @ApiPropertyOptional({ type: String })
  place?: string

  @ApiPropertyOptional({ type: Date })
  date?: Date

  @ApiPropertyOptional({ type: String })
  licencePlate?: string

  @ApiPropertyOptional({ type: String, isArray: true })
  subtypes?: string[]
}
