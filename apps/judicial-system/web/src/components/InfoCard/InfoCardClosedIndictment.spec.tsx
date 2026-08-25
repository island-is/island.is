import { render, screen } from '@testing-library/react'

import { ROUTE_HANDLER_ROUTE } from '@island.is/judicial-system/consts'
import {
  Case,
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
      mergeCase: { courtCaseNumber: 'S-64/2026' },
    }

    renderClosedIndictment(theCase)

    await screen.findByText('S-64/2026')
    expect(screen.queryByRole('link', { name: 'S-64/2026' })).toBeNull()
  })
})
