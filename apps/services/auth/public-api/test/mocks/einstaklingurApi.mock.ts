import { createNationalRegistryUser } from '@island.is/testing/fixtures'
import {
  NationalRegistryClientService,
  IndividualDto,
} from '@island.is/clients/national-registry-v2'

export const createMockEinstaklingurApi = (
  nationalRegistryUser: IndividualDto = createNationalRegistryUser(),
) => {
  class MockNationalRegistryClientService
    implements Partial<NationalRegistryClientService>
  {
    getIndividual() {
      return Promise.resolve(nationalRegistryUser)
    }

    getCustodyChildren() {
      return Promise.resolve([])
    }
  }

  return new MockNationalRegistryClientService()
}
