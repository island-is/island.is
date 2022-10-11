import {
  ClientsService,
  ClientSecretDTO,
  ClientSecret,
} from '@island.is/auth-api-lib'
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Post,
  UseGuards,
} from '@nestjs/common'
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger'
import type { User } from '@island.is/auth-nest-tools'
import {
  IdsUserGuard,
  ScopesGuard,
  Scopes,
  CurrentUser,
} from '@island.is/auth-nest-tools'
import { AuthAdminScope } from '@island.is/auth/scopes'
import { Audit, AuditService } from '@island.is/nest/audit'
import { environment } from '../../../environments'

const namespace = `${environment.audit.defaultNamespace}/client-secret`

@UseGuards(IdsUserGuard, ScopesGuard)
@ApiTags('client-secret')
@Controller('backend/client-secret')
@Audit({ namespace })
export class ClientSecretController {
  constructor(
    private readonly clientsService: ClientsService,
    private readonly auditService: AuditService,
  ) {}

  /** Adds new secret to client */
  @Scopes(AuthAdminScope.root, AuthAdminScope.full)
  @Post()
  @ApiCreatedResponse({ type: ClientSecret })
  @Audit<ClientSecret>({
    resources: (secret) => secret.clientId,
  })
  async create(@Body() clientSecret: ClientSecretDTO): Promise<ClientSecret> {
    if (!clientSecret) {
      throw new BadRequestException('Client Secret object is required')
    }

    return this.clientsService.addClientSecret(clientSecret)
  }

  /** Removes a secret from client */
  @Scopes(AuthAdminScope.root, AuthAdminScope.full)
  @Delete()
  @ApiCreatedResponse()
  async delete(
    @Body() clientSecret: ClientSecretDTO,
    @CurrentUser() user: User,
  ): Promise<number> {
    if (!clientSecret) {
      throw new BadRequestException('The Client Secret object is required')
    }

    return this.auditService.auditPromise(
      {
        auth: user,
        action: 'delete',
        namespace,
        resources: clientSecret.clientId,
      },
      this.clientsService.removeClientSecret(clientSecret),
    )
  }
}
