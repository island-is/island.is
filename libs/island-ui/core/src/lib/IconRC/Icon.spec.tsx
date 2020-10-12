import React from 'react'
import { render } from '@testing-library/react'

import { Icon } from './Icon'

describe(' Icon', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <Icon type="outline" icon="chevronForward" />,
    )
    expect(baseElement).toBeTruthy()
  })
  it('should render title', () => {
    const renderedIcon = render(
      <Icon
        type="filled"
        icon="chevronForward"
        title="chevronForward"
        titleId="chevronForward"
      />,
    )
    expect(renderedIcon).toBeTruthy()
  })
})
