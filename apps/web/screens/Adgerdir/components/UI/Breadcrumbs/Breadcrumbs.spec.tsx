import React from 'react'
import { render } from '@testing-library/react'

import { Breadcrumbs } from './Breadcrumbs'

describe('Breadcrumbs', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <Breadcrumbs
        items={[
          { title: 'href', href: '/' },
          { title: 'text' },
          { isTag: true, title: 'href tag', href: '/' },
          { isTag: true, title: 'text tag' },
        ]}
      />,
    )
    expect(baseElement).toBeTruthy()
  })
})
