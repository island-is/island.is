import { IsEnum, IsNotEmpty, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { IsNationalId } from '@island.is/nest/validators'
import { MessageTypes } from '../types'

// export class TypeValidator {
//   @IsEnum(MessageTypes)
//   @ApiProperty({ enum: MessageTypes })
//   type!: MessageTypes
// }

// data any ......
// limits ios and android maximum
// title length
// body length - emoji support ?
// click_action

export class MessageData {
  @IsString()
  @ApiProperty({ example: 'value' })
  key?: string

  @IsString()
  @ApiProperty({ example: 'value' })
  title?: string

  @IsString()
  @ApiProperty({ example: 'value' })
  url?: string
}

export class NewDocumentMessage {
  // @ApiProperty({ enum: [MessageTypes.NewDocumentMessage] })
  // type!: MessageTypes.NewDocumentMessage

  @IsString()
  @ApiProperty({ example: 'newDocumentMessage' })
  type!: string

  @IsNationalId()
  @ApiProperty({ example: '0000000000' })
  recipient!: string

  @IsString()
  @ApiProperty({ example: 'DevHouse' }) // TODO enum ? move to data? hook to template?
  organization?: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'aaaa-bbbb-cccc-dddd' })
  documentId?: string

  @ApiProperty()
  data?: MessageData
}

export type Message = NewDocumentMessage

// export const ValidatorTypeMap = {
//   [MessageTypes.NewDocumentMessage]: NewDocumentMessage,
// }
