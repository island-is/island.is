import { IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { IsPersonNationalId } from '@island.is/nest/core'

export class CreateNotificationDto {
  @IsString()
  @ApiProperty({ example: 'newDocumentMessage' })
  type!: string

  @IsPersonNationalId()
  @ApiProperty({ example: '1234567890' })
  recipient!: string

  @IsString()
  @ApiProperty()
  organization!: string

  @IsString()
  @ApiProperty()
  documentId!: string
}
