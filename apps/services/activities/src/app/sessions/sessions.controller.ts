import { Controller, Get, UseGuards } from '@nestjs/common'
import { ApiSecurity, ApiTags } from '@nestjs/swagger'

import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
  User,
} from '@island.is/auth-nest-tools'
import { Audit } from '@island.is/nest/audit'
import { Documentation } from '@island.is/nest/swagger'

import { Session } from './session.model'
import { SessionsService } from './sessions.service'

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes()
@ApiSecurity('ias')
@ApiTags('sessions')
@Controller({
  path: 'activities/sessions',
  version: ['1'],
})
@Audit({ namespace: '@island.is/activities/sessions' })
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Get()
  @Documentation({
    description: 'Get all session activity for the authenticated user.',
    response: { status: 200, type: [Session] },
  })
  @Audit<Session[]>({
    resources: (sessions) => sessions.map((session) => session.id),
  })
  findAll(@CurrentUser() user: User) {
    return this.sessionsService.findAll(user)
  }
}
