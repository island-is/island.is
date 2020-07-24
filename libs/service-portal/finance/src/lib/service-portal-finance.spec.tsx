import React from 'react'
import { render } from '@testing-library/react'

import ServicePortalFinance from './service-portal-finance'

describe(' ServicePortalFinance', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ServicePortalFinance />)
    expect(baseElement).toBeTruthy()
  })
})
