import { ApiProperty } from '@nestjs/swagger'

export class ClientSecretDto {
  @ApiProperty()
  id!: string

  @ApiProperty()
  clientId!: string

  @ApiProperty()
  decryptedValue?: string
}
