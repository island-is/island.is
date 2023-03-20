import { ApiProperty } from '@nestjs/swagger'
import { AdminClientType } from './admin-client-type.enum'

export class AdminClientDto {
  @ApiProperty()
  clientId!: string

  @ApiProperty({
    example: 'spa',
    enum: AdminClientType,
  })
  clientType!: string
}
