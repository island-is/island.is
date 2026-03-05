import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class PoliceDefendant {
  @ApiProperty({ type: String })
  nationalId!: string

  @ApiPropertyOptional({ type: String })
  name?: string

  @ApiPropertyOptional({ type: String })
  gender?: string

  @ApiPropertyOptional({ type: String })
  address?: string

  @ApiPropertyOptional({ type: String })
  dateOfBirth?: string

  @ApiPropertyOptional({ type: String })
  citizenship?: string
}
