import { Query, Resolver } from '@nestjs/graphql'
import {
  CurrentUser,
  IdsUserGuard,
  ScopesGuard,
  User,
} from '@island.is/auth-nest-tools'
import { UseGuards } from '@nestjs/common'
import { TemporaryVoterRegistryService } from './TemporaryVoterRegistry.service'
import { VoterRegistry } from '../../gen/fetch'
import { TemporaryVoterRegistry } from './models/temporaryVoterRegistry.model'

@UseGuards(IdsUserGuard, ScopesGuard)
@Resolver('TemporaryVoterRegistryResolver')
export class TemporaryVoterRegistryResolver {
  constructor (
    private temporaryVoterRegistryService: TemporaryVoterRegistryService,
  ) {}

  @Query(() => TemporaryVoterRegistry, { nullable: true })
  async temporaryVoterRegistryGetVoterRegion (
    @CurrentUser() { nationalId }: User,
  ): Promise<VoterRegistry> {
    return this.temporaryVoterRegistryService.temporaryVoterRegistryControllerFindOne(
      {
        nationalId,
      },
    )
  }
}
