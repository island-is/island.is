import React from 'react'
import { render } from '@testing-library/react'

import { InputError } from './InputError'

describe(' Checkbox', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<InputError id="test" errorMessage="test" />)
    expect(baseElement).toBeTruthy()
  })
})
