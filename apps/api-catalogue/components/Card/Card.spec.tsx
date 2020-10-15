import React from 'react'
import { render } from '@testing-library/react'

import Card from './Card'

describe(' Card ', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <Card title="Test Title" slug="test-slug" text="Test test for card" />,
    )
    expect(baseElement).toBeTruthy()
  })
})
