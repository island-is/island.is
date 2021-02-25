import React from 'react'
import { render } from '@testing-library/react'

import ApplicationTemplatesDataProtectionComplaint from './application-templates-data-protection-complaint'

describe('ApplicationTemplatesDataProtectionComplaint', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <ApplicationTemplatesDataProtectionComplaint />,
    )
    expect(baseElement).toBeTruthy()
  })
})
