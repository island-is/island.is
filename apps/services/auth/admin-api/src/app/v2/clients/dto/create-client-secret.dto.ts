import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class CreateClientSecretDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'somesecretvalue',
  })
  decryptedValue!: string
}
