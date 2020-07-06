import React from 'react'
import { render } from '@testing-library/react'

import ServicePortal from './service-portal'

describe(' ServicePortal', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ServicePortal />)
    expect(baseElement).toBeTruthy()
  })
})
