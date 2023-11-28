import { factory, faker } from '@island.is/shared/mocking'
import {
  ApplicationStatus,
  DataProviderResult,
} from '@island.is/application/types'

import { Application, ApplicationForm } from '../../types'
/*
export const application = factory<Application>({
  id: () => faker.datatype.uuid(),
  created: () => faker.date.past().toISOString(),
  modified: () => faker.date.past().toISOString(),
  applicant: () => faker.random.alphaNumeric(10),
  assignees: [],
  applicantActors: [],
  state: 'draft',
  typeId: 'ExampleForm',
  answers: [],
  externalData: {},
  status: ApplicationStatus.IN_PROGRESS,
  form: new ApplicationForm(),
})
*/
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
