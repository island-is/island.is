import React from 'react'
import { render } from '@testing-library/react'

import Index from '../pages/index'
import Home from '../screens/Home/Home'
describe('Index', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Home data={null} />)
    expect(baseElement).toBeTruthy()
  })
})
