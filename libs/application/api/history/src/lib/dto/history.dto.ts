import { IsDate, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import { MessageDescriptor } from '@formatjs/intl'
import { FormatMessage } from '@island.is/application/types'
import { StaticText, StaticTextObject } from '@island.is/shared/types'

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
      if (typeof message === 'object' && message !== null && message.values) {
        const { values, ...descriptor } = message as StaticTextObject
        this.log = formatMessage(descriptor as MessageDescriptor, values)
      } else {
        this.log = formatMessage(message as MessageDescriptor | string)
      }
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
