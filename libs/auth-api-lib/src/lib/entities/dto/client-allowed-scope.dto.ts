import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class ClientAllowedScopeDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'clientId',
  })
  readonly clientId!: string

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: '@island.is/example',
  })
  readonly scopeName!: string
}
