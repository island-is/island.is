import { Resolver, Query } from '@nestjs/graphql'
import { CurrentUser, IdsUserGuard } from '@island.is/auth-nest-tools'
import { UseGuards } from '@nestjs/common'
import { PartyLetterRegistry } from './models/partyLetterRegistry.model'
import { PartyLetterRegistryService } from './partyLetterRegistry.service'
import type { User } from '@island.is/auth-nest-tools'

@UseGuards(IdsUserGuard)
@Resolver('PartyLetterRegistryResolver')
export class PartyLetterRegistryResolver {
  constructor(private partyLetterRegistryService: PartyLetterRegistryService) {}

  @Query(() => PartyLetterRegistry, { nullable: true })
  async partyLetterRegistryFindLetter(
    @CurrentUser() auth: User,
  ): Promise<PartyLetterRegistry> {
    return this.partyLetterRegistryService.partyLetterRegistryControllerFindByManager(
      auth,
    )
  }
}
