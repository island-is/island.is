import React from 'react'
import { render } from '@testing-library/react'

import ServicePortalCore from './service-portal-core'

describe(' ServicePortalCore', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ServicePortalCore />)
    expect(baseElement).toBeTruthy()
  })
})
