import { render, screen } from '@testing-library/react'

import { ROUTE_HANDLER_ROUTE } from '@island.is/judicial-system/consts'
import type { Case } from '@island.is/judicial-system-web/src/graphql/schema'
import {
  CaseType,
  UserRole,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { mockCase } from '@island.is/judicial-system-web/src/utils/mocks'
import {
  FormContextWrapper,
  IntlProviderWrapper,
  UserContextWrapper,
} from '@island.is/judicial-system-web/src/utils/testHelpers'

import InfoCardClosedIndictment from './InfoCardClosedIndictment'

const DEFENDER_NATIONAL_ID = '1234567890'

// The Court of Appeals opens one row per appeal, naming it in the query string.
// Without a router the resolver falls back to the case level appeal, which is
// the very thing these tests are about.
let mockAppealCaseIdQuery: string | undefined

jest.mock('next/router', () => ({
  useRouter() {
    return { pathname: '', query: { appealCaseId: mockAppealCaseIdQuery } }
  },
}))

const renderClosedIndictment = (
  theCase: Case,
  userRole: UserRole = UserRole.PROSECUTOR,
  nationalId?: string,
) =>
  render(
    <IntlProviderWrapper>
      <UserContextWrapper userRole={userRole} nationalId={nationalId}>
        <FormContextWrapper theCase={theCase}>
          <InfoCardClosedIndictment />
        </FormContextWrapper>
      </UserContextWrapper>
    </IntlProviderWrapper>,
  )

describe('InfoCardClosedIndictment', () => {
  beforeEach(() => {
    mockAppealCaseIdQuery = undefined
  })

  // A ruling order appeal is a proceeding of its own: its own case number,
  // assistant and judges. The card used to read all three off the case level
  // appeal, so a case carrying both showed one appeal's number beside the
  // other's conclusion.
  describe('the Court of Appeals section', () => {
    const caseLevelAppeal = {
      id: 'case-level-appeal',
      appealCaseNumber: 'L-100/2026',
      appealAssistant: { name: 'Case Level Assistant' },
      appealJudge1: { name: 'Case Level Judge One' },
      appealJudge2: { name: 'Case Level Judge Two' },
      appealJudge3: { name: 'Case Level Judge Three' },
    }

    const rulingOrderAppeal = {
      id: 'ruling-order-appeal',
      appealCaseNumber: 'L-200/2026',
      appealAssistant: { name: 'Ruling Order Assistant' },
      appealJudge1: { name: 'Ruling Order Judge One' },
      appealJudge2: { name: 'Ruling Order Judge Two' },
      appealJudge3: { name: 'Ruling Order Judge Three' },
    }

    const caseWithBothAppeals = () =>
      ({
        ...mockCase(CaseType.INDICTMENT),
        appealCase: caseLevelAppeal,
        rulingOrderAppealCases: [rulingOrderAppeal],
      } as unknown as Case)

    it('shows the appeal named in the query string, not the case level one', async () => {
      mockAppealCaseIdQuery = 'ruling-order-appeal'

      renderClosedIndictment(caseWithBothAppeals())

      await screen.findByText('L-200/2026')
      expect(screen.queryByText('L-100/2026')).toBeNull()
      await screen.findByText('Ruling Order Assistant')
      expect(screen.queryByText('Case Level Assistant')).toBeNull()
      await screen.findByText('Ruling Order Judge One')
      expect(screen.queryByText('Case Level Judge One')).toBeNull()
    })

    it('still shows the case level appeal when the query string names none', async () => {
      renderClosedIndictment(caseWithBothAppeals())

      await screen.findByText('L-100/2026')
      expect(screen.queryByText('L-200/2026')).toBeNull()
    })

    // The other half of the bug: the section itself was gated on the case level
    // appeal, so a ruling order appeal on a case that never had one showed no
    // Court of Appeals details at all.
    it('shows the section for a ruling order appeal on a case with no case level appeal', async () => {
      mockAppealCaseIdQuery = 'ruling-order-appeal'

      renderClosedIndictment({
        ...mockCase(CaseType.INDICTMENT),
        appealCase: null,
        rulingOrderAppealCases: [rulingOrderAppeal],
      } as unknown as Case)

      await screen.findByText('L-200/2026')
    })
  })

  test('links the merged case number when the merge target is in the system', async () => {
    const theCase = {
      ...mockCase(CaseType.INDICTMENT),
      mergeCase: { id: 'merged-into-id', courtCaseNumber: 'S-64/2026' },
    }

    renderClosedIndictment(theCase)

    const link = await screen.findByRole('link', { name: 'S-64/2026' })

    expect(link).toHaveAttribute(
      'href',
      `${ROUTE_HANDLER_ROUTE}/merged-into-id`,
    )
  })

  test('links the merged case number for defenders assigned to the merge target', async () => {
    const theCase = {
      ...mockCase(CaseType.INDICTMENT),
      mergeCase: {
        id: 'merged-into-id',
        courtCaseNumber: 'S-64/2026',
        type: CaseType.INDICTMENT,
        defendants: [
          {
            id: 'defendant-1',
            defenderNationalId: DEFENDER_NATIONAL_ID,
            isDefenderChoiceConfirmed: true,
          },
        ],
      },
    }

    renderClosedIndictment(theCase, UserRole.DEFENDER, DEFENDER_NATIONAL_ID)

    const link = await screen.findByRole('link', { name: 'S-64/2026' })

    expect(link).toHaveAttribute(
      'href',
      `${ROUTE_HANDLER_ROUTE}/merged-into-id`,
    )
  })

  test('does not link the merged case number for defenders not assigned to the merge target', async () => {
    const theCase = {
      ...mockCase(CaseType.INDICTMENT),
      mergeCase: {
        id: 'merged-into-id',
        courtCaseNumber: 'S-64/2026',
        type: CaseType.INDICTMENT,
        defendants: [
          {
            id: 'defendant-1',
            defenderNationalId: '9999999999',
            isDefenderChoiceConfirmed: true,
          },
        ],
      },
    }

    renderClosedIndictment(theCase, UserRole.DEFENDER, DEFENDER_NATIONAL_ID)

    await screen.findByText('S-64/2026')
    expect(screen.queryByRole('link', { name: 'S-64/2026' })).toBeNull()
  })

  test('does not link an external merged case number', async () => {
    const theCase = {
      ...mockCase(CaseType.INDICTMENT),
      mergeCaseNumber: 'S-99/2026',
    }

    renderClosedIndictment(theCase)

    await screen.findByText(/S-99\/2026/)
    expect(screen.queryByRole('link', { name: /S-99\/2026/ })).toBeNull()
  })

  test('does not link an internal merged case number when the merge target has no id', async () => {
    const theCase = {
      ...mockCase(CaseType.INDICTMENT),
      mergeCase: { courtCaseNumber: 'S-64/2026' } as Case,
    }

    renderClosedIndictment(theCase)

    await screen.findByText('S-64/2026')
    expect(screen.queryByRole('link', { name: 'S-64/2026' })).toBeNull()
  })
})
