import React from 'react'
import { render } from '@testing-library/react'

import AsyncSearch from './AsyncSearch'

describe(' AsyncSearch', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <AsyncSearch options={[{ label: 'label', value: 'value' }]} />,
    )
    expect(baseElement).toBeTruthy()
  })
})
