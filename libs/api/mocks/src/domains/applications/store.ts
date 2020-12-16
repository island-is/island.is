import { application } from './factories'
import orderBy from 'lodash/orderBy'
import { Article } from '../../types'
import { createStore, faker } from '@island.is/shared/mocking'

export const store = createStore(() => {
  faker.seed(100)

  const applications = application
    .list(10)
    .concat([application({ applicant: '0000000000' })])

  return { applications }
})
