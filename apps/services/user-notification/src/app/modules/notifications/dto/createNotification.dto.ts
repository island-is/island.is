import { IsEnum, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { IsNationalId } from '@island.is/nest/validators'
import { MessageTypes } from '../types'

export class CreateNotificationDto {
  @IsEnum(MessageTypes)
  @ApiProperty({
    enum: MessageTypes,
    example: 'newDocumentMessage',
  })
  type!: MessageTypes

  @IsNationalId()
  @ApiProperty({ example: '1234567890' })
  recipient!: string

  @IsString()
  @ApiProperty()
  organization!: string

  @IsString()
  @ApiProperty()
  documentId!: string
}
