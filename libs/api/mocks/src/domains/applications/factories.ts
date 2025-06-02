import { factory, faker } from '@island.is/shared/mocking'
import {
  ApplicationStatus,
  DataProviderResult,
} from '@island.is/application/types'

import { Application } from '../../types'

const status = [
  'draft',
  'inprogress',
  'completed',
  'rejected',
  'approved',
  'notstarted',
] as ApplicationStatus[]

const names = [
  'Umsókn um fæðingarorlof',
  'Umsókn um atvinnuleyfi',
  'Umsókn um vegabréf',
  'Umsókn um bílpróf',
  'Umsókn um veiðikort',
]

export const application = factory<Application>({
  id: () => faker.datatype.uuid(),
  created: () => faker.date.past().toISOString(),
  modified: () => faker.date.past().toISOString(),
  applicant: () => faker.random.alphaNumeric(10),
  name: () => faker.random.arrayElement(names),
  assignees: [],
  applicantActors: [],
  state: 'draft',
  typeId: 'ExampleCommonActions',
  answers: [],
  externalData: {},
  status: () => faker.random.arrayElement(status),
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
