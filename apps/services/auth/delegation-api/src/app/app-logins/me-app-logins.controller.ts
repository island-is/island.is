import {
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import {
  AppLoginDto,
  DeviceRegistrationsService,
} from '@island.is/auth-api-lib'
import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
  User,
} from '@island.is/auth-nest-tools'
import { ApiScope } from '@island.is/auth/scopes'
import { Audit, AuditService } from '@island.is/nest/audit'
import {
  FeatureFlag,
  FeatureFlagGuard,
  Features,
} from '@island.is/nest/feature-flags'
import { Documentation } from '@island.is/nest/swagger'
import type { DocumentationParamOptions } from '@island.is/nest/swagger'

const namespace = '@island.is/auth/delegation-api/me/app-logins'

const id: DocumentationParamOptions = {
  required: true,
  type: 'string',
  format: 'uuid',
  description: 'The id of the app login.',
}

// A person's own app logins: not while acting for someone else.
const assertNotActor = (user: User) => {
  if (user.actor) {
    throw new ForbiddenException()
  }
}

@UseGuards(IdsUserGuard, ScopesGuard, FeatureFlagGuard)
@Scopes(ApiScope.internal)
@ApiTags('me/app-logins')
@FeatureFlag(Features.isMyPagesAppLoginsEnabled)
@Controller({
  path: 'me/app-logins',
  version: ['1'],
})
@Audit({ namespace })
export class MeAppLoginsController {
  constructor(
    private readonly deviceRegistrationsService: DeviceRegistrationsService,
    private readonly auditService: AuditService,
  ) {}

  @Get()
  @Documentation({
    description: "Gets the current user's app logins.",
    response: { status: 200, type: [AppLoginDto] },
  })
  @Audit<AppLoginDto[]>({
    resources: (appLogins) => appLogins.map((appLogin) => appLogin.id),
  })
  findAll(@CurrentUser() user: User): Promise<AppLoginDto[]> {
    assertNotActor(user)

    return this.deviceRegistrationsService.findAllForUser(user.nationalId)
  }

  @Delete(':id')
  @HttpCode(204)
  @Documentation({
    description:
      'Removes one of the current user app logins, which logs the app out.',
    request: { params: { id } },
    response: { status: 204 },
  })
  async delete(
    @CurrentUser() user: User,
    @Param('id', new ParseUUIDPipe()) appLoginId: string,
  ): Promise<void> {
    assertNotActor(user)

    const deleted = await this.auditService.auditPromise(
      {
        auth: user,
        namespace,
        action: 'delete',
        resources: appLoginId,
        meta: (deleted: boolean) => ({ deleted }),
      },
      this.deviceRegistrationsService.deleteForUser(
        user.nationalId,
        appLoginId,
      ),
    )

    if (!deleted) {
      throw new NotFoundException()
    }
  }
}
