import { IsDate, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import { History } from '@island.is/application/api/history'
import { FormatMessage } from '@island.is/application/types'
import { StaticText } from 'static-text'

export class HistoryResponseDto {
  @ApiProperty()
  @Expose()
  @IsString()
  id!: string

  @ApiProperty()
  @Expose()
  @IsDate()
  date!: Date

  @ApiProperty()
  @Expose()
  @IsString()
  log?: string

  constructor(historyModel: History, formatMessage: FormatMessage) {
    this.id = historyModel.id
    this.date = historyModel.date
    console.log({ historyModel })

    if (!historyModel.log) {
      this.log = undefined
    } else if (historyModel.log.includes('{')) {
      //TODO fix this
      const log: StaticText = historyModel?.log
        ? JSON.parse(historyModel.log)
        : undefined

      this.log = log ? formatMessage(log) : undefined
    } else {
      this.log = historyModel.log
    }
  }
}
