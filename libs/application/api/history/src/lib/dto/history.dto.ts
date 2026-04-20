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

  @ApiProperty()
  @Expose()
  @IsString()
  subLog?: string

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
        this.subLog = subjectAndActorText
      } else {
        this.subLog = undefined
      }
    } else {
      this.log = undefined
    }
  }
}
