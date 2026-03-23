import { InjectQueue } from '@nestjs/bull'
import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Headers,
  Inject,
  Post,
  Query,
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
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { Audit } from '@island.is/nest/audit'
import { Documentation } from '@island.is/nest/swagger'

import { sessionJobName, sessionsQueueName } from '../sessions.config'
import { CreateSessionDto } from './create-session.dto'
import { SessionsQueryDto } from './sessions-query.dto'
import { SessionsResultDto } from './sessions-result.dto'
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
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
    @InjectQueue(sessionsQueueName)
    private readonly sessionsQueue: Queue,
  ) {}

  @Get()
  @Documentation({
    description: 'Get all sessions for the authenticated user.',
    response: { status: 200, type: SessionsResultDto },
    request: {
      header: {
        'X-Query-OtherUser': {
          description: 'The identifier of a user associated with a session.',
          required: false,
          schema: {
            type: 'string',
            pattern: '^\\d{10}$',
          },
        },
      },
    },
  })
  @Scopes(ApiScope.internal, ApiScope.internalProcuring)
  @Audit<SessionsResultDto>({
    resources: (result) => result.data.map((session) => session.id),
  })
  findAll(
    @CurrentUser() user: User,
    @Query() query: SessionsQueryDto,
    @Headers('X-Query-OtherUser') otherUser?: string,
  ): Promise<SessionsResultDto> {
    return this.sessionsService.findAll(user, query, otherUser)
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

    this.sessionsQueue.add(sessionJobName, session).then((job) => {
      this.logger.debug(`Added job ${job.id} to queue.`)
    })
  }
}
