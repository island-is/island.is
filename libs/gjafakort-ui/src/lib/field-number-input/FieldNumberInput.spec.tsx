import React from 'react'
import { render } from '@testing-library/react'

import FieldNumberInput from './FieldNumberInput'

describe(' FieldNumberInput', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<FieldNumberInput />)
    expect(baseElement).toBeTruthy()
  })
})
