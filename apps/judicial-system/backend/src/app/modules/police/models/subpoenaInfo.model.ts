import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { ServiceStatus } from '@island.is/judicial-system/types'

export class SubpoenaInfo {
  @ApiProperty({ type: ServiceStatus })
  serviceStatus?: ServiceStatus

  @ApiPropertyOptional({ type: String })
  comment?: string

  @ApiPropertyOptional({ type: String })
  servedBy?: string

  @ApiPropertyOptional({ type: String })
  defenderNationalId?: string

  @ApiPropertyOptional({ type: Date })
  serviceDate?: Date
}
