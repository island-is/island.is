import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common'
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'

import {
  DelegationsService,
  DelegationDTO,
  UpdateDelegationDTO,
  CreateDelegationDTO,
  ResourcesService,
} from '@island.is/auth-api-lib'
import {
  IdsUserGuard,
  Scopes,
  ScopesGuard,
  CurrentActor,
  CurrentUser,
  ActorScopes,
} from '@island.is/auth-nest-tools'
import type { User } from '@island.is/auth-nest-tools'
import { AuthScope } from '@island.is/auth/scopes'
import { Audit, AuditService } from '@island.is/nest/audit'

import { environment } from '../../../environments'

const namespace = '@island.is/auth-public-api/delegations'

@UseGuards(IdsUserGuard, ScopesGuard)
@ApiTags('delegations')
@Controller('public/delegations')
@Audit({ namespace })
export class DelegationsController {
  constructor(
    private readonly delegationsService: DelegationsService,
    private readonly auditService: AuditService,
    private readonly resourcesService: ResourcesService,
  ) {}

  @ActorScopes(AuthScope.actorDelegations)
  @Get()
  @ApiOkResponse({ type: [DelegationDTO] })
  @Audit<DelegationDTO[]>({
    resources: (delegations) => delegations.map((delegation) => delegation.id),
  })
  async findAllTo(@CurrentActor() user: User): Promise<DelegationDTO[]> {
    const wards = await this.delegationsService.findAllWardsTo(
      user,
      environment.nationalRegistry.xroad.clientId ?? '',
    )

    const companies = await this.delegationsService.findAllCompaniesTo(
      user.nationalId,
    )

    const custom = await this.delegationsService.findAllValidCustomTo(
      user.nationalId,
    )

    return [...wards, ...companies, ...custom]
  }

  @Scopes(AuthScope.writeDelegations)
  @Post()
  @ApiCreatedResponse({ type: DelegationDTO })
  @Audit<DelegationDTO>({
    resources: (delegation) => delegation?.id,
  })
  create(
    @CurrentUser() user: User,
    @Body() delegation: CreateDelegationDTO,
  ): Promise<DelegationDTO | null> {
    if (!this.validateLength(delegation)) {
      throw new BadRequestException(
        'Delegations to scopes seem illegit. Make sure you have access to these scopes',
      )
    }

    return this.delegationsService.create(
      user,
      environment.nationalRegistry.xroad.clientId ?? '',
      delegation,
    )
  }

  async validateLength(delegation: CreateDelegationDTO | UpdateDelegationDTO) {
    if (delegation.scopes.length === 0) {
      return true
    }

    const allowedIdentityResources = await this.resourcesService.findAllowedDelegationIdentityResourceListForUser(
      delegation.scopes.map((x) => x.name),
    )
    const allowedApiScopes = await this.resourcesService.findAllowedDelegationApiScopeListForUser(
      delegation.scopes.map((x) => x.name),
    )
    return (
      delegation.scopes.length ===
      allowedIdentityResources.length + allowedApiScopes.length
    )
  }

  @Scopes(AuthScope.writeDelegations)
  @Put(':toNationalId')
  @ApiCreatedResponse({ type: DelegationDTO })
  update(
    @CurrentUser() user: User,
    @Body() delegation: UpdateDelegationDTO,
    @Param('toNationalId') toNationalId: string,
  ): Promise<DelegationDTO | null> {
    if (!this.validateLength(delegation)) {
      throw new BadRequestException(
        'Delegations to scopes seem illegit. Make sure you have access to these scopes',
      )
    }

    return this.auditService.auditPromise<DelegationDTO>(
      {
        user,
        namespace,
        action: 'update',
        resources: (delegation) => delegation?.id,
        meta: { fields: Object.keys(delegation) },
      },
      this.delegationsService.update(user.nationalId, delegation, toNationalId),
    )
  }

  @Scopes(AuthScope.writeDelegations)
  @Delete('custom/delete/from/:id')
  @ApiCreatedResponse()
  deleteFrom(
    @CurrentUser() user: User,
    @Param('id') id: string,
  ): Promise<number> {
    return this.auditService.auditPromise(
      {
        user,
        namespace,
        action: 'deleteFrom',
        resources: id,
      },
      this.delegationsService.deleteFrom(user.nationalId, id),
    )
  }

  @Scopes(AuthScope.writeDelegations)
  @Delete('custom/delete/to/:toNationalId')
  @ApiCreatedResponse()
  deleteTo(
    @CurrentUser() user: User,
    @Param('toNationalId') toNationalId: string,
  ): Promise<number> {
    return this.auditService.auditPromise(
      {
        user,
        namespace,
        action: 'deleteTo',
        resources: toNationalId,
      },
      this.delegationsService.deleteTo(user.nationalId, toNationalId),
    )
  }

  @Scopes(AuthScope.readDelegations)
  @Get('custom/findone/:id')
  @ApiOkResponse({ type: DelegationDTO })
  @Audit<DelegationDTO>({
    resources: (delegation) => delegation?.id,
  })
  findOne(
    @CurrentUser() user: User,
    @Param('id') id: string,
  ): Promise<DelegationDTO | null> {
    return this.delegationsService.findOne(user.nationalId, id)
  }

  @Scopes(AuthScope.readDelegations)
  @Get('custom/findone/to/:nationalId')
  @ApiOkResponse({ type: DelegationDTO })
  @Audit<DelegationDTO>({
    resources: (delegation) => delegation?.id,
  })
  async findOneTo(
    @CurrentUser() user: User,
    @Param('nationalId') nationalId: string,
  ): Promise<DelegationDTO | null> {
    const delegation = await this.delegationsService.findOneTo(
      user.nationalId,
      nationalId,
    )
    if (!delegation) {
      throw new NotFoundException(
        `Delegation<from: ${user.nationalId};to: ${nationalId}> was not found`,
      )
    }

    return delegation.toDTO()
  }

  @Scopes(AuthScope.readDelegations)
  @Get('custom/to')
  @ApiOkResponse({ type: [DelegationDTO] })
  @Audit<DelegationDTO[]>({
    resources: (delegations) => delegations.map((delegation) => delegation?.id),
  })
  async findAllCustomTo(
    @CurrentUser() user: User,
  ): Promise<DelegationDTO[] | null> {
    return await this.delegationsService.findAllCustomTo(user.nationalId)
  }

  @Scopes(AuthScope.readDelegations)
  @Get('custom/from')
  @ApiOkResponse({ type: [DelegationDTO] })
  @Audit<DelegationDTO[]>({
    resources: (delegations) => delegations.map((delegation) => delegation?.id),
  })
  async findAllCustomFrom(
    @CurrentUser() user: User,
  ): Promise<DelegationDTO[] | null> {
    return await this.delegationsService.findAllCustomFrom(user.nationalId)
  }
}
