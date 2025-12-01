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

  constructor(
    timeStamp: Date,
    message: StaticText,
    formatMessage: FormatMessage,
    subjectAndActorText?: string,
  ) {
    this.date = timeStamp
    if (message) {
      this.log = formatMessage(message)
      if (subjectAndActorText) {
        this.log += subjectAndActorText
      }
    } else {
      this.log = undefined
    }
  }
}
