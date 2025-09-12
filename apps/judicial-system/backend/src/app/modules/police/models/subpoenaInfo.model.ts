import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { ServiceStatus } from '@island.is/judicial-system/types'

interface SubpoenaUpdate
  extends Pick<
    SubpoenaInfo,
    | 'serviceStatus'
    | 'comment'
    | 'servedBy'
    | 'defenderNationalId'
    | 'serviceDate'
  > {}

const subpoenaUpdateKeys: Array<keyof SubpoenaUpdate> = [
  'serviceStatus',
  'comment',
  'servedBy',
  'defenderNationalId',
  'serviceDate',
]

export class SubpoenaInfo {
  private isNewValueSetAndDifferent = (
    newValue: unknown,
    oldValue: unknown,
  ): boolean => {
    if (newValue === undefined || newValue === null) {
      return false
    }
    if (newValue instanceof Date && oldValue instanceof Date) {
      return newValue.getTime() !== oldValue.getTime()
    }
    return newValue !== oldValue
  }

  isSubpoenaInfoChanged(oldSubpoenaInfo: SubpoenaUpdate) {
    return subpoenaUpdateKeys.some((key) =>
      this.isNewValueSetAndDifferent(this[key], oldSubpoenaInfo[key]),
    )
  }

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
