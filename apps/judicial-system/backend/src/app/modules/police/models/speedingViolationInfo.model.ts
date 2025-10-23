import { ApiPropertyOptional } from '@nestjs/swagger'

export class SpeedingViolationInfo {
  @ApiPropertyOptional({ type: String })
  nationalId?: string

  @ApiPropertyOptional({ type: String })
  licencePlate?: string

  @ApiPropertyOptional({ type: Number })
  recordedSpeed?: number

  @ApiPropertyOptional({ type: Number })
  speedLimit?: number

  @ApiPropertyOptional({ type: Date })
  date?: Date
}
