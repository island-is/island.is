import { IsEnum, IsNotEmpty, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { IsNationalId } from '@island.is/nest/validators'
import { MessageTypes } from '../types'

export class TypeValidator {
  @IsEnum(MessageTypes)
  @ApiProperty({ enum: MessageTypes })
  type!: MessageTypes
}

export class NewDocumentMessage {
  @ApiProperty({ enum: [MessageTypes.NewDocumentMessage] })
  type!: MessageTypes.NewDocumentMessage

  @IsString()
  @ApiProperty()
  organization!: string

  @IsNationalId()
  @ApiProperty()
  recipient!: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  documentId!: string
}

export type Message = NewDocumentMessage

export const ValidatorTypeMap = {
  [MessageTypes.NewDocumentMessage]: NewDocumentMessage,
}
