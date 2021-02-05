import { Application } from '../../types'
import { factory, faker } from '@island.is/shared/mocking'
import type { DataProviderResult } from '@island.is/application/core'

export const application = factory<Application>({
  id: () => faker.random.uuid(),
  created: () => faker.date.past().toISOString(),
  modified: () => faker.date.past().toISOString(),
  applicant: () => faker.random.alphaNumeric(10),
  assignees: [],
  state: 'draft',
  typeId: 'ExampleForm',
  answers: [],
  externalData: {},
})

export const externalData = factory<DataProviderResult>({
  status: 'success',
  data: undefined,
  statusCode: undefined,
  date: () => new Date(),
  reason: undefined,
  $traits: {
    failure: {
      status: 'failure',
      reason: 'Mock error',
    },
    UserProfileProvider: {
      data: () => ({
        email: faker.internet.email(),
        emailVerified: true,
        mobilePhoneNumber: faker.phone.phoneNumber('###-####'),
        mobilePhoneNumberVerified: true,
      }),
    },
    PregnancyStatus: {
      data: () => ({
        hasActivePregnancy: true,
        pregnancyDueDate: faker.date.soon(),
      }),
    },
    ParentalLeaves: {
      data: {},
    },
  },
})
