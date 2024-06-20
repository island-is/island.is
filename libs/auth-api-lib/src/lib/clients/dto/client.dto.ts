import { IsString, IsNotEmpty } from 'class-validator'
import { ApiProperty, OmitType } from '@nestjs/swagger'
import { ClientBaseDTO } from './base/client-base.dto'

export class ClientDTO extends OmitType(ClientBaseDTO, [
  'supportedDelegationTypes',
  'supportsCustomDelegation',
  'supportsProcuringHolders',
  'supportsLegalGuardians',
  'supportsPersonalRepresentatives',
  'promptDelegations',
]) {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'clientId_example',
  })
  readonly clientId!: string
}
