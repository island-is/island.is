import { InstitutionNationalIds } from '@island.is/application/types'
import { isRunningOnEnvironment } from '@island.is/shared/utils'
import * as kennitala from 'kennitala'
import { DEV_INSTITUTION_TESTER_NATIONAL_ID } from './constants'
import { buildInstitutionAssignees } from './institutionAssignees'

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

describe('buildInstitutionAssignees', () => {
  afterEach(() => {
    const actual = jest.requireActual('@island.is/shared/utils')
    jest
      .mocked(isRunningOnEnvironment)
      .mockImplementation((environment) =>
        actual.isRunningOnEnvironment(environment),
      )
  })

  it('includes HMS and the tester off production', () => {
    const result = buildInstitutionAssignees(['0101307789'])

    expect(result).toEqual(
      expect.arrayContaining(['0101307789', HMS_NATIONAL_ID, TESTER_NATIONAL_ID]),
    )
    expect(result).toHaveLength(3)
  })

  it('includes HMS but not the tester on production', () => {
    jest
      .mocked(isRunningOnEnvironment)
      .mockImplementation((environment) => environment === 'production')

    const result = buildInstitutionAssignees(['0101307789'])

    expect(result).toEqual(['0101307789', HMS_NATIONAL_ID])
    expect(result).not.toContain(TESTER_NATIONAL_ID)
  })

  it('strips the tester from existing assignees on production', () => {
    jest
      .mocked(isRunningOnEnvironment)
      .mockImplementation((environment) => environment === 'production')

    const result = buildInstitutionAssignees([
      '0101307789',
      TESTER_NATIONAL_ID,
    ])

    expect(result).toEqual(['0101307789', HMS_NATIONAL_ID])
    expect(result).not.toContain(TESTER_NATIONAL_ID)
  })
})
