import { Injectable } from '@nestjs/common'
import DataLoader from 'dataloader'

import { IdentityClientService } from '@island.is/clients/identity'
import { NestDataLoader } from '@island.is/nest/dataloader'

import { Identity } from './models/identity.model'

export type IdentityDataLoader = DataLoader<string, Identity>

@Injectable()
export class IdentityLoader implements NestDataLoader<string, Identity> {
  constructor(private readonly identityService: IdentityClientService) {}

  loadIdentities(nationalIds: readonly string[]): Promise<Array<Identity>> {
    return Promise.all(
      nationalIds.map(async (nationalId) => {
        return this.identityService.getIdentityWithFallback(nationalId, {})
      }),
    )
  }

  generateDataLoader(): IdentityDataLoader {
    return new DataLoader(this.loadIdentities.bind(this))
  }
}
