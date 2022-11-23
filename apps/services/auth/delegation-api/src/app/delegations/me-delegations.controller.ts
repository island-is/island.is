import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common'
import { ApiSecurity, ApiTags } from '@nestjs/swagger'

import {
  CreateDelegationDTO,
  DelegationDirection,
  DelegationDTO,
  DelegationsIncomingService,
  DelegationsOutgoingService,
  DelegationsService,
  DelegationValidity,
  PatchDelegationDTO,
} from '@island.is/auth-api-lib'
import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
  User,
} from '@island.is/auth-nest-tools'
import { AuthScope } from '@island.is/auth/scopes'
import { Audit, AuditService } from '@island.is/nest/audit'
import {
  FeatureFlag,
  FeatureFlagGuard,
  FeatureFlagService,
  Features,
} from '@island.is/nest/feature-flags'
import { Documentation } from '@island.is/nest/swagger'
import type { DocumentationParamOptions } from '@island.is/nest/swagger'
import { isDefined } from '@island.is/shared/utils'

const namespace = '@island.is/auth/delegation-api/me/delegations'

const delegationId: DocumentationParamOptions = {
  required: true,
  type: 'string',
  format: 'uuid',
  description: 'The id of the delegation.',
}

@UseGuards(IdsUserGuard, ScopesGuard, FeatureFlagGuard)
@FeatureFlag(Features.outgoingDelegationsV2)
@Scopes(AuthScope.delegations)
@ApiSecurity('ias', [AuthScope.delegations])
@ApiTags('me/delegations')
@Controller({
  path: 'me/delegations',
  version: ['1'],
})
@Audit({ namespace })
export class MeDelegationsController {
  constructor(
    private readonly delegationsService: DelegationsService,
    private readonly delegationsOutgoingService: DelegationsOutgoingService,
    private readonly delegationsIncomingService: DelegationsIncomingService,
    private readonly featureFlagService: FeatureFlagService,
    private readonly auditService: AuditService,
  ) {}

  @Get()
  @Documentation({
    response: { status: 200, type: [DelegationDTO] },
    request: {
      query: {
        domain: {
          description: 'The domain name the delegation is defined in.',
          required: false,
          type: 'string',
        },
        direction: {
          description:
            'The direction of the delegation. Defaults to outgoing if not provided.',
          required: false,
          schema: {
            enum: [DelegationDirection.OUTGOING, DelegationDirection.INCOMING],
            default: DelegationDirection.OUTGOING,
          },
        },
        validity: {
          description: 'The date validity of the delegation.',
          required: false,
          schema: {
            enum: Object.values(DelegationValidity),
            default: DelegationValidity.ALL,
          },
        },
      },
      header: {
        'X-Query-OtherUser': {
          description:
            'The identifier of the other user in the delegation. If the direction=outgoing, this is the user the delegation is to. If the direction=incoming, this is the user the delegation is from.',
          required: false,
          schema: {
            type: 'string',
            pattern: '^\\d{10}$',
          },
        },
      },
    },
  })
  @Audit<DelegationDTO[]>({
    resources: (delegations) =>
      delegations.map((delegation) => delegation?.id).filter(isDefined),
  })
  async findAll(
    @CurrentUser() user: User,
    @Query('domain') domainName: string,
    @Query('direction')
    direction: DelegationDirection = DelegationDirection.OUTGOING,
    @Query('validity') validity: DelegationValidity = DelegationValidity.ALL,
    @Headers('X-Query-OtherUser') otherUser: string,
  ): Promise<DelegationDTO[]> {
    switch (direction) {
      case DelegationDirection.INCOMING: {
        const incomingDelegationsAreEnabled = await this.featureFlagService.getValue(
          Features.incomingDelegationsV2,
          false,
          user,
        )
        if (!incomingDelegationsAreEnabled) {
          throw new BadRequestException(
            'direction=outgoing is currently the only supported value',
          )
        }

        if (user.actor) {
          throw new BadRequestException(
            'Only supported when the subject is the authenticated user.',
          )
        }

        return this.delegationsIncomingService.findAllValid(
          user,
          domainName,
          otherUser,
        )
      }
      case DelegationDirection.OUTGOING: {
        return this.delegationsOutgoingService.findAll(
          user,
          validity,
          domainName,
          otherUser,
        )
      }
      default: {
        throw new BadRequestException(
          `direction must be either 'incoming' or 'outgoing'.`,
        )
      }
    }
  }

  @Get(':delegationId')
  @Documentation({
    includeNoContentResponse: true,
    response: { status: 200, type: DelegationDTO },
    request: {
      params: {
        delegationId,
      },
    },
  })
  @Audit<DelegationDTO>({
    resources: (delegation) => delegation?.id ?? undefined,
  })
  findOne(
    @CurrentUser() user: User,
    @Param('delegationId') delegationId: string,
  ): Promise<DelegationDTO> {
    return this.delegationsService.findById(user, delegationId)
  }

  @Post()
  @Documentation({
    response: { status: 201, type: DelegationDTO },
  })
  @Audit<DelegationDTO>({
    resources: (delegation) => delegation?.id ?? undefined,
    meta: (delegation) => ({
      scopes: delegation.scopes?.map((s) => ({
        scopeName: s.scopeName,
        validTo: s.validTo,
      })),
    }),
  })
  create(
    @CurrentUser() user: User,
    @Body() createDelegation: CreateDelegationDTO,
  ): Promise<DelegationDTO> {
    return this.delegationsOutgoingService.create(user, createDelegation)
  }

  @Patch(':delegationId')
  @Documentation({
    includeNoContentResponse: true,
    response: { status: 200, type: DelegationDTO },
    request: {
      params: {
        delegationId,
      },
    },
  })
  @Audit<DelegationDTO>({
    resources: (delegation) => delegation?.id ?? undefined,
  })
  patch(
    @CurrentUser() user: User,
    @Param('delegationId') delegationId: string,
    @Body() patchDelegation: PatchDelegationDTO,
  ): Promise<DelegationDTO> {
    return this.auditService.auditPromise<DelegationDTO>(
      {
        auth: user,
        namespace,
        action: 'update',
        resources: (delegation) => delegation?.id ?? undefined,
        meta: (delegation) => ({
          updateScopes: patchDelegation.updateScopes?.map((s) => s.name),
          deleteScopes: patchDelegation.deleteScopes,
          scopes: delegation?.scopes?.map((s) => s.scopeName),
        }),
      },
      this.delegationsOutgoingService.patch(
        user,
        delegationId,
        patchDelegation,
      ),
    )
  }

  @Delete(':delegationId')
  @Documentation({
    response: { status: 204 },
    request: {
      params: {
        delegationId,
      },
    },
  })
  delete(
    @CurrentUser() user: User,
    @Param('delegationId') delegationId: string,
  ): Promise<void> {
    return this.auditService.auditPromise(
      {
        auth: user,
        namespace,
        action: 'delete',
        resources: delegationId,
        meta: (deleted) => ({
          deleted,
        }),
      },
      this.delegationsOutgoingService.delete(user, delegationId),
    )
  }
}
