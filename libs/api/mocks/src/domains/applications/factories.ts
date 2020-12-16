import { Application } from '../../types'
import {
  factory,
  slugify,
  simpleFactory,
  faker,
  title,
} from '@island.is/shared/mocking'
import { SystemMetadata } from '@island.is/shared/types'

export const application = factory<Application>({
  id: faker.random.uuid(),
  created: faker.date.past().toISOString(),
  modified: faker.date.past().toISOString(),
  applicant: faker.random.alphaNumeric(10),
  assignees: [],
  state: 'someState',
  typeId: 'ExampleForm',
  answers: [],
  externalData: {},
})
