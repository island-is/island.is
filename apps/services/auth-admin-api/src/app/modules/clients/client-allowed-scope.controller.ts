import {
  ClientsService,
  ClientAllowedScopeDTO,
  ClientAllowedScope,
  ApiScope,
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
} from '@nestjs/common'
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger'
import {
  IdsUserGuard,
  ScopesGuard,
  Scopes,
  CurrentUser,
  User,
} from '@island.is/auth-nest-tools'
import { Scope } from '../access/scope.constants'
import { Audit, AuditService } from '@island.is/nest/audit'
import { environment } from '../../../environments/environment'

const namespace = `${environment.audit.defaultNamespace}/client-allowed-scope`

@UseGuards(IdsUserGuard, ScopesGuard)
@ApiTags('client-allowed-scope')
@Controller('backend/client-allowed-scope')
@Audit({ namespace })
export class ClientAllowedScopeController {
  constructor(
    private readonly clientsService: ClientsService,
    private readonly auditService: AuditService,
  ) {}

  /** Gets all scopes for client to select from */
  @Scopes(Scope.root, Scope.full)
  @Get()
  @Audit<ApiScope[]>({
    resources: (scopes) => scopes.map((scope) => scope.name),
  })
  async findAvailabeScopes(): Promise<ApiScope[]> {
    return this.clientsService.FindAvailabeScopes()
  }

  /** Adds new scope to client */
  @Scopes(Scope.root, Scope.full)
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
  @Scopes(Scope.root, Scope.full)
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
        user,
        action: 'delete',
        namespace,
        resources: clientId,
        meta: { scope: scopeName },
      },
      this.clientsService.removeAllowedScope(clientId, scopeName),
    )
  }
}
