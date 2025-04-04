import {
  ClientsService,
  ClientGrantTypeDTO,
  ClientGrantType,
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

const namespace = `@island.is/auth-admin-api/client-grant-type`

@UseGuards(IdsUserGuard, ScopesGuard)
@ApiExcludeController()
@Controller({
  path: 'client-grant-type',
  version: [VERSION_NEUTRAL, '1'],
})
@Audit({ namespace })
export class ClientGrantTypeController {
  constructor(
    private readonly clientsService: ClientsService,
    private readonly auditService: AuditService,
  ) {}

  /** Adds new Grant type to client */
  @Scopes(AuthAdminScope.root, AuthAdminScope.full)
  @Post()
  @ApiCreatedResponse({ type: ClientGrantType })
  @Audit<ClientGrantType>({
    resources: (grantType) => grantType.clientId,
    meta: ({ grantType }) => ({ grantType }),
  })
  async create(
    @Body() grantType: ClientGrantTypeDTO,
  ): Promise<ClientGrantType> {
    return this.clientsService.addGrantType(grantType)
  }

  /** Removes a grant type from client */
  @Scopes(AuthAdminScope.root, AuthAdminScope.full)
  @Delete(':clientId/:grantType')
  @ApiCreatedResponse()
  async delete(
    @Param('clientId') clientId: string,
    @Param('grantType') grantType: string,
    @CurrentUser() user: User,
  ): Promise<number> {
    if (!clientId || !grantType) {
      throw new BadRequestException('clientId and grantType must be provided')
    }

    return this.auditService.auditPromise(
      {
        auth: user,
        action: 'delete',
        namespace,
        resources: clientId,
        meta: { grantType },
      },
      this.clientsService.removeGrantType(clientId, grantType),
    )
  }
}
