import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { IsNationalId } from '@island.is/nest/validators'
import { MessageTypes } from '../types'

export class CreateNotificationDto {
  @IsEnum(MessageTypes)
  @ApiProperty({ example: MessageTypes.NewDocumentMessage })
  type!: MessageTypes

  @IsString()
  @ApiProperty()
  organization!: string

  @IsNationalId()
  @ApiProperty()
  recipient!: string

  @IsString()
  @ApiProperty()
  @IsOptional()
  documentId?: string
}
