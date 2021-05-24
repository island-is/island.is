import { Resolver, Mutation, Args, Query } from '@nestjs/graphql'
import {
  CurrentUser,
  IdsUserGuard,
  ScopesGuard,
  User,
} from '@island.is/auth-nest-tools'
import { Body, UseGuards } from '@nestjs/common'
import { PartyLetterRegistry } from './models/partyLetterRegistry.model'
import { PartyLetterRegistryService } from './partyLetterRegistry.service'
import { CreatePartyLetterDto } from './dto/create.input'

// TODO: Add correct scopes
@UseGuards(IdsUserGuard, ScopesGuard)
@Resolver('PartyLetterRegistryResolver')
export class PartyLetterRegistryResolver {
  constructor(private partyLetterRegistryService: PartyLetterRegistryService) {}

  @Mutation(() => PartyLetterRegistry, { nullable: true })
  async partyLetterRegistryCreate(
    @CurrentUser() { nationalId }: User, // TODO: Make sure system toke persists original user
    @Args('input') input: CreatePartyLetterDto,
  ): Promise<PartyLetterRegistry> {
    return this.partyLetterRegistryService.partyLetterRegistryControllerCreate({
      ...input,
      owner: nationalId,
    })
  }

  @Query(() => PartyLetterRegistry, { nullable: true })
  async partyLetterRegistryFindLetter(
    @CurrentUser() { nationalId }: User, // TODO: Make sure system token persists original user
  ): Promise<PartyLetterRegistry> {
    return this.partyLetterRegistryService.partyLetterRegistryControllerFindByManager(
      {
        manager: nationalId,
      },
    )
  }
}
