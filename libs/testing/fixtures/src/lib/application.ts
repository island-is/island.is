import {
  Application,
  ApplicationStatus,
  ApplicationTypes,
} from '@island.is/application/core'
import * as faker from 'faker'

export const createApplication = (
  overrides?: Partial<Application>,
): Application => ({
  applicant: faker.helpers.replaceSymbolWithNumber('##########'),
  answers: {},
  assignees: [],
  attachments: {},
  created: new Date(),
  modified: new Date(),
  externalData: {},
  id: faker.random.word(),
  state: 'DRAFT',
  typeId: ApplicationTypes.EXAMPLE,
  name: '',
  status: ApplicationStatus.IN_PROGRESS,
  ...overrides,
})
