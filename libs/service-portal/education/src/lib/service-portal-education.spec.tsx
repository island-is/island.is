import React from 'react'
import { render } from '@testing-library/react'

import ServicePortalEducation from './service-portal-education'

describe(' ServicePortalEducation', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ServicePortalEducation />)
    expect(baseElement).toBeTruthy()
  })
})
