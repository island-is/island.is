import React from 'react'
import { render } from '@testing-library/react'

import FieldCheckbox from './FieldCheckbox'

describe(' FieldCheckbox', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<FieldCheckbox />)
    expect(baseElement).toBeTruthy()
  })
})
