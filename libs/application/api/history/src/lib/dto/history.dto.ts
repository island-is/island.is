import { IsDate, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import { FormatMessage } from '@island.is/application/types'
import { StaticText } from '@island.is/shared/types'
import isObject from 'lodash/isObject'

export class HistoryResponseDto {
  @ApiProperty()
  @Expose()
  @IsDate()
  date!: Date

  @ApiProperty()
  @Expose()
  @IsString()
  log?: string

  constructor(
    timeStamp: Date,
    log: StaticText,
    formatMessage: FormatMessage,
    values?: Record<string, any>,
  ) {
    this.date = timeStamp
    if (log) {
      if (isObject(values)) {
        this.log = formatMessage(log, values)
      } else {
        this.log = log ? formatMessage(log) : undefined
      }
    }
  }
}
