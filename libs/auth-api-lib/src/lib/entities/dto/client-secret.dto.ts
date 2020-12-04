import { IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class ClientSecretDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'clientId',
  })
  readonly clientId!: string

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'The secret key',
  })
  readonly value!: string

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: 'The secret key',
  })
  description?: string

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'Type of secret',
  })
  type!: string
}
