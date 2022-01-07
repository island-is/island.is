import {
  BadRequestException,
  Controller,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'

import {
  ActorScopes,
  AuthMiddlewareOptions,
  CurrentActor,
  IdsUserGuard,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import type { User } from '@island.is/auth-nest-tools'
import { Audit } from '@island.is/nest/audit'
import {
  DelegationDirection,
  DelegationDTO,
  DelegationsService,
} from '@island.is/auth-api-lib'
import { AuthScope } from '@island.is/auth/scopes'
import { HttpProblemResponse } from '@island.is/nest/problem'

import { environment } from '../../../environments'

const namespace = '@island.is/auth-public-api/actor/delegations'

@UseGuards(IdsUserGuard, ScopesGuard)
@ApiTags('actor-delegations')
@Controller('v1/actor/delegations')
@Audit({ namespace })
export class ActorDelegationsController {
  constructor(private readonly delegationsService: DelegationsService) {}

  @ActorScopes(AuthScope.actorDelegations)
  @Get()
  @ApiOkResponse({ type: [DelegationDTO] })
  @ApiBadRequestResponse({ type: HttpProblemResponse })
  @ApiForbiddenResponse({ type: HttpProblemResponse })
  @ApiUnauthorizedResponse({ type: HttpProblemResponse })
  @ApiInternalServerErrorResponse()
  @ApiOperation({
    description: `Finds all incoming delegations for the signed in user or actor.
			Including the custom delegations as well as natural delegations from NationalRegistry and CompanyRegistry.`,
  })
  @ApiQuery({
    name: 'direction',
    required: true,
    schema: {
      enum: ['incoming'],
      default: 'incoming',
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

    return this.delegationsService.findAllIncoming(
      actor,
      environment.nationalRegistry
        .authMiddlewareOptions as AuthMiddlewareOptions,
    )
  }
}
