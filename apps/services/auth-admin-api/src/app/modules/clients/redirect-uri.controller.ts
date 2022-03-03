import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common'
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger'

import { AuthAdminScope } from '@island.is/auth/scopes'
import {
  ClientRedirectUri,
  ClientRedirectUriDTO,
  ClientsService,
} from '@island.is/auth-api-lib'
import type { User } from '@island.is/auth-nest-tools'
import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import { Audit, AuditService } from '@island.is/nest/audit'

import { environment } from '../../../environments/'

const namespace = `${environment.audit.defaultNamespace}/redirect-uri`

@UseGuards(IdsUserGuard, ScopesGuard)
@ApiTags('redirect-uri')
@Controller('backend/redirect-uri')
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
