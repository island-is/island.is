import React from 'react'
import { render } from '@testing-library/react'

import { LinkCard } from './LinkCard'

describe('LinkCard', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<LinkCard>LinkCard</LinkCard>)
    expect(baseElement).toBeTruthy()
  })
})
