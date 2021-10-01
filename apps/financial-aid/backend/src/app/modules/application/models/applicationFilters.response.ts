import { ApiProperty } from '@nestjs/swagger'

import { ApplicationFilters } from '@island.is/financial-aid/shared/lib'
import { Model } from 'sequelize-typescript'

export class ApplicationFilterModel {
  @ApiProperty()
  New: number

  @ApiProperty()
  InProgress: number

  @ApiProperty()
  DataNeeded: number

  @ApiProperty()
  Rejected: number

  @ApiProperty()
  Approved: number
}
