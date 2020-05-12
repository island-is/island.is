import React from 'react'
import { render } from '@testing-library/react'

import GridRow from './GridRow'

describe(' GridRow', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<GridRow />)
    expect(baseElement).toBeTruthy()
  })
})
