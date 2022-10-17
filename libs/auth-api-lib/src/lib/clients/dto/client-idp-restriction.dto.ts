import { IsNotEmpty, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class ClientIdpRestrictionDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'Idp restriction name',
  })
  readonly name!: string

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'client id',
  })
  readonly clientId!: string
}
