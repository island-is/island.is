import {
  ClientsService,
  ClientPostLogoutRedirectUriDTO,
  ClientPostLogoutRedirectUri,
} from '@island.is/auth-api-lib'
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
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

const namespace = `@island.is/auth-admin-api/client-post-logout-redirect-uri`

@UseGuards(IdsUserGuard, ScopesGuard)
@ApiExcludeController()
@Controller({
  path: 'client-post-logout-redirect-uri',
  version: [VERSION_NEUTRAL, '1'],
})
@Audit({ namespace })
export class ClientPostLogoutRedirectUriController {
  constructor(
    private readonly clientsService: ClientsService,
    private readonly auditService: AuditService,
  ) {}

  /** Adds new Grant type to client */
  @Scopes(AuthAdminScope.root, AuthAdminScope.full)
  @Post()
  @ApiCreatedResponse({ type: ClientPostLogoutRedirectUri })
  @Audit<ClientPostLogoutRedirectUri>({
    resources: (uri) => uri.clientId,
    meta: ({ redirectUri }) => ({ redirectUri }),
  })
  async create(
    @Body() postLogoutUri: ClientPostLogoutRedirectUriDTO,
  ): Promise<ClientPostLogoutRedirectUri> {
    return this.clientsService.addPostLogoutRedirectUri(postLogoutUri)
  }

  /** Removes a grant type from client */
  @Scopes(AuthAdminScope.root, AuthAdminScope.full)
  @Delete(':clientId/:redirectUri')
  @ApiCreatedResponse()
  async delete(
    @Param('clientId') clientId: string,
    @Param('redirectUri') redirectUri: string,
    @CurrentUser() user: User,
  ): Promise<number> {
    if (!clientId || !redirectUri) {
      throw new BadRequestException('clientId and redirectUri must be provided')
    }

    return this.auditService.auditPromise(
      {
        auth: user,
        action: 'delete',
        namespace,
        resources: clientId,
        meta: { redirectUri },
      },
      this.clientsService.removePostLogoutRedirectUri(clientId, redirectUri),
    )
  }
}
