import { render } from '@testing-library/react'

import ServicePortalLawAndOrder from './service-portal-law-and-order'

describe('ServicePortalLawAndOrder', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ServicePortalLawAndOrder />)
    expect(baseElement).toBeTruthy()
  })
})
