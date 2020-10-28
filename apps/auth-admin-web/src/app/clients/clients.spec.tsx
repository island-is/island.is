import React from 'react'
import { render } from '@testing-library/react'

import Clients from './clients'

describe('Clients', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Clients />)
    expect(baseElement).toBeTruthy()
  })
})
