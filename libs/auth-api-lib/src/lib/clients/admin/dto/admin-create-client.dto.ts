import { ApiProperty, OmitType } from '@nestjs/swagger'
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator'

import { AuthDelegationType } from '@island.is/shared/types'

import { ClientSso, ClientType } from '../../../types'
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

export class AdminCreateClientDto extends OmitType(AdminPatchClientDto, [
  'removedDelegationTypes',
  'addedDelegationTypes',
]) {
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

  @IsArray()
  @IsOptional()
  @IsEnum(AuthDelegationType, { each: true })
  @ApiProperty({
    example: ['Custom'],
    type: [String],
  })
  supportedDelegationTypes?: AuthDelegationType[]

  @IsNotEmpty()
  @IsEnum(ClientSso)
  @ApiProperty({
    example: 'enabled',
    enum: ClientSso,
    enumName: 'ClientSso',
  })
  readonly sso!: ClientSso
}
