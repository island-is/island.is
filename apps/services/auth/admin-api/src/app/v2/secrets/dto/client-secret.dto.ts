import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class ClientSecretDto {
  @ApiProperty()
  secretId!: string

  @ApiProperty()
  clientId!: string

  @ApiPropertyOptional()
  decryptedValue?: string
}
