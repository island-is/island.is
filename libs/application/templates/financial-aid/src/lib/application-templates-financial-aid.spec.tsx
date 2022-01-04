import React from 'react'
import { render } from '@testing-library/react'

import ApplicationTemplatesFinancialAid from './application-templates-financial-aid'

describe('ApplicationTemplatesFinancialAid', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ApplicationTemplatesFinancialAid />)
    expect(baseElement).toBeTruthy()
  })
})
