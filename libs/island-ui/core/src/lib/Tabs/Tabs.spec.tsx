import React from 'react'
import { render } from '@testing-library/react'

import { Tabs } from './Tabs'

describe('Tabs', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <Tabs
        label="The tabs label."
        tabs={[
          { label: 'tab1', content: <div>tab1 content</div> },
          { label: 'tab2', content: <div>tab2 content</div> },
        ]}
      />,
    )
    expect(baseElement).toBeTruthy()
  })
})
