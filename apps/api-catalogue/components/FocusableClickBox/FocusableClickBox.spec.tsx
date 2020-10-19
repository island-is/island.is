import React from 'react'
import { render } from '@testing-library/react'

import { FocusableClickBox } from './FocusableClickBox'

describe(' FocusableClickBox ', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<FocusableClickBox href="http://bull.is"/>)
    expect(baseElement).toBeTruthy()
  })
})
