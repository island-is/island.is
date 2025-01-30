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

const CreateClientSsoType = {
  [ClientSso.Client]: ClientSso.Client,
  [ClientSso.Disabled]: ClientSso.Disabled,
  [ClientSso.Enabled]: ClientSso.Enabled,
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
  @IsEnum(CreateClientSsoType)
  @ApiProperty({
    example: 'spa',
    enum: CreateClientSsoType,
    enumName: 'CreateClientSsoType',
  })
  readonly sso!: ClientSso

}
