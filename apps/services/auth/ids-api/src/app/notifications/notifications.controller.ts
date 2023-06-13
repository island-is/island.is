import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { ApiSecurity, ApiTags } from '@nestjs/swagger'

import {
  CurrentAuth,
  IdsAuthGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import { Audit, AuditService } from '@island.is/nest/audit'
import { Documentation } from '@island.is/nest/swagger'

import { SmsMessage } from './dto/sms-message'
import { NotificationsService } from './notifications.service'

import type { Auth } from '@island.is/auth-nest-tools'
const namespace = '@island.is/auth/ids-api/v1/notifications'

@UseGuards(IdsAuthGuard, ScopesGuard)
@Scopes('@identityserver.api/authentication')
@ApiSecurity('ias', ['@identityserver.api/authentication'])
@ApiTags('notifications')
@Controller({
  path: 'notifications',
  version: ['1'],
})
@Audit({ namespace })
export class NotificationsController {
  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly auditService: AuditService,
  ) {}

  @Post('sms')
  @Documentation({
    description: 'Send a message via SMS.',
    response: { status: 202 },
  })
  sendSms(
    @CurrentAuth() auth: Auth,
    @Body() message: SmsMessage,
  ): Promise<void> {
    return this.auditService.auditPromise(
      {
        auth,
        action: 'sms',
        namespace,
        meta: { toPhoneNumber: message.toPhoneNumber },
      },
      this.notificationsService.sendSms(message),
    )
  }
}
