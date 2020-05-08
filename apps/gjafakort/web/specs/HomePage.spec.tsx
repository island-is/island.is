import React from 'react'
import { render } from '@testing-library/react'

import { HomePage } from '../screens'

describe('HomePage', () => {
  const props = {
    application: {
      id: '1',
    },
  } as typeof HomePage.propTypes

  it('should render successfully', () => {
    const { baseElement } = render(<HomePage {...props} />)
    expect(baseElement).toBeTruthy()
  })
})
