import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'
import startOfDay from 'date-fns/startOfDay'

import {
  CreateDelegationDTO,
  DelegationDirection,
  DelegationDTO,
  DelegationsService,
  DelegationValidity,
  ResourcesService,
  UpdateDelegationDTO,
  UpdateDelegationScopeDTO,
} from '@island.is/auth-api-lib'
import {
  AuthMiddlewareOptions,
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
import { HttpProblemResponse } from '@island.is/nest/problem'

import { environment } from '../../../environments'

const namespace = '@island.is/auth-public-api/delegations'

@UseGuards(IdsUserGuard, ScopesGuard, FeatureFlagGuard)
@ApiTags('me-delegations')
@Controller('v1/me/delegations')
@Audit({ namespace })
export class MeDelegationsController {
  constructor(
    private readonly delegationsService: DelegationsService,
    private readonly auditService: AuditService,
    private readonly resourcesService: ResourcesService,
  ) {}

  @Scopes(AuthScope.readDelegations)
  @FeatureFlag(Features.customDelegations)
  @Get()
  @ApiQuery({
    name: 'direction',
    required: true,
    schema: {
      enum: [DelegationDirection.OUTGOING],
      default: DelegationDirection.OUTGOING,
    },
  })
  @ApiQuery({
    name: 'valid',
    required: false,
    schema: {
      enum: Object.values(DelegationValidity),
      default: DelegationValidity.ALL,
    },
  })
  @ApiQuery({ name: 'otherUser', required: false, type: 'string' })
  @ApiOkResponse({ type: [DelegationDTO] })
  @ApiBadRequestResponse({ type: HttpProblemResponse })
  @ApiForbiddenResponse({ type: HttpProblemResponse })
  @ApiUnauthorizedResponse({ type: HttpProblemResponse })
  @ApiInternalServerErrorResponse()
  @Audit<DelegationDTO[]>({
    resources: (delegations) =>
      delegations.map((delegation) => delegation?.id ?? ''),
  })
  async findAll(
    @CurrentUser() user: User,
    @Query('direction') direction: DelegationDirection,
    @Query('valid') valid: DelegationValidity = DelegationValidity.ALL,
    @Query('otherUser') otherUser?: string,
  ): Promise<DelegationDTO[]> {
    if (direction !== DelegationDirection.OUTGOING) {
      throw new BadRequestException(
        'direction=outgoing is currently the only supported value',
      )
    }

    return this.delegationsService.findAllOutgoing(
      user.nationalId,
      valid,
      otherUser,
    )
  }

  @Scopes(AuthScope.readDelegations)
  @FeatureFlag(Features.customDelegations)
  @Get(':delegationId')
  @ApiOperation({
    description: `Finds a single delegation by ID where the authenticated user is either giving or receiving.
       Does not include delegations from NationalRegistry or CompanyRegistry.`,
  })
  @ApiParam({
    name: 'delegationId',
    type: 'string',
    description: 'Delegation ID.',
  })
  @ApiQuery({
    name: 'valid',
    required: false,
    schema: {
      enum: Object.values(DelegationValidity),
      default: DelegationValidity.ALL,
    },
  })
  @ApiOkResponse({ type: DelegationDTO })
  @ApiNotFoundResponse({ type: HttpProblemResponse })
  @ApiForbiddenResponse({ type: HttpProblemResponse })
  @ApiUnauthorizedResponse({ type: HttpProblemResponse })
  @ApiInternalServerErrorResponse()
  @Audit<DelegationDTO>({
    resources: (delegation) => delegation?.id ?? '',
  })
  async findOne(
    @CurrentUser() user: User,
    @Param('delegationId') delegationId: string,
    @Query('valid') valid: DelegationValidity = DelegationValidity.ALL,
  ): Promise<DelegationDTO | null> {
    const delegation = await this.delegationsService.findById(
      user.nationalId,
      delegationId,
      valid,
    )

    if (!delegation) {
      throw new NotFoundException()
    }

    return delegation
  }

  @Scopes(AuthScope.writeDelegations)
  @FeatureFlag(Features.customDelegations)
  @Post()
  @ApiCreatedResponse({ type: DelegationDTO })
  @ApiBadRequestResponse({ type: HttpProblemResponse })
  @ApiConflictResponse({ type: HttpProblemResponse })
  @ApiUnauthorizedResponse({ type: HttpProblemResponse })
  @ApiForbiddenResponse({ type: HttpProblemResponse })
  @ApiInternalServerErrorResponse()
  @Audit<DelegationDTO>({
    resources: (delegation) => delegation?.id ?? '',
  })
  async create(
    @CurrentUser() user: User,
    @Body() delegation: CreateDelegationDTO,
  ): Promise<DelegationDTO | null> {
    if (!(await this.validateScopesAccess(user.scope, delegation.scopes))) {
      throw new BadRequestException(
        'User does not have access to the requested scopes.',
      )
    }

    if (!this.validateScopesPeriod(delegation.scopes)) {
      throw new BadRequestException(
        'If scope validTo property is provided it must be in the future',
      )
    }

    if (
      await this.delegationsService.findByRelationship(
        user.nationalId,
        delegation.toNationalId,
      )
    ) {
      throw new ConflictException(
        'Delegation exists. Please use PUT method to update.',
      )
    }

    return this.delegationsService.create(
      user,
      delegation,
      environment.nationalRegistry
        .authMiddlewareOptions as AuthMiddlewareOptions,
    )
  }

  @Scopes(AuthScope.writeDelegations)
  @FeatureFlag(Features.customDelegations)
  @Put(':delegationId')
  @ApiOkResponse({ type: DelegationDTO })
  @ApiBadRequestResponse({ type: HttpProblemResponse })
  @ApiNotFoundResponse({ type: HttpProblemResponse })
  @ApiUnauthorizedResponse({ type: HttpProblemResponse })
  @ApiForbiddenResponse({ type: HttpProblemResponse })
  @ApiInternalServerErrorResponse()
  async update(
    @CurrentUser() user: User,
    @Body() delegation: UpdateDelegationDTO,
    @Param('delegationId') delegationId: string,
  ): Promise<DelegationDTO | null> {
    if (!(await this.validateScopesAccess(user.scope, delegation.scopes))) {
      throw new BadRequestException(
        'User does not have access to the requested scopes.',
      )
    }

    if (!this.validateScopesPeriod(delegation.scopes)) {
      throw new BadRequestException(
        'If scope validTo property is provided it must be in the future',
      )
    }

    return this.auditService.auditPromise<DelegationDTO | null>(
      {
        auth: user,
        namespace,
        action: 'update',
        resources: (delegation) => delegation?.id ?? '',
        meta: { fields: Object.keys(delegation) },
      },
      this.delegationsService.update(user.nationalId, delegation, delegationId),
    )
  }

  @Scopes(AuthScope.writeDelegations)
  @FeatureFlag(Features.customDelegations)
  @Delete(':delegationId')
  @HttpCode(204)
  @ApiNoContentResponse()
  @ApiUnauthorizedResponse({ type: HttpProblemResponse })
  @ApiForbiddenResponse({ type: HttpProblemResponse })
  @ApiInternalServerErrorResponse()
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
      this.delegationsService.delete(user.nationalId, delegationId),
    )
  }

  /**
   * Validates that the delegation scopes belong to user and are valid for delegation
   * @param userScopes user scopes from the currently authenticated user
   * @param requestedScopes requested scopes from a delegation
   * @returns
   */
  private async validateScopesAccess(
    userScopes: string[],
    requestedScopes?: UpdateDelegationScopeDTO[],
  ): Promise<boolean> {
    if (!requestedScopes || requestedScopes.length === 0) {
      return true
    }

    for (const scope of requestedScopes) {
      // Delegation scopes need to be associated with the user scopes
      if (!userScopes.includes(scope.name)) {
        return false
      }
    }

    // Check if the requested scopes are valid
    const scopes = requestedScopes.map((scope) => scope.name)
    const allowedApiScopesCount = await this.resourcesService.countAllowedDelegationApiScopesForUser(
      scopes,
    )
    return requestedScopes.length === allowedApiScopesCount
  }

  /**
   * Validates the valid period of the scopes requested in a delegation.
   * @param scopes requested scopes on a delegation
   */
  private validateScopesPeriod(scopes?: UpdateDelegationScopeDTO[]): boolean {
    if (!scopes || scopes.length === 0) {
      return true
    }

    const startOfToday = startOfDay(new Date())
    // validTo can be null or undefined or it needs to be the current day or in the future
    return scopes.every(
      (scope) => !scope.validTo || new Date(scope.validTo) >= startOfToday,
    )
  }
}
