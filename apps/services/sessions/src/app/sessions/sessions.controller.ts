import { InjectQueue } from '@nestjs/bull'
import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Headers,
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
    @InjectQueue(sessionsQueueName) private readonly sessionsQueue: Queue,
  ) {}

  @Get()
  @Documentation({
    description: 'Get all sessions for the authenticated user.',
    response: { status: 200, type: SessionsResultDto },
    request: {
      query: {
        from: {
          description: 'Only return sessions from this date.',
          required: false,
          type: 'date',
        },
        to: {
          description: 'Only return sessions to this date.',
          required: false,
          type: 'date',
        },
        limit: {
          description: 'Limits the number of results in a request.',
          required: false,
          schema: { type: 'number', default: '10' },
        },
        before: {
          description:
            'The value of `startCursor` from the previous response pageInfo to query the previous page of `limit` number of data items.',
          required: false,
          type: 'string',
        },
        after: {
          description:
            'The value of `endCursor` from the response to query the next page of `limit` number of data items.',
          required: false,
          type: 'string',
        },
        order: {
          description: 'Ordering of the results by timestamp.',
          required: false,
          schema: {
            enum: ['ASC', 'DESC'],
            default: 'DESC',
          },
        },
      },
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

    await this.sessionsQueue.add(sessionJobName, session)
  }
}
