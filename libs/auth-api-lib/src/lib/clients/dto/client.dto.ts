import { IsString, IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { ClientBaseDTO } from '../../entities/dto/base/client-base.dto'

export class ClientDTO extends ClientBaseDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'clientId_example',
  })
  readonly clientId!: string
}
