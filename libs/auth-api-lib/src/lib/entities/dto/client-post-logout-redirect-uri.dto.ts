import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class ClientPostLogoutRedirectUriDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'clientId',
  })
  readonly clientId!: string

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'https://localhost:4200',
  })
  readonly redirectUri!: string
}
