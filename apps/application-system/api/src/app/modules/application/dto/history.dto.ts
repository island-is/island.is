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
  entry?: string

  constructor(historyModel: History, formatMessage: FormatMessage) {
    this.id = historyModel.id
    this.date = historyModel.date
    console.log({ historyModel })

    if (!historyModel.contentful_id) {
      this.entry = undefined
    } else if (historyModel.contentful_id.includes('{')) {
      //TODO fix this
      const entry: StaticText = historyModel?.contentful_id
        ? JSON.parse(historyModel.contentful_id)
        : undefined

      this.entry = entry ? formatMessage(entry) : undefined
    } else {
      this.entry = historyModel.contentful_id
    }
  }
}
