import React from 'react'
import { render } from '@testing-library/react'

import Timeline from './Timeline'

describe(' Timeline', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Timeline />)
    expect(baseElement).toBeTruthy()
  })
})
