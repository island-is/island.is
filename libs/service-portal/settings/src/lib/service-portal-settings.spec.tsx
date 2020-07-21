import React from 'react'
import { render } from '@testing-library/react'

import ServicePortalSettings from './service-portal-settings'

describe(' ServicePortalSettings', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ServicePortalSettings />)
    expect(baseElement).toBeTruthy()
  })
})
