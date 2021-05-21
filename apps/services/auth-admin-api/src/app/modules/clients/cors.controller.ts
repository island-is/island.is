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

const namespace = `${environment.audit.defaultNamespace}/cors`

@UseGuards(IdsUserGuard, ScopesGuard)
@ApiTags('cors')
@Controller('backend/cors')
@Audit({ namespace })
export class CorsController {
  constructor(
    private readonly clientsService: ClientsService,
    private readonly auditService: AuditService,
  ) {}

  /** Adds new Cors address */
  @Scopes(Scope.root, Scope.full)
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
  @Scopes(Scope.root, Scope.full)
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
        user,
        action: 'delete',
        namespace,
        resources: clientId,
        meta: { origin },
      },
      this.clientsService.removeAllowedCorsOrigin(clientId, origin),
    )
  }
}
