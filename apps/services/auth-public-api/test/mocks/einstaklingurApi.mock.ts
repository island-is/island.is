import { Einstaklingsupplysingar } from '@island.is/clients/national-registry-v2'
import { createNationalRegistryUser } from '@island.is/testing/fixtures'

export const createMockEinstaklingurApi = (
  nationalRegistryUser: Einstaklingsupplysingar = createNationalRegistryUser(),
) => {
  class MockEinstaklingarApi {
    withMiddleware() {
      return this
    }

    einstaklingarGetEinstaklingur() {
      return Promise.resolve(nationalRegistryUser)
    }

    einstaklingarGetForsja(): string[] {
      return []
    }
  }

  return new MockEinstaklingarApi()
}
