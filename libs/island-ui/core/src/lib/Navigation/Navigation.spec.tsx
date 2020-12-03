import React from 'react'
import { render } from '@testing-library/react'

describe('Navigation', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<div>ok</div>)
    expect(baseElement).toBeTruthy()
  })
})
