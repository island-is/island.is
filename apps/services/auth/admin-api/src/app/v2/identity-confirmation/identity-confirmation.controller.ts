import { Body, Controller, Post, UseGuards } from '@nestjs/common'

import {
  BypassAuth,
  IdsUserGuard,
  ZendeskAuthGuard,
} from '@island.is/auth-nest-tools'
import { Documentation } from '@island.is/nest/swagger'
import { AuditService } from '@island.is/nest/audit'

import env from '../../../environments/environment'
import {
  IdentityConfirmationInputDto,
  IdentityConfirmationService,
} from '@island.is/auth-api-lib'

const namespace = '@island.is/auth/identity-confirmation'

@UseGuards(IdsUserGuard)
@Controller({ path: 'identity-confirmation', version: ['1'] })
export class IdentityConfirmationController {
  constructor(
    private readonly identityConfirmationService: IdentityConfirmationService,
    private readonly auditService: AuditService,
  ) {}

  @BypassAuth()
  @UseGuards(new ZendeskAuthGuard(env.zendeskIdentityConfirmationSecret))
  @Post()
  @Documentation({
    response: {
      status: 200,
    },
  })
  async identityConfirmation(@Body() body: IdentityConfirmationInputDto) {
    await this.auditService.auditPromise<string>(
      {
        system: true,
        namespace,
        action: 'identityConfirmation',
        meta: {
          id: body.id,
          type: body.type,
        },
        resources: (res) => {
          return `${res}`
        },
      },
      this.identityConfirmationService.identityConfirmation(body),
    )
  }
}
