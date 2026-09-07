import { render, screen } from '@testing-library/react'

import BreadCrumbs from './BreadCrumbs'

jest.mock(
  '@island.is/judicial-system-web/src/utils/hooks/useCaseTableMembership/caseTableMembership.generated',
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
