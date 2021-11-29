import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  BadRequestException,
  Query,
  NotFoundException,
  ConflictException,
  HttpCode,
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

import {
  DelegationsService,
  DelegationDTO,
  UpdateDelegationDTO,
  CreateDelegationDTO,
  ResourcesService,
  DelegationDirection,
  UpdateDelegationScopeDTO,
} from '@island.is/auth-api-lib'
import {
  IdsUserGuard,
  Scopes,
  ScopesGuard,
  CurrentUser,
  AuthMiddlewareOptions,
} from '@island.is/auth-nest-tools'
import type { User } from '@island.is/auth-nest-tools'
import { AuthScope } from '@island.is/auth/scopes'
import { Audit, AuditService } from '@island.is/nest/audit'
import { HttpProblem } from '@island.is/shared/problem'

import { environment } from '../../../environments'

const namespace = '@island.is/auth-public-api/delegations'

@UseGuards(IdsUserGuard, ScopesGuard)
@ApiTags('me', 'delegations')
@Controller('v1/me/delegations')
@Audit({ namespace })
export class MeDelegationsController {
  constructor(
    private readonly delegationsService: DelegationsService,
    private readonly auditService: AuditService,
    private readonly resourcesService: ResourcesService,
  ) {}

  @Scopes(AuthScope.writeDelegations)
  @Post()
  @ApiCreatedResponse({ type: DelegationDTO })
  @ApiBadRequestResponse()
  @ApiConflictResponse()
  @ApiInternalServerErrorResponse()
  @Audit<DelegationDTO>({
    resources: (delegation) => delegation?.id ?? '',
  })
  async create(
    @CurrentUser() user: User,
    @Body() delegation: CreateDelegationDTO,
  ): Promise<DelegationDTO | null> {
    if (!(await this.validateScopes(user.scope, delegation.scopes))) {
      throw new BadRequestException(
        'User does not have access to the requested scopes.',
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
  @Put(':delegationId')
  @ApiOkResponse({ type: DelegationDTO })
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiUnauthorizedResponse()
  @ApiInternalServerErrorResponse()
  async update(
    @CurrentUser() user: User,
    @Body() delegation: UpdateDelegationDTO,
    @Param('delegationId') delegationId: string,
  ): Promise<DelegationDTO | null> {
    if (!(await this.validateScopes(user.scope, delegation.scopes))) {
      throw new BadRequestException(
        'User does not have access to the requested scopes.',
      )
    }

    return this.auditService.auditPromise<DelegationDTO | null>(
      {
        user,
        namespace,
        action: 'update',
        resources: (delegation) => delegation?.id ?? '',
        meta: { fields: Object.keys(delegation) },
      },
      this.delegationsService.update(user.nationalId, delegation, delegationId),
    )
  }

  @Scopes(AuthScope.writeDelegations)
  @Delete(':delegationId')
  @HttpCode(204)
  @ApiNoContentResponse()
  async deleteFrom(
    @CurrentUser() user: User,
    @Param('delegationId') delegationId: string,
  ): Promise<void> {
    await this.auditService.auditPromise(
      {
        user,
        namespace,
        action: 'deleteFrom',
        resources: delegationId,
      },
      this.delegationsService.delete(user.nationalId, delegationId),
    )
  }

  @Scopes(AuthScope.readDelegations)
  @Get(':id')
  @ApiOperation({
    description: `Finds a single delegation by ID where the authenticated user is either giving or receiving.
       Does not include delegations from NationalRegistry or CompanyRegistry.`,
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'Delegation ID.',
  })
  @ApiOkResponse({ type: DelegationDTO })
  @ApiNotFoundResponse()
  @ApiForbiddenResponse()
  @ApiUnauthorizedResponse()
  @ApiInternalServerErrorResponse()
  @Audit<DelegationDTO>({
    resources: (delegation) => delegation?.id ?? '',
  })
  async findOne(
    @CurrentUser() user: User,
    @Param('id') id: string,
  ): Promise<DelegationDTO | null> {
    const delegation = await this.delegationsService.findById(
      user.nationalId,
      id,
    )

    if (!delegation) {
      throw new NotFoundException()
    }

    return delegation
  }

  @Scopes(AuthScope.readDelegations)
  @Get()
  @ApiQuery({
    name: 'direction',
    required: true,
    schema: {
      enum: ['outgoing'],
      default: 'outgoing',
    },
  })
  @ApiQuery({ name: 'isValid', required: false, type: 'boolean' })
  @ApiOkResponse({ type: [DelegationDTO] })
  @ApiBadRequestResponse()
  @ApiForbiddenResponse()
  @ApiUnauthorizedResponse()
  @ApiInternalServerErrorResponse()
  @Audit<DelegationDTO[]>({
    resources: (delegations) =>
      delegations.map((delegation) => delegation?.id ?? ''),
  })
  async findAll(
    @CurrentUser() user: User,
    @Query('direction') direction: DelegationDirection,
    @Query('isValid') isValid?: boolean,
  ): Promise<DelegationDTO[]> {
    if (direction !== DelegationDirection.OUTGOING) {
      throw new BadRequestException(
        'direction=outgoing is currently the only supported value',
      )
    }

    return this.delegationsService.findAllOutgoing(user.nationalId, isValid)
  }

  /**
   * Validates that the delegation scopes belong to user and are valid for delegation
   * @param userScopes user scopes from the currently authenticated user
   * @param requestedScopes requested scopes from a delegation
   * @returns
   */
  private async validateScopes(
    userScopes: string[],
    requestedScopes: UpdateDelegationScopeDTO[],
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
    const allowedIdentityResources = await this.resourcesService.findAllowedDelegationIdentityResourceListForUser(
      scopes,
    )
    const allowedApiScopes = await this.resourcesService.findAllowedDelegationApiScopeListForUser(
      scopes,
    )
    return (
      requestedScopes.length ===
      allowedIdentityResources.length + allowedApiScopes.length
    )
  }
}
