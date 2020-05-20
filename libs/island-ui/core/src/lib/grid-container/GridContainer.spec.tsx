import React from 'react'
import { render } from '@testing-library/react'

import GridContainer from './GridContainer'

describe(' GridContainer', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<GridContainer />)
    expect(baseElement).toBeTruthy()
  })
})
