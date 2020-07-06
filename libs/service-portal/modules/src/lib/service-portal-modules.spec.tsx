import React from 'react'
import { render } from '@testing-library/react'

import ServicePortalModules from './service-portal-modules'

describe(' ServicePortalModules', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ServicePortalModules />)
    expect(baseElement).toBeTruthy()
  })
})
