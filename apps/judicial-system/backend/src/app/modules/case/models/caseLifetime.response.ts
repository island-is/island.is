import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class CaseLifetimeResponse {
  @ApiProperty({ type: String })
  caseId!: string

  @ApiPropertyOptional({ type: Date })
  archiveNotBefore?: Date

  @ApiProperty({ type: Boolean })
  caseRestored!: boolean
}
