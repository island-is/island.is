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

import { Documentation } from '@island.is/nest/swagger'
import {
  CreateDelegationDTO,
  DelegationDirection,
  DelegationDTO,
  DelegationsService,
  DelegationValidity,
  UpdateDelegationDTO,
} from '@island.is/auth-api-lib'
import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import { AuthScope } from '@island.is/auth/scopes'
import type { User } from '@island.is/auth-nest-tools'
import { Audit, AuditService } from '@island.is/nest/audit'
import {
  FeatureFlagGuard,
  Features,
  FeatureFlag,
} from '@island.is/nest/feature-flags'

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

  @Scopes(AuthScope.readDelegations)
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
      delegations.map((delegation) => delegation?.id ?? ''),
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

    return this.delegationsService.findAllOutgoing(user, validity, otherUser)
  }

  @Scopes(AuthScope.readDelegations)
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
          description: 'Delegation ID.',
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
    const delegation = await this.delegationsService.findById(
      user,
      delegationId,
    )

    if (!delegation) {
      throw new NotFoundException()
    }

    return delegation
  }

  @Scopes(AuthScope.writeDelegations)
  @FeatureFlag(Features.customDelegations)
  @Post()
  @Documentation({
    response: { status: 201, type: DelegationDTO },
  })
  @Audit<DelegationDTO>({
    resources: (delegation) => delegation?.id ?? '',
  })
  async create(
    @CurrentUser() user: User,
    @Body() delegation: CreateDelegationDTO,
  ): Promise<DelegationDTO | null> {
    return this.delegationsService.create(user, delegation)
  }

  @Scopes(AuthScope.writeDelegations)
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
    return this.auditService.auditPromise<DelegationDTO | null>(
      {
        auth: user,
        namespace,
        action: 'update',
        resources: (delegation) => delegation?.id ?? '',
        meta: { fields: Object.keys(delegation) },
      },
      this.delegationsService.update(user, delegation, delegationId),
    )
  }

  @Scopes(AuthScope.writeDelegations)
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
