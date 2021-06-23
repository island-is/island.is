import { Injectable } from '@nestjs/common'
import * as faker from 'faker'

@Injectable()
export class TemporaryVoterRegistryApiMock {
  async voterRegistryControllerFindOne(input: any) {
    return Promise.resolve({
      regionNumber: faker.random.number({ min: 1, max: 6 }),
      regionName: faker.lorem.words(2),
    })
  }
}
