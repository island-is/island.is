import {
  ClientsService,
  ClientClaimDTO,
  ClientClaim,
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

const namespace = `${environment.audit.defaultNamespace}/client-claim`
@UseGuards(IdsUserGuard, ScopesGuard)
@ApiTags('client-claim')
@Controller('backend/client-claim')
@Audit({ namespace })
export class ClientClaimController {
  constructor(
    private readonly clientsService: ClientsService,
    private readonly auditService: AuditService,
  ) {}

  /** Adds new claim to client */
  @Scopes(AuthAdminScope.root, AuthAdminScope.full)
  @Post()
  @ApiCreatedResponse({ type: ClientClaim })
  @Audit<ClientClaim>({
    resources: (claim) => claim.clientId,
    meta: (claim) => ({ type: claim.type, value: claim.value }),
  })
  async create(@Body() claim: ClientClaimDTO): Promise<ClientClaim> {
    return this.clientsService.addClaim(claim)
  }

  /** Removes a claim from client */
  @Scopes(AuthAdminScope.root, AuthAdminScope.full)
  @Delete(':clientId/:claimType/:claimValue')
  @ApiCreatedResponse()
  async delete(
    @Param('clientId') clientId: string,
    @Param('claimType') claimType: string,
    @Param('claimValue') claimValue: string,
    @CurrentUser() user: User,
  ): Promise<number> {
    if (!clientId || !claimType || !claimValue) {
      throw new BadRequestException(
        'clientId, claimType and claimValue must be provided',
      )
    }

    return this.auditService.auditPromise(
      {
        auth: user,
        action: 'delete',
        namespace,
        resources: `${clientId}/${claimType}/${claimValue}`,
      },
      this.clientsService.removeClaim(clientId, claimType, claimValue),
    )
  }
}
