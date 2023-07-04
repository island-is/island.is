import { UseGuards } from '@nestjs/common'
import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'

import { Client, ClientLoader } from '@island.is/api/domains/auth'
import type { ClientDataLoader } from '@island.is/api/domains/auth'
import { Identity, IdentityLoader } from '@island.is/api/domains/identity'
import type { IdentityDataLoader } from '@island.is/api/domains/identity'
import { CurrentUser, IdsUserGuard } from '@island.is/auth-nest-tools'
import type { User } from '@island.is/auth-nest-tools'
import {
  SessionsResultDto,
  Session as SessionDto,
} from '@island.is/clients/sessions'
import { Loader } from '@island.is/nest/dataloader'

import { Session } from './models/session.model'
import { SessionsService } from './services/sessions.service'
import { PaginatedSessionResponse } from './dto/paginated-session.response'
import { SessionsInput } from './dto/sessions.input'

@UseGuards(IdsUserGuard)
@Resolver(() => Session)
export class SessionsResolver {
  constructor(private readonly sessionsService: SessionsService) {}

  @Query(() => PaginatedSessionResponse, { name: 'sessionsList' })
  getSessions(
    @CurrentUser() user: User,
    @Args('input') input: SessionsInput,
  ): Promise<SessionsResultDto> {
    return this.sessionsService.getSessions(user, input)
  }

  @ResolveField('actor', () => Identity)
  resolveActor(
    @Loader(IdentityLoader) identityLoader: IdentityDataLoader,
    @Parent() session: SessionDto,
  ) {
    return identityLoader.load(session.actorNationalId)
  }

  @ResolveField('subject', () => Identity)
  resolveSubject(
    @Loader(IdentityLoader) identityLoader: IdentityDataLoader,
    @Parent() session: SessionDto,
  ) {
    return identityLoader.load(session.subjectNationalId)
  }

  @ResolveField('client', () => Client)
  resolveClient(
    @Loader(ClientLoader) clientLoader: ClientDataLoader,
    @Parent() session: SessionDto,
    @Args('lang', { type: () => String, nullable: true, defaultValue: 'is' })
    lang: string,
  ) {
    return clientLoader.load({ lang, clientId: session.clientId })
  }
}
