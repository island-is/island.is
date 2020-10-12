import React from 'react'
import { render } from '@testing-library/react'

import { Checkbox } from './Checkbox'

describe(' Checkbox', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Checkbox name="c1" />)
    expect(baseElement).toBeTruthy()
  })
})
