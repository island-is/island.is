import React from 'react'
import { render } from '@testing-library/react'

import CategoryCheckBox from './category-check-box'

describe(' CategoryCheckBox', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<CategoryCheckBox />)
    expect(baseElement).toBeTruthy()
  })
})
