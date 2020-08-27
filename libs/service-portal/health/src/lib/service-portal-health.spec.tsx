import React from 'react'
import { render } from '@testing-library/react'

import ServicePortalHealth from './service-portal-health'

describe(' ServicePortalHealth', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ServicePortalHealth />)
    expect(baseElement).toBeTruthy()
  })
})
