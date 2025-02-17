import { render } from '@testing-library/react'

import ExampleFields from './example-fields'

describe('ExampleFields', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ExampleFields />)
    expect(baseElement).toBeTruthy()
  })
})
