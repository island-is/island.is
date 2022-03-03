import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class ClientGrantTypeDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'clientId',
  })
  readonly clientId!: string

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'authorization_code',
  })
  readonly grantType!: string
}
