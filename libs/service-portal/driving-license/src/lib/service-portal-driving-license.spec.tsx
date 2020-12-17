import React from 'react'
import { render } from '@testing-library/react'

import ServicePortalDrivingLicense from './service-portal-driving-license'

describe('ServicePortalDrivingLicense', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ServicePortalDrivingLicense />)
    expect(baseElement).toBeTruthy()
  })
})
