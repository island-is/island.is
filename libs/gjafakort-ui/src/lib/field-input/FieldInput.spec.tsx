import React from 'react'
import { render } from '@testing-library/react'

import FieldInput from './FieldInput'

describe(' FieldInput', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<FieldInput />)
    expect(baseElement).toBeTruthy()
  })
})
