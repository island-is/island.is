import React from 'react'
import { render } from '@testing-library/react'

import ApplicationUiFields from './ApplicationUiFields'

describe('ApplicationUiFields', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ApplicationUiFields />)
    expect(baseElement).toBeTruthy()
  })
})
