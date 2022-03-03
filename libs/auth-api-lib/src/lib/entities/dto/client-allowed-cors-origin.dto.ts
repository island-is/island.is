import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

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
