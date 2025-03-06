import {
  ClientsService,
  ClientAllowedScopeDTO,
  ClientAllowedScope,
  ApiScope,
  ResourcesService,
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
import { ApiCreatedResponse, ApiExcludeController } from '@nestjs/swagger'
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

const namespace = `@island.is/auth-admin-api/client-allowed-scope`

@UseGuards(IdsUserGuard, ScopesGuard)
@ApiExcludeController()
@Controller({
  path: 'client-allowed-scope',
  version: [VERSION_NEUTRAL, '1'],
})
@Audit({ namespace })
export class ClientAllowedScopeController {
  constructor(
    private readonly clientsService: ClientsService,
    private readonly resourcesService: ResourcesService,
    private readonly auditService: AuditService,
  ) {}

  /** Gets all scopes for client to select from */
  @Scopes(AuthAdminScope.root, AuthAdminScope.full)
  @Get()
  @Audit<ApiScope[]>({
    resources: (scopes) => scopes.map((scope) => scope.name),
  })
  async findAvailableScopes(): Promise<ApiScope[]> {
    return this.resourcesService.findScopesAvailableForClients()
  }

  /** Adds new scope to client */
  @Scopes(AuthAdminScope.root, AuthAdminScope.full)
  @Post()
  @ApiCreatedResponse({ type: ClientAllowedScope })
  @Audit<ClientAllowedScope>({
    resources: (scope) => scope.clientId,
    meta: (scope) => ({ scope: scope.scopeName }),
  })
  async create(
    @Body() scope: ClientAllowedScopeDTO,
  ): Promise<ClientAllowedScope> {
    return this.clientsService.addAllowedScope(scope)
  }

  /** Removes a scope from client */
  @Scopes(AuthAdminScope.root, AuthAdminScope.full)
  @Delete(':clientId/:scopeName')
  @ApiCreatedResponse()
  async delete(
    @Param('clientId') clientId: string,
    @Param('scopeName') scopeName: string,
    @CurrentUser() user: User,
  ): Promise<number> {
    if (!clientId || !scopeName) {
      throw new BadRequestException('clientId and scopeName must be provided')
    }

    return this.auditService.auditPromise(
      {
        auth: user,
        action: 'delete',
        namespace,
        resources: clientId,
        meta: { scope: scopeName },
      },
      this.clientsService.removeAllowedScope(clientId, scopeName),
    )
  }
}
