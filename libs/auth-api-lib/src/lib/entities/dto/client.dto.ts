import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty,IsString } from 'class-validator'

import { ClientBaseDTO } from './base/client-base.dto'

export class ClientDTO extends ClientBaseDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'clientId_example',
  })
  readonly clientId!: string
}
