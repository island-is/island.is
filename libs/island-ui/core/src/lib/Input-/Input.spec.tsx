import React from 'react'
import { render } from '@testing-library/react'

import Input from './Input'

describe(' Input', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Input label="Text" name="t1" />)
    expect(baseElement).toBeTruthy()
  })
})
