import { IsNotEmpty, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class ClientAllowedCorsOriginDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'https://localhost',
  })
  origin!: string

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'clientId',
  })
  clientId!: string
}
