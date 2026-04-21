import React from 'react'
import { render } from '@testing-library/react'
import Index from '../pages/index'
jest.mock('next/router', () => ({
  useRouter: () => ({ push: () => jest.fn() }),
}))
jest.mock('next-auth/react', () => ({
  useSession: () => ({ data: null, status: 'unauthenticated' }),
  getSession: () => Promise.resolve(null),
  SessionProvider: ({ children }: { children: React.ReactNode }) => children,
}))

describe('Index', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Index />)
    expect(baseElement).toBeTruthy()
  })
})
