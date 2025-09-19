import { application } from './factories'
import { createStore, faker } from '@island.is/shared/mocking'

export const store = createStore(() => {
  faker.seed(100)

  const applications = application
    .list(30)
    .concat([application({ applicant: '0000000000' })])
    .concat([application({ applicant: '0000000000', typeId: 'ParentalLeave' })])

  return { applications }
})
