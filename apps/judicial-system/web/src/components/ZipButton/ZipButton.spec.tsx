import { IntlProvider } from 'react-intl'
import { render, screen } from '@testing-library/react'

import ZipButton from './ZipButton'

const renderZipButton = (courtCaseNumber?: string) =>
  render(
    <IntlProvider locale="is" onError={jest.fn}>
      <ZipButton caseId="test-case-id" courtCaseNumber={courtCaseNumber} />
    </IntlProvider>,
  )

describe('<ZipButton />', () => {
  test('should render a single download link with an accessible name', () => {
    renderZipButton('R-123/2024')

    const link = screen.getByRole('link', { name: 'Sækja öll skjöl' })

    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute(
      'href',
      '/api/case/test-case-id/limitedAccess/allFiles',
    )
    expect(link).toHaveAttribute('download', 'mal_R-123/2024')
  })

  test('should not nest an interactive button inside the link', () => {
    renderZipButton('R-123/2024')

    // The visual button is rendered as a span so the anchor is the only
    // interactive element (no interactive-in-interactive nesting).
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })
})
