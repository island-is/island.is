import React from 'react'
import { render } from '@testing-library/react'

import ServicePortalFamily from './service-portal-family'

describe(' ServicePortalFamily', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ServicePortalFamily />)
    expect(baseElement).toBeTruthy()
  })
})
