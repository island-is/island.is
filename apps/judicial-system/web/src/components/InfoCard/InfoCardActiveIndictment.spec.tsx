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

import InfoCardActiveIndictment from './InfoCardActiveIndictment'

const renderActiveIndictment = (
  theCase: Case,
  userRole: UserRole = UserRole.DISTRICT_COURT_JUDGE,
) =>
  render(
    <IntlProviderWrapper>
      <UserContextWrapper userRole={userRole}>
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

  test('links merged-from court case numbers for defenders', async () => {
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

    renderActiveIndictment(theCase, UserRole.DEFENDER)

    const link = await screen.findByRole('link', { name: 'S-12/2026' })

    expect(link).toHaveAttribute(
      'href',
      `${ROUTE_HANDLER_ROUTE}/merged-from-id`,
    )
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
})
