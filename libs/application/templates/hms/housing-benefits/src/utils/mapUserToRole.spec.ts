import { Application } from '@island.is/application/types'
import { Roles } from './constants'
import { mapUserToRole } from './mapUserToRole'

const APPLICANT_ID = '0101303019'

const createApplication = (overrides: Partial<Application> = {}): Application =>
  ({
    id: 'app-id',
    applicant: APPLICANT_ID,
    assignees: [],
    answers: {},
    externalData: {},
    ...overrides,
  } as Application)

describe('mapUserToRole', () => {
  it('maps the real applicant to APPLICANT', () => {
    expect(mapUserToRole(APPLICANT_ID, createApplication())).toBe(
      Roles.APPLICANT,
    )
  })
})
