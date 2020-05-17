import React from 'react'
import { render } from '@testing-library/react'

import Select from './Select'

describe(' Select', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Select />)
    expect(baseElement).toBeTruthy()
  })
})
