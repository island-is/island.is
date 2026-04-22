import {
  markEmployersOverviewAutoExpanded,
  resetEmployersOverviewAutoExpandState,
  shouldAutoExpandEmployersOverview,
} from './utils'
import { Employer } from '../../utils/types'

describe('shouldAutoExpandEmployersOverview', () => {
  const applicationId = 'test-application-id'

  beforeEach(() => {
    resetEmployersOverviewAutoExpandState()
  })

  it('returns true on the initial visit when there are no employers', () => {
    expect(shouldAutoExpandEmployersOverview(applicationId, [], [])).toBe(true)
  })

  it('returns false when an unfinished repeater item already exists', () => {
    expect(
      shouldAutoExpandEmployersOverview(applicationId, [{} as Employer], []),
    ).toBe(false)
  })

  it('returns false when there is already a valid employer', () => {
    expect(
      shouldAutoExpandEmployersOverview(
        applicationId,
        [{ email: 'test@example.com' } as Employer],
        [{ email: 'test@example.com' } as Employer],
      ),
    ).toBe(false)
  })

  it('returns false after the empty repeater has already auto-opened once', () => {
    markEmployersOverviewAutoExpanded(applicationId)

    expect(shouldAutoExpandEmployersOverview(applicationId, [], [])).toBe(false)
  })
})
