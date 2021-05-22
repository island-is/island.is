import { Injectable } from '@nestjs/common'
import * as faker from 'faker'

@Injectable()
export class NationalRegistryApiMock {
  async getUser(input: string) {
    return Promise.resolve({
      Fulltnafn: `${faker.name.firstName()} ${faker.name.lastName()}`,
      Logheimili: faker.address.streetAddress(),
      LogheimiliSveitarfelag: faker.address.county(),
      Postnr: faker.phone.phoneNumber('###'),
    })
  }
}
