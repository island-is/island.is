import {
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  VERSION_NEUTRAL,
} from '@nestjs/common'
import { Documentation } from '@island.is/nest/swagger'
import { AuditService } from '@island.is/nest/audit'
import {
  IdentityConfirmationDTO,
  IdentityConfirmationService,
} from '@island.is/auth-api-lib'
import { ApiTags } from '@nestjs/swagger'
import {
  CurrentUser,
  IdsAuthGuard,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import type { User } from '@island.is/auth-nest-tools'

const namespace = '@island.is/auth/confirm-identity'

@Scopes('@identityserver.api/authentication')
@ApiTags('confirm-identity')
@Controller({
  path: 'confirm-identity',
  version: ['1', VERSION_NEUTRAL],
})
export class ConfirmIdentityController {
  constructor(
    private readonly auditService: AuditService,
    private readonly identityConfirmationService: IdentityConfirmationService,
  ) {}

  @Post(':id')
  @UseGuards(IdsUserGuard, ScopesGuard)
  @Documentation({
    response: {
      status: 200,
    },
  })
  async confirmIdentity(@Param('id') id: string, @CurrentUser() user: User) {
    await this.auditService.auditPromise<void>(
      {
        system: true,
        namespace,
        action: 'confirmIdentity',
        meta: {
          userNationalId: user.nationalId,
        },
      },
      this.identityConfirmationService.confirmIdentity(user, id),
    )
  }

  @Get(':id')
  @UseGuards(IdsAuthGuard, ScopesGuard)
  @Documentation({
    response: {
      status: 200,
      type: IdentityConfirmationDTO,
    },
    request: {
      params: {
        id: {
          required: true,
          description: 'The id of the identity confirmation',
        },
      },
    },
  })
  async getIdentityConfirmation(@Param('id') id: string) {
    return this.auditService.auditPromise<IdentityConfirmationDTO>(
      {
        system: true,
        namespace,
        action: 'getIdentityConfirmation',
        meta: {
          id: id,
        },
        resources: (res) => {
          return `${res}`
        },
      },
      this.identityConfirmationService.getIdentityConfirmation(id),
    )
  }
}
