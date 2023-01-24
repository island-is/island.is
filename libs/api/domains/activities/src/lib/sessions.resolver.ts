import {UseGuards} from "@nestjs/common";
import { Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'

import { Client, ClientLoader } from '@island.is/api/domains/auth'
import type { ClientDataLoader } from '@island.is/api/domains/auth'
import { Identity, IdentityLoader } from '@island.is/api/domains/identity'
import type { IdentityDataLoader } from '@island.is/api/domains/identity'
import {CurrentUser, IdsUserGuard} from '@island.is/auth-nest-tools'
import type { User } from '@island.is/auth-nest-tools'
import { Loader } from '@island.is/nest/dataloader'

import { Session } from './models/session.model'
import { SessionsService } from './services/sessions.service'
import { SessionDTO } from './services/types'

@UseGuards(IdsUserGuard)
@Resolver(() => Session)
export class SessionsResolver {
  constructor(private readonly sessionsService: SessionsService) {}

  @Query(() => [Session], { name: 'activitiesSessions' })
  getSessions(@CurrentUser() user: User): Promise<SessionDTO[]> {
    return this.sessionsService.getSessions(user)
  }

  @ResolveField('actor', () => Identity)
  resolveActor(
    @Loader(IdentityLoader) identityLoader: IdentityDataLoader,
    @Parent() session: SessionDTO,
  ) {
    return identityLoader.load(session.actorNationalId)
  }

  @ResolveField('subject', () => Identity)
  resolveSubject(
    @Loader(IdentityLoader) identityLoader: IdentityDataLoader,
    @Parent() session: SessionDTO,
  ) {
    return identityLoader.load(session.subjectNationalId)
  }

  @ResolveField('client', () => Client)
  resolveClient(
    @Loader(ClientLoader) clientLoader: ClientDataLoader,
    @Parent() session: SessionDTO,
  ) {
    return clientLoader.load(session.clientId)
  }
}
