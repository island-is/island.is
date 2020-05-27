import React from 'react'
import { render } from '@testing-library/react'

import { Breadcrumbs } from './Breadcrumbs'

describe('Breadcrumbs', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <Breadcrumbs>
        <a href="/">Link 1</a>
        <a href="/">Link 2</a>
        <a href="/">Link 3</a>
      </Breadcrumbs>,
    )
    expect(baseElement).toBeTruthy()
  })
})
