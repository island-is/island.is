import React from 'react'
import { render } from '@testing-library/react'
import 'whatwg-fetch'
import Index from '../pages/index'
jest.mock('next/router', () => ({
  useRouter: () => ({ push: () => jest.fn() }),
}))

describe('Index', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Index />)
    expect(baseElement).toBeTruthy()
  })
})
