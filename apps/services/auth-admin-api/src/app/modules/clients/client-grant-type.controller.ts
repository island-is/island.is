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

const namespace = `${environment.audit.defaultNamespace}/client-grant-type`

@UseGuards(IdsUserGuard, ScopesGuard)
@ApiTags('client-grant-type')
@Controller('backend/client-grant-type')
@Audit({ namespace })
export class ClientGrantTypeController {
  constructor(
    private readonly clientsService: ClientsService,
    private readonly auditService: AuditService,
  ) {}

  /** Adds new Grant type to client */
  @Scopes(Scope.root, Scope.full)
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
  @Scopes(Scope.root, Scope.full)
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
        user,
        action: 'delete',
        namespace,
        resources: clientId,
        meta: { grantType },
      },
      this.clientsService.removeGrantType(clientId, grantType),
    )
  }
}
