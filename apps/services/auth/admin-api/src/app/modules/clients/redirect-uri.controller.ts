import {
  ClientsService,
  ClientRedirectUriDTO,
  ClientRedirectUri,
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

const namespace = `@island.is/auth-admin-api/redirect-uri`

@UseGuards(IdsUserGuard, ScopesGuard)
@ApiExcludeController()
@Controller({ path: 'redirect-uri', version: [VERSION_NEUTRAL, '1'] })
@Audit({ namespace })
export class RedirectUriController {
  constructor(
    private readonly clientsService: ClientsService,
    private readonly auditService: AuditService,
  ) {}

  /** Adds new redirect uri to client */
  @Scopes(AuthAdminScope.root, AuthAdminScope.full)
  @Post()
  @ApiCreatedResponse({ type: ClientRedirectUri })
  @Audit<ClientRedirectUri>({
    resources: (uri) => uri.clientId,
    meta: ({ redirectUri }) => ({ redirectUri }),
  })
  async create(
    @Body() redirectUri: ClientRedirectUriDTO,
  ): Promise<ClientRedirectUri> {
    return this.clientsService.addRedirectUri(redirectUri)
  }

  /** Removes an redirect uri for client */
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
        meta: { redirectUri: redirectUri },
      },
      this.clientsService.removeRedirectUri(clientId, redirectUri),
    )
  }
}
