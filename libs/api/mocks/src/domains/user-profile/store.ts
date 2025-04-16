import { createStore, faker } from '@island.is/shared/mocking'

export const store = createStore(() => {
  const userProfileDeviceToken = {
    id: faker.random.uuid(),
    nationalId: faker.random
      .number({ min: 1000000000, max: 9999999999 })
      .toString(),
    deviceToken: faker.random.uuid(),
    created: faker.date.past(),
    modified: faker.date.recent(),
  }
  return { userProfileDeviceToken }
})
