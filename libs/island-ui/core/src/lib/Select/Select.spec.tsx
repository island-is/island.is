import React from 'react'
import { render } from '@testing-library/react'

import { Select } from './Select'

describe(' Select', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Select options={[]} name="s1" />)
    expect(baseElement).toBeTruthy()
  })
})
