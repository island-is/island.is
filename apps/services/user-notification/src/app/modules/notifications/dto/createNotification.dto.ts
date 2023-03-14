import { IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { IsNationalId } from '@island.is/nest/core'

export class CreateNotificationDto {
  @IsString()
  @ApiProperty({ example: 'newDocumentMessage' })
  type!: string

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
