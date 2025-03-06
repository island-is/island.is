import {
  ClientsService,
  ClientIdpRestrictions,
  ClientIdpRestrictionDTO,
  IdpProviderService,
  IdpProvider,
} from '@island.is/auth-api-lib'
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
  VERSION_NEUTRAL,
} from '@nestjs/common'
import {
  ApiCreatedResponse,
  ApiExcludeController,
  ApiOkResponse,
} from '@nestjs/swagger'
import type { User } from '@island.is/auth-nest-tools'
import {
  IdsUserGuard,
  ScopesGuard,
  Scopes,
  CurrentUser,
} from '@island.is/auth-nest-tools'
import { AuthAdminScope } from '@island.is/auth/scopes'
import { Audit, AuditService } from '@island.is/nest/audit'
import { environment } from '../../../environments/'

const namespace = `@island.is/auth-admin-api/idp-restriction`

@UseGuards(IdsUserGuard, ScopesGuard)
@ApiExcludeController()
@Controller({
  path: 'idp-restriction',
  version: [VERSION_NEUTRAL, '1'],
})
@Audit({ namespace })
export class IdpRestrictionController {
  constructor(
    private readonly clientsService: ClientsService,
    private readonly idpProviderService: IdpProviderService,
    private readonly auditService: AuditService,
  ) {}

  /** Adds new IDP restriction */
  @Scopes(AuthAdminScope.root, AuthAdminScope.full)
  @Post()
  @ApiCreatedResponse({ type: ClientIdpRestrictions })
  @Audit<ClientIdpRestrictions>({
    resources: (restriction) => restriction.clientId,
    meta: ({ name }) => ({ name }),
  })
  async create(
    @Body() restriction: ClientIdpRestrictionDTO,
  ): Promise<ClientIdpRestrictions> {
    return this.clientsService.addIdpRestriction(restriction)
  }

  /** Removes a idp restriction */
  @Scopes(AuthAdminScope.root, AuthAdminScope.full)
  @Delete(':clientId/:name')
  @ApiCreatedResponse()
  async delete(
    @Param('clientId') clientId: string,
    @Param('name') name: string,
    @CurrentUser() user: User,
  ): Promise<number> {
    if (!clientId || !name) {
      throw new BadRequestException('clientId and name must be provided')
    }

    return this.auditService.auditPromise(
      {
        auth: user,
        action: 'delete',
        namespace,
        resources: clientId,
        meta: { name },
      },
      this.clientsService.removeIdpRestriction(clientId, name),
    )
  }

  /** Finds available idp providers that can be restricted */
  @Scopes(AuthAdminScope.root, AuthAdminScope.full)
  @Get()
  @ApiOkResponse({ type: [IdpProvider] })
  @Audit<IdpProvider[]>({
    resources: (providers) => providers.map((provider) => provider.name),
  })
  async findAllIdpRestrictions(): Promise<IdpProvider[]> {
    return this.idpProviderService.findAll()
  }
}
