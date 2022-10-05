import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import {
  CreateDelegationDTO,
  DelegationDirection,
  DelegationDTO,
  DelegationValidity,
  OutgoingDelegationsService,
  PatchDelegationDTO,
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
import { FeatureFlag, FeatureFlagGuard } from '@island.is/nest/feature-flags'
import { Documentation } from '@island.is/nest/swagger'

const namespace = '@island.is/auth-api/v2/me/delegations'

@UseGuards(IdsUserGuard, ScopesGuard, FeatureFlagGuard)
//@FeatureFlag()
@ApiTags('meDelegations')
@Controller({
  path: 'me/delegations',
  version: ['2'],
})
@Audit({ namespace })
export class MeDelegationsController {
  constructor(
    private readonly delegationsService: OutgoingDelegationsService,
    private readonly auditService: AuditService,
  ) {}

  @Get()
  @Scopes(AuthScope.readDelegations)
  @Documentation({
    response: { status: 200, type: [DelegationDTO] },
    request: {
      query: {
        domain: {
          description: 'The domain identifier the delegation is defined in.',
          required: false,
          type: 'string',
        },
        direction: {
          description: 'The direction of the delegation.',
          required: true,
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
    },
  })
  @Audit<DelegationDTO[]>({
    resources: (delegations) =>
      // TODO: change empty string to undefined when my prev PR is merged.
      delegations.map((delegation) => delegation?.id ?? ''),
  })
  async findAll(
    @CurrentUser() user: User,
    @Query('domain') domain: string,
    @Query('direction') direction: DelegationDirection,
    @Query('validity') validity: DelegationValidity = DelegationValidity.ALL,
    @Query('otherUser') otherUser: string,
  ): Promise<DelegationDTO[]> {
    if (direction !== DelegationDirection.OUTGOING) {
      throw new BadRequestException(
        'direction=outgoing is currently the only supported value',
      )
    }
    return this.delegationsService.findAll(user, validity, domain, otherUser)
  }

  @Get(':delegationId')
  @Scopes(AuthScope.readDelegations)
  @Documentation({
    response: { status: 200, type: DelegationDTO },
    request: {
      params: {
        id: {
          required: true,
          type: 'string',
          description: 'The id of the delegation.',
        },
      },
    },
  })
  @Audit<DelegationDTO>({
    resources: (delegation) => delegation?.id ?? '',
  })
  async findOne(
    @CurrentUser() user: User,
    @Param('delegationId') delegationId: string,
  ): Promise<DelegationDTO | null> {
    return this.delegationsService.findById(user, delegationId)
  }

  @Post()
  @Scopes(AuthScope.writeDelegations)
  @Documentation({
    response: { status: 201, type: DelegationDTO },
  })
  @Audit<DelegationDTO>({
    resources: (delegation) => delegation?.id ?? '',
    meta: (delegation) => ({
      scopes: delegation.scopes?.map((s) => ({
        scopeName: s.scopeName,
        validTo: s.validTo,
      })),
    }),
  })
  async create(
    @CurrentUser() user: User,
    @Body() createDelegation: CreateDelegationDTO,
  ): Promise<DelegationDTO> {
    return this.delegationsService.create(user, createDelegation)
  }

  @Patch(':delegationId')
  @Scopes(AuthScope.writeDelegations)
  @Documentation({
    response: { status: 200, type: DelegationDTO },
  })
  @Audit<DelegationDTO>({
    resources: (delegation) => delegation?.id ?? '',
  })
  async patch(
    @CurrentUser() user: User,
    @Param('delegationId') delegationId: string,
    @Body() patchDelegation: PatchDelegationDTO,
  ): Promise<DelegationDTO | null> {
    const currentDelegation = await this.delegationsService.findById(
      user,
      delegationId,
    )
    if (!currentDelegation) {
      return null
    }

    return this.auditService.auditPromise<DelegationDTO | null>(
      {
        auth: user,
        namespace,
        action: 'update',
        resources: (delegation) => delegation?.id ?? '',
        meta: (delegation) => {
          return {
            updateScopes: patchDelegation.updateScopes?.map((s) => s.name),
            deleteScopes: patchDelegation.deleteScopes?.map((s) => s.name),
            scopes: delegation?.scopes?.map((s) => s.scopeName),
          }
        },
      },
      this.delegationsService.patch(user, delegationId, patchDelegation),
    )
  }

  @Delete(':delegationId')
  @Scopes(AuthScope.writeDelegations)
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
        action: 'delete',
        resources: delegationId,
        meta: (deleted) => ({
          deleted,
        }),
      },
      this.delegationsService.delete(user, delegationId),
    )
  }
}
