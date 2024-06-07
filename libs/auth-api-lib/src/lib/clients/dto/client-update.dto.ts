import { ClientBaseDTO } from './base/client-base.dto'
import { OmitType } from '@nestjs/swagger'

export class ClientUpdateDTO extends OmitType(ClientBaseDTO, [
  'supportedDelegationTypes',
  'supportsCustomDelegation',
  'supportsProcuringHolders',
  'supportsLegalGuardians',
  'supportsPersonalRepresentatives',
  'promptDelegations',
]) {}
