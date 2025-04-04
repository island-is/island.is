import {
  ClientsService,
  ClientAllowedCorsOriginDTO,
  ClientAllowedCorsOrigin,
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

const namespace = `@island.is/auth-admin-api/cors`

@UseGuards(IdsUserGuard, ScopesGuard)
@ApiExcludeController()
@Controller({ path: 'cors', version: [VERSION_NEUTRAL, '1'] })
@Audit({ namespace })
export class CorsController {
  constructor(
    private readonly clientsService: ClientsService,
    private readonly auditService: AuditService,
  ) {}

  /** Adds new Cors address */
  @Scopes(AuthAdminScope.root, AuthAdminScope.full)
  @Post()
  @ApiCreatedResponse({ type: ClientAllowedCorsOrigin })
  @Audit<ClientAllowedCorsOrigin>({
    resources: (corsOrigin) => corsOrigin.clientId,
    meta: ({ origin }) => ({ origin }),
  })
  async create(
    @Body() corsOrigin: ClientAllowedCorsOriginDTO,
  ): Promise<ClientAllowedCorsOrigin> {
    return this.clientsService.addAllowedCorsOrigin(corsOrigin)
  }

  /** Removes an cors origin from client */
  @Scopes(AuthAdminScope.root, AuthAdminScope.full)
  @Delete(':clientId/:origin')
  @ApiCreatedResponse()
  async delete(
    @Param('clientId') clientId: string,
    @Param('origin') origin: string,
    @CurrentUser() user: User,
  ): Promise<number> {
    if (!clientId || !origin) {
      throw new BadRequestException('clientId and origin must be provided')
    }

    return this.auditService.auditPromise(
      {
        auth: user,
        action: 'delete',
        namespace,
        resources: clientId,
        meta: { origin },
      },
      this.clientsService.removeAllowedCorsOrigin(clientId, origin),
    )
  }
}
