import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import differenceWith from 'lodash/differenceWith'

import {
  compareScopesByName,
  CreateDelegationDTO,
  DEFAULT_DOMAIN,
  DelegationDirection,
  DelegationDTO,
  DelegationsService,
  DelegationType,
  DelegationValidity,
  UpdateDelegationDTO,
} from '@island.is/auth-api-lib'
import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import type { User } from '@island.is/auth-nest-tools'
import { AuthScope } from '@island.is/auth/scopes'
import { Audit, AuditService } from '@island.is/nest/audit'
import {
  FeatureFlag,
  FeatureFlagGuard,
  Features,
} from '@island.is/nest/feature-flags'
import { Documentation } from '@island.is/nest/swagger'
import { isDefined } from '@island.is/shared/utils'

const namespace = '@island.is/auth-public-api/delegations'

@UseGuards(IdsUserGuard, ScopesGuard, FeatureFlagGuard)
@ApiTags('me-delegations')
@Controller('v1/me/delegations')
@Audit({ namespace })
export class MeDelegationsController {
  constructor(
    private readonly delegationsService: DelegationsService,
    private readonly auditService: AuditService,
  ) {}

  @Scopes(AuthScope.delegations)
  @FeatureFlag(Features.customDelegations)
  @Get()
  @Documentation({
    response: { status: 200, type: [DelegationDTO] },
    request: {
      query: {
        direction: {
          required: true,
          schema: {
            enum: [DelegationDirection.OUTGOING],
            default: DelegationDirection.OUTGOING,
          },
        },
        validity: {
          required: false,
          schema: {
            enum: Object.values(DelegationValidity),
            default: DelegationValidity.ALL,
          },
        },
        otherUser: {
          description:
            'NationalId of an other user to find if the current user has given that user a delegation.',
          required: false,
          type: 'string',
        },
      },
    },
  })
  @Audit<DelegationDTO[]>({
    resources: (delegations) =>
      delegations.map((delegation) => delegation.id).filter(isDefined),
  })
  async findAll(
    @CurrentUser() user: User,
    @Query('direction') direction: DelegationDirection,
    @Query('validity') validity: DelegationValidity = DelegationValidity.ALL,
    @Query('otherUser') otherUser?: string,
  ): Promise<DelegationDTO[]> {
    if (direction !== DelegationDirection.OUTGOING) {
      throw new BadRequestException(
        'direction=outgoing is currently the only supported value',
      )
    }

    return (
      await this.delegationsService.findAllOutgoing(user, validity, otherUser)
    ).filter(
      (d) => d.type != DelegationType.Custom || d.domainName == DEFAULT_DOMAIN,
    )
  }

  @Scopes(AuthScope.delegations)
  @FeatureFlag(Features.customDelegations)
  @Get(':delegationId')
  @Documentation({
    description: `Finds a single delegation by ID where the authenticated user is either giving or receiving.
       Does not include delegations from NationalRegistry or CompanyRegistry.`,
    response: { status: 200, type: DelegationDTO },
    request: {
      params: {
        delegationId: {
          type: 'string',
          format: 'uuid',
          description: 'Delegation ID.',
        },
      },
    },
  })
  @Audit<DelegationDTO>({
    resources: (delegation) => delegation?.id ?? undefined,
  })
  async findOne(
    @CurrentUser() user: User,
    @Param('delegationId') delegationId: string,
  ): Promise<DelegationDTO | null> {
    const delegation = await this.delegationsService.findById(
      user,
      delegationId,
    )

    if (
      !delegation ||
      (delegation.type == DelegationType.Custom &&
        delegation.domainName != DEFAULT_DOMAIN)
    ) {
      throw new NotFoundException()
    }

    return delegation
  }

  @Scopes(AuthScope.delegations)
  @FeatureFlag(Features.customDelegations)
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
  async create(
    @CurrentUser() user: User,
    @Body() delegation: CreateDelegationDTO,
  ): Promise<DelegationDTO | null> {
    return this.delegationsService.create(user, delegation)
  }

  @Scopes(AuthScope.delegations)
  @FeatureFlag(Features.customDelegations)
  @Put(':delegationId')
  @Documentation({
    response: { status: 200, type: DelegationDTO },
  })
  async update(
    @CurrentUser() user: User,
    @Body() delegation: UpdateDelegationDTO,
    @Param('delegationId') delegationId: string,
  ): Promise<DelegationDTO | null> {
    const currentDelegation = await this.delegationsService.findById(
      user,
      delegationId,
    )
    if (!currentDelegation) {
      throw new NotFoundException()
    }
    const { scopes: oldScopes = [] } = currentDelegation

    return this.auditService.auditPromise<DelegationDTO | null>(
      {
        auth: user,
        namespace,
        action: 'update',
        resources: (delegation) => delegation?.id ?? undefined,
        meta: (delegation) => {
          const newScopes = delegation?.scopes || []
          return {
            deleted: differenceWith(
              oldScopes,
              newScopes,
              compareScopesByName,
            ).map((s) => s.scopeName),
            added: differenceWith(
              newScopes,
              oldScopes,
              compareScopesByName,
            ).map((s) => ({
              scopeName: s.scopeName,
              validTo: s.validTo,
            })),
          }
        },
      },
      this.delegationsService.update(user, delegation, delegationId),
    )
  }

  @Scopes(AuthScope.delegations)
  @FeatureFlag(Features.customDelegations)
  @Delete(':delegationId')
  @Documentation({
    response: { status: 204 },
  })
  async delete(
    @CurrentUser() user: User,
    @Param('delegationId') delegationId: string,
  ): Promise<void> {
    await this.auditService.auditPromise(
      {
        auth: user,
        namespace,
        action: 'deleteFrom',
        resources: delegationId,
      },
      this.delegationsService.delete(user, delegationId),
    )
  }
}
