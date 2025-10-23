import { ApiPropertyOptional } from '@nestjs/swagger'

export class SpeedingViolationInfo {
  @ApiPropertyOptional({ type: String })
  nationalId?: string

  @ApiPropertyOptional({ type: String })
  licencePlate?: string

  @ApiPropertyOptional({ type: String })
  recordedSpeed?: number

  @ApiPropertyOptional({ type: String })
  speedLimit?: number

  @ApiPropertyOptional({ type: String })
  date?: Date
}
