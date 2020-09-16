import React from 'react'
import { render } from '@testing-library/react'

import ServicePortalAssets from './service-portal-assets'

describe(' ServicePortalAssets', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ServicePortalAssets />)
    expect(baseElement).toBeTruthy()
  })
})
