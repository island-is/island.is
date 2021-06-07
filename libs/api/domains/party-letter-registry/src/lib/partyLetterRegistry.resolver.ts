import { Resolver, Mutation, Args, Query } from '@nestjs/graphql'
import { CurrentUser, IdsUserGuard } from '@island.is/auth-nest-tools'
import { UseGuards } from '@nestjs/common'
import { PartyLetterRegistry } from './models/partyLetterRegistry.model'
import { PartyLetterRegistryService } from './partyLetterRegistry.service'
import { CreatePartyLetterDto } from './dto/create.input'
import type { User } from '@island.is/auth-nest-tools'

@UseGuards(IdsUserGuard)
@Resolver('PartyLetterRegistryResolver')
export class PartyLetterRegistryResolver {
  constructor(private partyLetterRegistryService: PartyLetterRegistryService) {}

  @Mutation(() => PartyLetterRegistry, { nullable: true })
  async partyLetterRegistryCreate(
    @CurrentUser() auth: User,
    @Args('input') input: CreatePartyLetterDto,
  ): Promise<PartyLetterRegistry> {
    return this.partyLetterRegistryService.partyLetterRegistryControllerCreate(
      input,
      auth,
    )
  }

  @Query(() => PartyLetterRegistry, { nullable: true })
  async partyLetterRegistryFindLetter(
    @CurrentUser() auth: User,
  ): Promise<PartyLetterRegistry> {
    return this.partyLetterRegistryService.partyLetterRegistryControllerFindByManager(
      auth,
    )
  }
}
