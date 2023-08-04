import { render } from '@testing-library/react'

import ServicePortalOccupationalLicenses from './service-portal-occupational-licenses'

describe('ServicePortalOccupationalLicenses', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ServicePortalOccupationalLicenses />)
    expect(baseElement).toBeTruthy()
  })
})
