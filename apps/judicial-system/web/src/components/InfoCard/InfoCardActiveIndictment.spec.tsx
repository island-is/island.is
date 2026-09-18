import { render, screen } from '@testing-library/react'

import { ROUTE_HANDLER_ROUTE } from '@island.is/judicial-system/consts'
import type { Case } from '@island.is/judicial-system-web/src/graphql/schema'
import {
  CaseIndictmentRulingDecision,
  CaseState,
  CaseType,
  UserRole,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { mockCase } from '@island.is/judicial-system-web/src/utils/mocks'
import {
  FormContextWrapper,
  IntlProviderWrapper,
  UserContextWrapper,
} from '@island.is/judicial-system-web/src/utils/testHelpers'

import InfoCardActiveIndictment from './InfoCardActiveIndictment'

const DEFENDER_NATIONAL_ID = '1234567890'

const caseWithCancelledDefendant = (): Case => {
  const theCase = mockCase(CaseType.INDICTMENT)

  return {
    ...theCase,
    state: CaseState.COMPLETED,
    defendants: [
      ...(theCase.defendants ?? []),
      {
        id: 'cancelled_defendant_id',
        name: 'Mickey Mouse',
        indictmentCancelledOrDismissedState: {
          type: CaseIndictmentRulingDecision.CANCELLATION,
          time: '2026-01-15T10:00:00.000Z',
        },
      },
    ],
  }
}

const renderActiveIndictment = (
  theCase: Case,
  userRole: UserRole = UserRole.DISTRICT_COURT_JUDGE,
  nationalId?: string,
) =>
  render(
    <IntlProviderWrapper>
      <UserContextWrapper userRole={userRole} nationalId={nationalId}>
        <FormContextWrapper theCase={theCase}>
          <InfoCardActiveIndictment />
        </FormContextWrapper>
      </UserContextWrapper>
    </IntlProviderWrapper>,
  )

describe('InfoCardActiveIndictment', () => {
  test('links court case numbers of cases merged into this case', async () => {
    const theCase = {
      ...mockCase(CaseType.INDICTMENT),
      mergedCases: [
        {
          id: 'merged-from-id',
          courtCaseNumber: 'S-12/2026',
          policeCaseNumbers: ['007-2021-202000'],
        },
      ],
    }

    renderActiveIndictment(theCase)

    const link = await screen.findByRole('link', { name: 'S-12/2026' })

    expect(link).toHaveAttribute(
      'href',
      `${ROUTE_HANDLER_ROUTE}/merged-from-id`,
    )
  })

  test('links merged-from court case numbers for defenders assigned to the merged case', async () => {
    const theCase = {
      ...mockCase(CaseType.INDICTMENT),
      mergedCases: [
        {
          id: 'merged-from-id',
          courtCaseNumber: 'S-12/2026',
          type: CaseType.INDICTMENT,
          policeCaseNumbers: ['007-2021-202000'],
          defendants: [
            {
              id: 'defendant-1',
              defenderNationalId: DEFENDER_NATIONAL_ID,
              isDefenderChoiceConfirmed: true,
            },
          ],
        },
      ],
    }

    renderActiveIndictment(theCase, UserRole.DEFENDER, DEFENDER_NATIONAL_ID)

    const link = await screen.findByRole('link', { name: 'S-12/2026' })

    expect(link).toHaveAttribute(
      'href',
      `${ROUTE_HANDLER_ROUTE}/merged-from-id`,
    )
  })

  test('does not link merged-from court case numbers for defenders not assigned to the merged case', async () => {
    const theCase = {
      ...mockCase(CaseType.INDICTMENT),
      mergedCases: [
        {
          id: 'merged-from-id',
          courtCaseNumber: 'S-12/2026',
          type: CaseType.INDICTMENT,
          policeCaseNumbers: ['007-2021-202000'],
          defendants: [
            {
              id: 'defendant-1',
              defenderNationalId: '9999999999',
              isDefenderChoiceConfirmed: true,
            },
          ],
        },
      ],
    }

    renderActiveIndictment(theCase, UserRole.DEFENDER, DEFENDER_NATIONAL_ID)

    await screen.findByText('S-12/2026')
    expect(screen.queryByRole('link', { name: 'S-12/2026' })).toBeNull()
  })

  test('does not link a merged-from case when it has no court case number', async () => {
    const theCase = {
      ...mockCase(CaseType.INDICTMENT),
      mergedCases: [
        {
          id: 'merged-from-id',
          policeCaseNumbers: ['007-2021-202000'],
        },
      ],
    }

    renderActiveIndictment(theCase)

    await screen.findByRole('heading', { name: 'Ákærði' })
    expect(screen.queryByRole('heading', { name: 'Sameinað úr' })).toBeNull()
    expect(
      document.querySelector(`a[href="${ROUTE_HANDLER_ROUTE}/merged-from-id"]`),
    ).toBeNull()
  })

  test('lists cancelled defendants in their own section for court users', async () => {
    renderActiveIndictment(caseWithCancelledDefendant())

    await screen.findByRole('heading', { name: 'Niðurfelling máls' })
    expect(screen.getByText('Mickey Mouse')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Ákærði' })).toBeInTheDocument()
  })

  test('shows cancelled defendants alongside the others for defenders on completed cases', async () => {
    renderActiveIndictment(
      caseWithCancelledDefendant(),
      UserRole.DEFENDER,
      DEFENDER_NATIONAL_ID,
    )

    await screen.findByRole('heading', { name: 'Ákærðu' })
    expect(
      screen.queryByRole('heading', { name: 'Niðurfelling máls' }),
    ).toBeNull()
  })
})
