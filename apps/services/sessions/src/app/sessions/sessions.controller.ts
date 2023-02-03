import { InjectQueue } from '@nestjs/bull'
import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Post,
  UseGuards,
} from '@nestjs/common'
import { ApiSecurity, ApiTags } from '@nestjs/swagger'
import { Queue } from 'bull'

import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
  User,
} from '@island.is/auth-nest-tools'
import { ApiScope, SessionsScope } from '@island.is/auth/scopes'
import { Audit } from '@island.is/nest/audit'
import { Documentation } from '@island.is/nest/swagger'

import { sessionJobName, sessionsQueueName } from '../sessions.config'
import { CreateSessionDto } from './create-session.dto'
import { Session } from './session.model'
import { SessionsService } from './sessions.service'

@UseGuards(IdsUserGuard, ScopesGuard)
@ApiSecurity('ias')
@ApiTags('sessions')
@Controller({
  path: 'me/sessions',
  version: ['1'],
})
@Audit({ namespace: '@island.is/sessions' })
export class SessionsController {
  constructor(
    private readonly sessionsService: SessionsService,
    @InjectQueue(sessionsQueueName) private readonly sessionsQueue: Queue,
  ) {}

  @Get()
  @Documentation({
    description: 'Get all sessions for the authenticated user.',
    response: { status: 200, type: [Session] },
  })
  @Scopes(ApiScope.internal, ApiScope.internalProcuring)
  @Audit<Session[]>({
    resources: (sessions) => sessions.map((session) => session.id),
  })
  findAll(@CurrentUser() user: User) {
    return this.sessionsService.findAll(user)
  }

  @Post()
  @Documentation({
    description: 'Register a user session.',
    response: { status: 202 },
  })
  @Scopes(SessionsScope.sessionsWrite)
  async create(
    @CurrentUser() user: User,
    @Body() session: CreateSessionDto,
  ): Promise<void> {
    const authenticatedUserNationalId =
      user.actor?.nationalId ?? user.nationalId

    if (session.actorNationalId !== authenticatedUserNationalId)
      throw new ForbiddenException(
        'Sessions can only be registered for the authenticated user.',
      )

    await this.sessionsQueue.add(sessionJobName, session)
  }
}
