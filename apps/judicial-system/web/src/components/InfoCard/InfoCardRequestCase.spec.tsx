import { render, screen } from '@testing-library/react'

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

import InfoCardRequestCase from './InfoCardRequestCase'

const renderRequestCase = (
  theCase: Case,
  props: {
    displayRequestDetails?: boolean
    onProsecutorClick?: () => void
  } = {},
) =>
  render(
    <IntlProviderWrapper>
      <UserContextWrapper userRole={UserRole.PROSECUTOR}>
        <FormContextWrapper theCase={theCase}>
          <InfoCardRequestCase {...props} />
        </FormContextWrapper>
      </UserContextWrapper>
    </IntlProviderWrapper>,
  )

describe('InfoCardRequestCase', () => {
  test('shows the requested court date only when request details are displayed', async () => {
    const theCase = {
      ...mockCase(CaseType.CUSTODY),
      requestedCourtDate: '2026-03-02T10:00:00.000Z',
    }

    const { unmount } = renderRequestCase(theCase, {
      displayRequestDetails: true,
    })

    await screen.findByRole('heading', { name: 'Ósk um fyrirtökudag og tíma' })
    unmount()

    renderRequestCase(theCase)

    await screen.findByRole('heading', { name: 'Varnaraðili' })
    expect(
      screen.queryByRole('heading', { name: 'Ósk um fyrirtökudag og tíma' }),
    ).toBeNull()
  })

  test('shows the arrest date for restriction cases and the case type for investigation cases', async () => {
    const { unmount } = renderRequestCase(
      { ...mockCase(CaseType.CUSTODY), arrestDate: '2026-03-01T08:00:00.000Z' },
      { displayRequestDetails: true },
    )

    await screen.findByRole('heading', { name: 'Tími handtöku' })
    expect(screen.queryByRole('heading', { name: 'Tegund kröfu' })).toBeNull()
    unmount()

    renderRequestCase(mockCase(CaseType.SEARCH_WARRANT), {
      displayRequestDetails: true,
    })

    await screen.findByRole('heading', { name: 'Tegund kröfu' })
    expect(screen.queryByRole('heading', { name: 'Tími handtöku' })).toBeNull()
  })

  test('shows the judge only once one is assigned', async () => {
    const { unmount } = renderRequestCase(mockCase(CaseType.CUSTODY))

    await screen.findByRole('heading', { name: 'Varnaraðili' })
    expect(screen.queryByRole('heading', { name: 'Dómari' })).toBeNull()
    unmount()

    renderRequestCase({
      ...mockCase(CaseType.CUSTODY),
      judge: { id: 'judge-id', name: 'Judge Judy' },
    })

    await screen.findByRole('heading', { name: 'Dómari' })
    expect(screen.getByText('Judge Judy')).toBeInTheDocument()
  })

  test('shows the court of appeal section only when the appeal has a case number', async () => {
    const { unmount } = renderRequestCase({
      ...mockCase(CaseType.CUSTODY),
      appealCase: { id: 'appeal-id', appealAssistant: { name: 'Assistant' } },
    })

    await screen.findByRole('heading', { name: 'Varnaraðili' })
    expect(
      screen.queryByRole('heading', { name: 'Málsnúmer Landsréttar' }),
    ).toBeNull()
    unmount()

    renderRequestCase({
      ...mockCase(CaseType.CUSTODY),
      appealCase: { id: 'appeal-id', appealCaseNumber: '1-2026' },
    })

    await screen.findByRole('heading', { name: 'Málsnúmer Landsréttar' })
    expect(screen.getByText('1-2026')).toBeInTheDocument()
  })

  test('renders an edit button for the prosecutor when a click handler is given', async () => {
    const theCase = {
      ...mockCase(CaseType.CUSTODY),
      prosecutor: { id: 'prosecutor-id', name: 'Perry Mason' },
    }

    renderRequestCase(theCase, { onProsecutorClick: jest.fn() })

    expect(
      await screen.findByRole('button', { name: 'Breyta Perry Mason' }),
    ).toBeInTheDocument()
  })
})
