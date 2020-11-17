import React from 'react'
import { render } from '@testing-library/react'

import ServiceLayout from './ServiceLayout'

describe(' ServiceLayout ', () => {

  it('should render successfully', () => {
    const { baseElement } = render(<ServiceLayout left={null} />)
    expect(baseElement).toBeTruthy()
  })
})
