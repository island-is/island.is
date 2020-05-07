import React from 'react'
import { render } from '@testing-library/react'

import { HomePage } from '../screens/HomePage'

describe('HomePage', () => {
  const props = {
    application: {
      id: '1',
    },
  }

  it('should render successfully', () => {
    const { baseElement } = render(<HomePage {...props} />)
    expect(baseElement).toBeTruthy()
  })
})
