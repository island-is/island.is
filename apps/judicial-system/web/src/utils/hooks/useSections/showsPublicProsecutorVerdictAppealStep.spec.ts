import { Feature } from '@island.is/judicial-system/types'
import type { WorkingCase } from '@island.is/judicial-system-web/src/components'
import {
  AppealCaseState,
  AppealCaseType,
  CaseType,
  InstitutionType,
  UserRole,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { showsPublicProsecutorVerdictAppealStep } from '@island.is/judicial-system-web/src/utils/hooks/useSections'
import { mockUser } from '@island.is/judicial-system-web/src/utils/mocks'

describe('showsPublicProsecutorVerdictAppealStep', () => {
  const staff = mockUser(UserRole.PUBLIC_PROSECUTOR_STAFF)

  const theCase = (
    overrides: Partial<Pick<WorkingCase, 'type' | 'verdictAppealCase'>> = {},
  ) =>
    ({
      type: CaseType.INDICTMENT,
      verdictAppealCase: {
        id: 'verdict_appeal_id',
        appealType: AppealCaseType.VERDICT,
        appealState: AppealCaseState.APPEALED,
      },
      ...overrides,
    } as Pick<WorkingCase, 'type' | 'verdictAppealCase'>)

  const enabled = [Feature.INDICTMENT_APPEAL]

  it('shows the step to staff on a verdict appeal', () => {
    expect(
      showsPublicProsecutorVerdictAppealStep(theCase(), staff, enabled),
    ).toBe(true)
  })

  it('hides the step while the feature is hidden', () => {
    expect(showsPublicProsecutorVerdictAppealStep(theCase(), staff, [])).toBe(
      false,
    )
  })

  it('hides the step when the verdict has not been appealed', () => {
    expect(
      showsPublicProsecutorVerdictAppealStep(
        theCase({ verdictAppealCase: null }),
        staff,
        enabled,
      ),
    ).toBe(false)
  })

  it('shows the step to a prosecutor at the public prosecutor office', () => {
    const publicProsecutor = mockUser(UserRole.PROSECUTOR)
    publicProsecutor.institution = {
      ...publicProsecutor.institution!,
      type: InstitutionType.PUBLIC_PROSECUTORS_OFFICE,
    }

    expect(
      showsPublicProsecutorVerdictAppealStep(
        theCase(),
        publicProsecutor,
        enabled,
      ),
    ).toBe(true)
  })

  it.each([
    UserRole.PROSECUTOR,
    UserRole.DEFENDER,
    UserRole.DISTRICT_COURT_JUDGE,
    UserRole.COURT_OF_APPEALS_JUDGE,
  ])('hides the step from %s outside the public prosecutor office', (role) => {
    expect(
      showsPublicProsecutorVerdictAppealStep(
        theCase(),
        mockUser(role),
        enabled,
      ),
    ).toBe(false)
  })

  it('hides the step without a user', () => {
    expect(
      showsPublicProsecutorVerdictAppealStep(theCase(), undefined, enabled),
    ).toBe(false)
  })

  it('hides the step on a request case', () => {
    expect(
      showsPublicProsecutorVerdictAppealStep(
        theCase({ type: CaseType.CUSTODY }),
        staff,
        enabled,
      ),
    ).toBe(false)
  })

  it('shows the step while staff are registering an appeal, even before one exists', () => {
    expect(
      showsPublicProsecutorVerdictAppealStep(
        theCase({ verdictAppealCase: null }),
        staff,
        enabled,
        true,
      ),
    ).toBe(true)
  })

  it('hides the step when the verdict appeal has been withdrawn', () => {
    expect(
      showsPublicProsecutorVerdictAppealStep(
        theCase({
          verdictAppealCase: {
            id: 'verdict_appeal_id',
            appealType: AppealCaseType.VERDICT,
            appealState: AppealCaseState.WITHDRAWN,
          },
        }),
        staff,
        enabled,
      ),
    ).toBe(false)
  })

  it('shows the step while re-registering over a withdrawn appeal', () => {
    expect(
      showsPublicProsecutorVerdictAppealStep(
        theCase({
          verdictAppealCase: {
            id: 'verdict_appeal_id',
            appealType: AppealCaseType.VERDICT,
            appealState: AppealCaseState.WITHDRAWN,
          },
        }),
        staff,
        enabled,
        true,
      ),
    ).toBe(true)
  })
})
