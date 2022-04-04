import React from 'react'
import { render } from '@testing-library/react'

import ServicePortalFinanceSchedule from './service-portal-finance-schedule'

describe('ServicePortalFinanceSchedule', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ServicePortalFinanceSchedule />)
    expect(baseElement).toBeTruthy()
  })
})
