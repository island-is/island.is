import { Query, Resolver } from '@nestjs/graphql'
import {
  CurrentUser,
  IdsUserGuard,
} from '@island.is/auth-nest-tools'
import { UseGuards } from '@nestjs/common'
import { TemporaryVoterRegistry } from './models/temporaryVoterRegistry.model'
import { TemporaryVoterRegistryService } from './temporaryVoterRegistry.service'
import { VoterRegistry } from '../../gen/fetch'
import type { User } from '@island.is/auth-nest-tools'

@UseGuards(IdsUserGuard)
@Resolver('TemporaryVoterRegistryResolver')
export class TemporaryVoterRegistryResolver {
  constructor (
    private temporaryVoterRegistryService: TemporaryVoterRegistryService,
  ) {}

  @Query(() => TemporaryVoterRegistry, { nullable: true })
  async temporaryVoterRegistryGetVoterRegion (
    @CurrentUser() auth: User,
  ): Promise<VoterRegistry> {
    return this.temporaryVoterRegistryService.temporaryVoterRegistryControllerFindByAuth(
      auth,
    )
  }
}
