import {
  BadRequestException,
  Controller,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import {
  DelegationDirection,
  DelegationDTO,
  DelegationsService,
} from '@island.is/auth-api-lib'
import {
  ActorScopes,
  CurrentActor,
  IdsUserGuard,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import { AuthScope } from '@island.is/auth/scopes'
import { Audit } from '@island.is/nest/audit'
import { Documentation } from '@island.is/nest/swagger'

import type { User } from '@island.is/auth-nest-tools'
const namespace = '@island.is/auth-public-api/actor/delegations'

@UseGuards(IdsUserGuard, ScopesGuard)
@ApiTags('actor-delegations')
@Controller('v1/actor/delegations')
@Audit({ namespace })
export class ActorDelegationsController {
  constructor(private readonly delegationsService: DelegationsService) {}

  @ActorScopes(AuthScope.actorDelegations)
  @Get()
  @Documentation({
    description: `Finds all incoming delegations for the signed in user or actor.
			Including the custom delegations as well as natural delegations from NationalRegistry and CompanyRegistry.`,
    response: { status: 200, type: [DelegationDTO] },
    request: {
      query: {
        direction: {
          required: true,
          schema: {
            enum: ['incoming'],
            default: 'incoming',
          },
        },
      },
    },
  })
  @Audit<DelegationDTO[]>({
    resources: (delegations) =>
      delegations.map((delegation) => delegation.id ?? ''),
  })
  async findAll(
    @CurrentActor() actor: User,
    @Query('direction') direction: DelegationDirection.INCOMING,
  ): Promise<DelegationDTO[]> {
    if (direction != DelegationDirection.INCOMING) {
      throw new BadRequestException(
        `'direction' can only be set to ${DelegationDirection.INCOMING} for the /actor alias`,
      )
    }

    return this.delegationsService.findAllIncoming(actor)
  }
}
