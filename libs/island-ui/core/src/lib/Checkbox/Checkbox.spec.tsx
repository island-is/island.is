import React from 'react'
import { render } from '@testing-library/react'

import { Checkbox } from './Checkbox'

describe(' Checkbox', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Checkbox name="c1" />)
    expect(baseElement).toBeTruthy()
  })

  it('should set aria-required on the input when required', () => {
    const { getByRole } = render(<Checkbox name="c1" label="c1" required />)
    expect(getByRole('checkbox')).toHaveAttribute('aria-required', 'true')
  })

  it('should not set aria-required on the input when not required', () => {
    const { getByRole } = render(<Checkbox name="c1" label="c1" />)
    expect(getByRole('checkbox')).not.toHaveAttribute('aria-required')
  })
})
