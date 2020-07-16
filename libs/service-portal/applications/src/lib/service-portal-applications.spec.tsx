import React from 'react'
import { render } from '@testing-library/react'

import ServicePortalApplications from './service-portal-applications'

describe(' ServicePortalApplications', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ServicePortalApplications />)
    expect(baseElement).toBeTruthy()
  })
})
