import { Application } from '@island.is/application/types'
import { Roles } from './constants'
import { mapUserToRole } from './mapUserToRole'
import { assigneeExternalDataKey } from './assigneeUtils'

const APPLICANT_ID = '0101303019'
const ASSIGNEE_ID = '0101304929'

const createApplication = (overrides: Partial<Application> = {}): Application =>
  ({
    id: 'app-id',
    applicant: APPLICANT_ID,
    assignees: [],
    answers: {},
    externalData: {},
    ...overrides,
  } as Application)

const buildAssigneeExternalData = (
  nationalId: string,
  taxReturn: { status: 'success' | 'failure'; data: unknown },
) => ({
  [assigneeExternalDataKey(nationalId, 'assigneeNationalRegistry')]: {
    status: 'success',
    data: { nationalId },
  },
  [assigneeExternalDataKey(nationalId, 'assigneeUserProfile')]: {
    status: 'success',
    data: { email: 'a@b.is' },
  },
  [assigneeExternalDataKey(nationalId, 'assigneeTaxReturn')]: taxReturn,
})

describe('mapUserToRole', () => {
  it('maps the real applicant to APPLICANT', () => {
    expect(mapUserToRole(APPLICANT_ID, createApplication())).toBe(
      Roles.APPLICANT,
    )
  })

  it('keeps assignee as UNSIGNED_PREREQ_ASSIGNEE when the tax return provider failed', () => {
    const application = createApplication({
      assignees: [ASSIGNEE_ID],
      answers: {
        [ASSIGNEE_ID]: { approveExternalData: true },
      },
      externalData: buildAssigneeExternalData(ASSIGNEE_ID, {
        status: 'failure',
        data: {},
      }),
    })

    expect(mapUserToRole(ASSIGNEE_ID, application)).toBe(
      Roles.UNSIGNED_PREREQ_ASSIGNEE,
    )
  })

  it('promotes assignee to UNSIGNED_DRAFT_ASSIGNEE when the tax return provider succeeded and external data was approved', () => {
    const application = createApplication({
      assignees: [ASSIGNEE_ID],
      answers: {
        [ASSIGNEE_ID]: { approveExternalData: true },
      },
      externalData: buildAssigneeExternalData(ASSIGNEE_ID, {
        status: 'success',
        data: { handedInLastYear: true, handedInLastFiveYears: true },
      }),
    })

    expect(mapUserToRole(ASSIGNEE_ID, application)).toBe(
      Roles.UNSIGNED_DRAFT_ASSIGNEE,
    )
  })
})
