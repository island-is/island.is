import {
  ClientsService,
  ClientIdpRestrictions,
  ClientIdpRestrictionDTO,
  IdpProvider,
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
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'
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

const namespace = `${environment.audit.defaultNamespace}/idp-restriction`

@UseGuards(IdsUserGuard, ScopesGuard)
@ApiTags('idp-restriction')
@Controller('backend/idp-restriction')
@Audit({ namespace })
export class IdpRestrictionController {
  constructor(
    private readonly clientsService: ClientsService,
    private readonly auditService: AuditService,
  ) {}

  /** Adds new IDP restriction */
  @Scopes(Scope.root, Scope.full)
  @Post()
  @ApiCreatedResponse({ type: ClientIdpRestrictions })
  @Audit<ClientIdpRestrictions>({
    resources: (restriction) => restriction.clientId,
    meta: ({ name }) => ({ name }),
  })
  async create(
    @Body() restriction: ClientIdpRestrictionDTO,
  ): Promise<ClientIdpRestrictions> {
    return this.clientsService.addIdpRestriction(restriction)
  }

  /** Removes a idp restriction */
  @Scopes(Scope.root, Scope.full)
  @Delete(':clientId/:name')
  @ApiCreatedResponse()
  async delete(
    @Param('clientId') clientId: string,
    @Param('name') name: string,
    @CurrentUser() user: User,
  ): Promise<number> {
    if (!clientId || !name) {
      throw new BadRequestException('clientId and name must be provided')
    }

    return this.auditService.auditPromise(
      {
        user,
        action: 'delete',
        namespace,
        resources: clientId,
        meta: { name },
      },
      this.clientsService.removeIdpRestriction(clientId, name),
    )
  }

  /** Finds available idp providers that can be restricted */
  @Scopes(Scope.root, Scope.full)
  @Get()
  @ApiOkResponse({ type: [IdpProvider] })
  @Audit<IdpProvider[]>({
    resources: (providers) => providers.map((provider) => provider.name),
  })
  async findAllIdpRestrictions(): Promise<IdpProvider[]> {
    return this.clientsService.findAllIdpRestrictions()
  }
}
