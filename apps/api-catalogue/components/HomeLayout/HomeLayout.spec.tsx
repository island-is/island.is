import React from 'react'
import { render } from '@testing-library/react'

import HomeLayout from './HomeLayout'

describe(' HomeLayout ', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<HomeLayout left={null} />)
    expect(baseElement).toBeTruthy()
  })
})
