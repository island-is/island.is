import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  Post,
  UseGuards,
} from '@nestjs/common'
import { ApiSecurity, ApiTags } from '@nestjs/swagger'
import { InjectQueue } from '@nestjs/bull'
import { Queue } from 'bull'

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
import { CreateSessionDto } from './create-session.dto'
import { ActivitiesScope } from '@island.is/auth/scopes'
import { activitiesQueueName, sessionJobName } from '../activities.config'

@UseGuards(IdsUserGuard, ScopesGuard)
@ApiSecurity('ias')
@ApiTags('sessions')
@Controller({
  path: 'activities/sessions',
  version: ['1'],
})
@Audit({ namespace: '@island.is/activities/sessions' })
export class SessionsController {
  constructor(
    private readonly sessionsService: SessionsService,
    @InjectQueue(activitiesQueueName) private readonly activitiesQueue: Queue,
  ) {}

  @Get()
  @Documentation({
    description: 'Get all session activity for the authenticated user.',
    response: { status: 200, type: [Session] },
  })
  @Scopes(ActivitiesScope.main)
  @Audit<Session[]>({
    resources: (sessions) => sessions.map((session) => session.id),
  })
  findAll(@CurrentUser() user: User) {
    return this.sessionsService.findAll(user)
  }

  @Post()
  @Documentation({
    description: 'Register a session activity.',
    response: { status: 202 },
  })
  @Scopes(ActivitiesScope.sessionsWrite)
  create(@CurrentUser() user: User, @Body() session: CreateSessionDto) {
    const authenticatedUserNationalId =
      user.actor?.nationalId ?? user.nationalId

    if (session.actorNationalId !== authenticatedUserNationalId)
      throw new ForbiddenException(
        'Sessions can only be registered for the authenticated user.',
      )

    this.activitiesQueue.add(sessionJobName, session)
  }
}
