import { IsDate, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import { FormatMessage } from '@island.is/application/types'
import { StaticText } from '@island.is/shared/types'

export class HistoryResponseDto {
  @ApiProperty()
  @Expose()
  @IsDate()
  date!: Date

  @ApiProperty()
  @Expose()
  @IsString()
  log?: string

  constructor(timeStamp: Date, log: StaticText, formatMessage: FormatMessage) {
    this.date = timeStamp
    this.log = log ? formatMessage(log) : undefined
  }
}
