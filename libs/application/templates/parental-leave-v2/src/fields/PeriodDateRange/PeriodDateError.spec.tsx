import React from 'react'
import { render, screen } from '@testing-library/react'

import { Application, Field } from '@island.is/application/types'

import { PeriodDateError } from './PeriodDateError'

jest.mock('@island.is/island-ui/core', () => ({
  Box: ({ children }: { children: React.ReactNode }) => children,
  ErrorMessage: ({ children }: { children: React.ReactNode }) => (
    <p>{children}</p>
  ),
}))

const renderError = (errors: Record<string, unknown>) =>
  render(
    <PeriodDateError
      application={{} as Application}
      field={{ id: 'periods[1].dateError' } as Field}
      errors={errors}
    />,
  )

describe('PeriodDateError', () => {
  it('shows an error on the period end date', () => {
    renderError({ 'periods[1].endDate': 'Too short' })

    expect(screen.getByText('Too short')).toBeTruthy()
  })

  it('shows an error on the period start date, nested as the shell keeps it', () => {
    renderError({ periods: [undefined, { startDate: 'Overlaps' }] })

    expect(screen.getByText('Overlaps')).toBeTruthy()
  })

  it('ignores errors on other periods and fields', () => {
    const { container } = renderError({
      'periods[0].endDate': 'Other period',
      'periods[1].ratio': 'Ratio',
    })

    expect(container.textContent).toBe('')
  })
})
