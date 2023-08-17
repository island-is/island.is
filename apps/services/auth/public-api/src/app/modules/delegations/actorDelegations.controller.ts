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
  DelegationsIncomingService,
  DelegationType,
  MergedDelegationDTO,
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
  constructor(
    private readonly delegationsIncomingService: DelegationsIncomingService,
  ) {}

  @ActorScopes(AuthScope.actorDelegations)
  @Get()
  @Documentation({
    description: `Finds all incoming delegations for the signed in user or actor.
			Including the custom delegations as well as natural delegations from NationalRegistry and CompanyRegistry.`,
    response: { status: 200, type: [MergedDelegationDTO] },
    request: {
      query: {
        direction: {
          required: true,
          schema: {
            enum: ['incoming'],
            default: 'incoming',
          },
        },
        delegationTypes: {
          required: false,
          schema: {
            type: 'array',
            items: {
              type: 'string',
              enum: [
                DelegationType.LegalGuardian,
                DelegationType.ProcurationHolder,
                DelegationType.PersonalRepresentative,
                DelegationType.Custom,
              ],
              example: [
                [
                  DelegationType.LegalGuardian,
                  DelegationType.ProcurationHolder,
                ],
                DelegationType.Custom,
              ],
            },
          },
        },
        otherUser: {
          required: false,
          description:
            'The ID of another user. We filter out all delegations not related to that national id.',
          schema: {
            type: 'string',
          },
        },
      },
    },
  })
  @Audit<MergedDelegationDTO[]>({
    resources: (delegations) => delegations.map((d) => `${d.fromNationalId}`),
  })
  async findAll(
    @CurrentActor() actor: User,
    @Query('direction') direction: DelegationDirection.INCOMING,
    @Query('delegationTypes') delegationTypes?: Array<DelegationType>,
    @Query('otherUser') otherUser?: string,
  ): Promise<MergedDelegationDTO[]> {
    if (direction !== DelegationDirection.INCOMING) {
      throw new BadRequestException(
        `'direction' can only be set to ${DelegationDirection.INCOMING} for the /actor alias`,
      )
    }

    return this.delegationsIncomingService.findAllAvailable({
      user: actor,
      delegationTypes,
      otherUser,
    })
  }
}
