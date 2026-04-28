import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common'
import { ApiSecurity, ApiTags } from '@nestjs/swagger'

import {
  ApiScopeUser,
  ApiScopeUserDTO,
  MeTenantGuard,
  ResourceAccessService,
} from '@island.is/auth-api-lib'
import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
  User,
} from '@island.is/auth-nest-tools'
import { AdminPortalScope } from '@island.is/auth/scopes'
import { Audit, AuditService } from '@island.is/nest/audit'
import { Documentation } from '@island.is/nest/swagger'

import { UpdateScopeUsersDto } from './dto/update-scope-users.dto'

const namespace = '@island.is/auth/admin-api/v2/scope-users'

@UseGuards(IdsUserGuard, ScopesGuard, MeTenantGuard)
@Scopes(AdminPortalScope.idsAdminSuperUser)
@ApiSecurity('ias', [AdminPortalScope.idsAdminSuperUser])
@ApiTags('admin')
@Controller({
  path: 'me/tenants/:tenantId/scopes/:scopeName/users',
  version: ['2'],
})
@Audit({ namespace })
export class MeScopeUsersController {
  constructor(
    private readonly auditService: AuditService,
    private readonly accessService: ResourceAccessService,
  ) {}

  @Get()
  @Documentation({
    description: 'Get all users with access to a specific scope.',
    response: { status: 200, type: [ApiScopeUser] },
  })
  @Audit<ApiScopeUser[]>({
    resources: (users) => users.map((user) => user.nationalId),
  })
  findUsersByScope(
    @Param('tenantId') _tenantId: string,
    @Param('scopeName') scopeName: string,
  ): Promise<ApiScopeUser[]> {
    return this.accessService.findUsersByScope(scopeName)
  }

  @Post()
  @Documentation({
    description:
      'Create a new API scope user with access to a specific scope.',
    response: { status: 201, type: ApiScopeUser },
  })
  @Audit<ApiScopeUser>({
    resources: (user) => user?.nationalId,
    alsoLog: true,
  })
  create(
    @Param('tenantId') _tenantId: string,
    @Param('scopeName') scopeName: string,
    @Body() input: ApiScopeUserDTO,
  ): Promise<ApiScopeUser> {
    return this.accessService.create({
      ...input,
      userAccess: [
        ...(input.userAccess ?? []),
        { nationalId: input.nationalId, scope: scopeName },
      ],
    })
  }

  @Patch()
  @Documentation({
    description:
      'Update the user access list for a specific scope by adding/removing users.',
    response: { status: 200 },
  })
  async updateScopeUsers(
    @CurrentUser() user: User,
    @Param('tenantId') _tenantId: string,
    @Param('scopeName') scopeName: string,
    @Body() input: UpdateScopeUsersDto,
  ): Promise<void> {
    await this.auditService.auditPromise(
      {
        namespace,
        auth: user,
        action: 'updateScopeUsers',
        resources: scopeName,
        alsoLog: true,
        meta: {
          added: input.addedNationalIds,
          removed: input.removedNationalIds,
        },
      },
      this.accessService.updateScopeUsers(
        scopeName,
        input.addedNationalIds,
        input.removedNationalIds,
      ),
    )
  }
}
