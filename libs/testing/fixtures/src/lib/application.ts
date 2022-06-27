import * as faker from 'faker'
import {
  ApplicationTypes,
  ApplicationStatus,
  ApplicationWithAttachments,
} from '@island.is/application/types'

export const createApplication = (
  overrides?: Partial<ApplicationWithAttachments>,
): ApplicationWithAttachments => ({
  applicant: faker.helpers.replaceSymbolWithNumber('##########'),
  answers: {},
  assignees: [],
  applicantActors: [],
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
