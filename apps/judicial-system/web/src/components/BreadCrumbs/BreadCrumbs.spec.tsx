import { render, screen } from '@testing-library/react'

import BreadCrumbs from './BreadCrumbs'

jest.mock(
  '../../utils/hooks/useCaseTableMembership/caseTableMembership.generated',
  () => ({
    useCaseTableMembershipQuery: () => ({
      data: undefined,
      loading: false,
      error: undefined,
    }),
  }),
)

describe('BreadCrumbs', () => {
  test('should give the home link a descriptive accessible name', () => {
    render(<BreadCrumbs />)

    expect(screen.getByRole('link', { name: 'Heim' })).toHaveAttribute(
      'href',
      '/malalistar',
    )
  })
})
