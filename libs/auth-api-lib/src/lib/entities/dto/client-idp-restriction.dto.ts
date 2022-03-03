import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

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
