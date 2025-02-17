import { render } from '@testing-library/react'

import ExampleStateTransfers from './example-state-transfers'

describe('ExampleStateTransfers', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ExampleStateTransfers />)
    expect(baseElement).toBeTruthy()
  })
})
