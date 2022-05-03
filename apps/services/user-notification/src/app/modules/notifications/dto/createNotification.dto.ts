import { IsEnum, IsNotEmpty, IsString, IsUrl } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { IsNationalId } from '@island.is/nest/validators'
import { MessageTypes } from '../types'

export class TypeValidator {
  @IsEnum(MessageTypes)
  @ApiProperty({ enum: MessageTypes })
  type!: MessageTypes
}

export class Message {
  type!: MessageTypes

  @IsString()
  @ApiProperty()
  organization!: string

  @IsNationalId()
  @ApiProperty()
  recipient!: string
}

export class NewDocumentMessage extends Message {
  @ApiProperty({ enum: [MessageTypes.NewDocumentMessage] })
  type!: MessageTypes.NewDocumentMessage

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  documentId!: string
}

export class OneshotMessage extends Message {
  @ApiProperty({ enum: [MessageTypes.OneshotMessage] })
  type!: MessageTypes.OneshotMessage

  @IsUrl()
  @IsNotEmpty()
  @ApiProperty()
  url!: string
}

export const ValidatorTypeMap = {
  [MessageTypes.NewDocumentMessage]: NewDocumentMessage,
  [MessageTypes.OneshotMessage]: OneshotMessage,
}

export interface MagicBellCreateResponse {
  notification: {
    id: string
    title: string
    content?: string
    action_url?: string
    category: string
    topic?: string
    custom_attributes?: string
    sent_at: number
  }
}
