import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsNotEmpty, IsString } from 'class-validator'

import { ClientType } from '../../../types'
import { AdminPatchClientDto } from './admin-patch-client.dto'

type CreateClientType = Extract<
  ClientType,
  ClientType.machine | ClientType.native | ClientType.web
>

const CreateClientType = {
  [ClientType.machine]: ClientType.machine,
  [ClientType.native]: ClientType.native,
  [ClientType.web]: ClientType.web,
}

export class AdminCreateClientDto extends AdminPatchClientDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: '@domain.is/client-id',
  })
  readonly clientId!: string

  @IsNotEmpty()
  @IsEnum(CreateClientType)
  @ApiProperty({
    example: 'spa',
    enum: CreateClientType,
    enumName: 'CreateClientType',
  })
  readonly clientType!: CreateClientType

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'Client name',
  })
  readonly clientName!: string
}
