import { UseGuards } from '@nestjs/common'
import { Args, Parent, ResolveField, Resolver } from '@nestjs/graphql'

import { IdsUserGuard } from '@island.is/auth-nest-tools'
import { Loader } from '@island.is/nest/dataloader'

import { DomainLoader } from '../loaders/domain.loader'
import type { DomainDataLoader } from '../loaders/domain.loader'
import { Client } from '../models/client.model'
import { Domain } from '../models/domain.model'

@UseGuards(IdsUserGuard)
@Resolver(() => Client)
export class ClientResolver {
  @ResolveField('domain', () => Domain, { nullable: true })
  async resolveDomain(
    @Loader(DomainLoader) domainLoader: DomainDataLoader,
    @Parent() client: Client,
    @Args('lang', { type: () => String, nullable: true, defaultValue: 'is' })
    lang: string,
  ): Promise<Domain | null> {
    if (client.domainName) {
      return domainLoader.load({
        lang,
        domain: client.domainName,
      })
    }

    return null
  }
}
