import React from 'react'
import { render } from '@testing-library/react'

import ServicePortalVehicles from './service-portal-vehicles'

describe('ServicePortalVehicles', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ServicePortalVehicles />)
    expect(baseElement).toBeTruthy()
  })
})
