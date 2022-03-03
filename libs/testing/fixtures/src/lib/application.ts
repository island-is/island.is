import * as faker from 'faker'

import {
  ApplicationStatus,
  ApplicationTypes,
  ApplicationWithAttachments as Application,
} from '@island.is/application/core'

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
