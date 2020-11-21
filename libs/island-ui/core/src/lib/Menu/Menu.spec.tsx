import React from 'react'
import { render } from '@testing-library/react'

import Menu from './Menu'

describe('Menu', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Menu baseId="menu" />)
    expect(baseElement).toBeTruthy()
  })
})
