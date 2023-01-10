import { IsEnum,  IsString, ValidateIf } from 'class-validator'
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
  @ValidateIf(o => o.type === MessageTypes.NewDocumentMessage)
  organization!: string

  @IsString()
  @ApiProperty()
  @ValidateIf(o => o.type === MessageTypes.NewDocumentMessage)
  documentId!: string

  // @IsArray()
  // @ApiProperty({example:["arg1","arg2"]})
  // @IsOptional()
  // locArgs?: [string]

}