import {
  Application,
  InstitutionNationalIds,
} from '@island.is/application/types'
import { isRunningOnEnvironment } from '@island.is/shared/utils'
import * as kennitala from 'kennitala'
import { DEV_INSTITUTION_TESTER_NATIONAL_ID, Roles } from './constants'
import { mapUserToRole } from './mapUserToRole'

jest.mock('@island.is/shared/utils', () => {
  const actual = jest.requireActual('@island.is/shared/utils')
  return {
    ...actual,
    isRunningOnEnvironment: jest.fn((environment: string) =>
      actual.isRunningOnEnvironment(environment),
    ),
  }
})

const HMS_NATIONAL_ID = kennitala.sanitize(
  InstitutionNationalIds.HUSNAEDIS_OG_MANNVIRKJASTOFNUN,
)
const TESTER_NATIONAL_ID = kennitala.sanitize(
  DEV_INSTITUTION_TESTER_NATIONAL_ID,
)
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
  afterEach(() => {
    const actual = jest.requireActual('@island.is/shared/utils')
    jest
      .mocked(isRunningOnEnvironment)
      .mockImplementation((environment) =>
        actual.isRunningOnEnvironment(environment),
      )
  })

  it('maps HMS kennitala to INSTITUTION on production', () => {
    jest
      .mocked(isRunningOnEnvironment)
      .mockImplementation((environment) => environment === 'production')

    expect(mapUserToRole(HMS_NATIONAL_ID, createApplication())).toBe(
      Roles.INSTITUTION,
    )
  })

  it('maps the tester to INSTITUTION off production', () => {
    expect(mapUserToRole(TESTER_NATIONAL_ID, createApplication())).toBe(
      Roles.INSTITUTION,
    )
  })

  it('does not map the tester to INSTITUTION on production even if listed as assignee', () => {
    jest
      .mocked(isRunningOnEnvironment)
      .mockImplementation((environment) => environment === 'production')

    const role = mapUserToRole(
      TESTER_NATIONAL_ID,
      createApplication({ assignees: [TESTER_NATIONAL_ID] }),
    )

    expect(role).not.toBe(Roles.INSTITUTION)
    expect(role).toBe(Roles.UNSIGNED_PREREQ_ASSIGNEE)
  })

  it('maps the real applicant to APPLICANT', () => {
    jest
      .mocked(isRunningOnEnvironment)
      .mockImplementation((environment) => environment === 'production')

    expect(mapUserToRole(APPLICANT_ID, createApplication())).toBe(
      Roles.APPLICANT,
    )
  })
})
