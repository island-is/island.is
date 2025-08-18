import { ApiProperty } from '@nestjs/swagger'

import { ServiceStatus } from '@island.is/judicial-system/types'

export class ServiceStatusStatistics {
  @ApiProperty({ enum: ServiceStatus })
  serviceStatus!: ServiceStatus | null

  @ApiProperty({ type: Number })
  count!: number

  @ApiProperty({
    type: Number,
    description: 'Average time in milliseconds between created and serviceDate',
  })
  averageServiceTimeMs!: number

  @ApiProperty({
    type: Number,
    description: 'Average time in days between created and serviceDate',
  })
  averageServiceTimeDays!: number
}

export class SubpoenaStatistics {
  @ApiProperty({ type: Date })
  minDate!: Date

  @ApiProperty({ type: Number })
  count!: number

  @ApiProperty({ type: ServiceStatusStatistics, isArray: true })
  serviceStatusStatistics!: ServiceStatusStatistics[]
}
