import { IsString, IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { ClientBaseDTO } from './base/client-base-dto'

export class ClientDTO extends ClientBaseDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'set_clientId',
  })
  readonly clientId: string
}
