import React from 'react'
import { render } from '@testing-library/react'

import { Icon } from './Icon'

describe(' Icon', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Icon type="cheveron" />)
    expect(baseElement).toBeTruthy()
  })
  it('should render title', () => {
    const renderedIcon = render(<Icon type="cheveron" title="cheveron" />)
    expect(renderedIcon.getByTitle('cheveron')).toBeTruthy()
  })
})
