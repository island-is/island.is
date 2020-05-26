import React from 'react'
import { render } from '@testing-library/react'

import { HomePage } from '../screens'

describe('HomePage', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<HomePage />)
    expect(baseElement).toBeTruthy()
  })
})
