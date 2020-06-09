import React from 'react'
import { render } from '@testing-library/react'

import Slider from './Slider'

describe('Slider', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <Slider title="Vefir hins opinbera" boxProps={{ padding: 3 }}>
        <div>slide 1</div>
        <div>slide 2</div>
        <div>slide 3</div>
      </Slider>,
    )
    expect(baseElement).toBeTruthy()
  })
})
