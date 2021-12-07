import { Injectable } from '@nestjs/common'
import * as faker from 'faker'
import type { Auth } from '@island.is/auth-nest-tools'

@Injectable()
export class TemporaryVoterRegistryApiMock {
  withMiddleware(authMiddleware: any) {
    return {
      voterRegistryControllerFindByNationalId: this
        .voterRegistryControllerFindByNationalId,
    }
  }

  async voterRegistryControllerFindByNationalId(input: any) {
    return Promise.resolve({
      regionNumber: faker.datatype.number({ min: 1, max: 6 }),
      regionName: faker.lorem.words(2),
    })
  }
}
