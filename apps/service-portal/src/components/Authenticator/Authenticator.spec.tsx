import React from 'react'
import { render } from '@testing-library/react'

import Authenticator from './Authenticator'

describe(' Authenticator', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Authenticator />)
    expect(baseElement).toBeTruthy()
  })
})
