import { ApiProperty } from '@nestjs/swagger'

export class ClientSecretDto {
  @ApiProperty()
  secretId!: string

  @ApiProperty()
  clientId!: string

  @ApiProperty()
  decryptedValue?: string
}
