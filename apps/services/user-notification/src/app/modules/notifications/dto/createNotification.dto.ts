import { IsEnum,  IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { IsNationalId } from '@island.is/nest/validators'
import { MessageTypes } from '../types'

export class CreateNotificationDto {
  @IsEnum(MessageTypes)
  @ApiProperty({ 
    enum: MessageTypes,
    example: MessageTypes.NewDocumentMessage
  })
  type!: MessageTypes

  @IsNationalId()
  @ApiProperty()
  recipient!: string


  @IsString()
  @ApiProperty()
  organization!: string

  @IsString()
  @ApiProperty()
  documentId!: string



}