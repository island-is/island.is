import { render } from '@testing-library/react'

import ServicePortalAirDiscount from './service-portal-air-discount'

describe('ServicePortalAirDiscount', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ServicePortalAirDiscount />)
    expect(baseElement).toBeTruthy()
  })
})
