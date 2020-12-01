import { IsNotEmpty, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class ClientPostLogoutRedirectUriDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'clientId',
  })
  clientId: string

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'https://localhost:4200',
  })
  redirectUri: string
}
