import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
import { useAuth } from './AuthContext'
import { MockedAuthProvider } from './MockedAuthProvider'

const TestConsumer = () => {
  const { userInfo } = useAuth()
  return <span>User: {userInfo ? userInfo.profile.name : 'Not logged in'}</span>
}

describe('MockedAuthProvider', () => {
  it('defaults to unauthenticated', () => {
    const { getByText } = render(
      <MockedAuthProvider>
        <TestConsumer />
      </MockedAuthProvider>,
    )
    expect(getByText(/^User:/)).toHaveTextContent('User: Not logged in')
  })

  it('provides good default values for user', () => {
    const { getByText } = render(
      <MockedAuthProvider user={{}}>
        <TestConsumer />
      </MockedAuthProvider>,
    )
    expect(getByText(/^User:/)).toHaveTextContent('User: Mock')
  })

  it('supports overriding user details', () => {
    const { getByText } = render(
      <MockedAuthProvider user={{ profile: { name: 'Peter' } }}>
        <TestConsumer />
      </MockedAuthProvider>,
    )
    expect(getByText(/^User:/)).toHaveTextContent('User: Peter')
  })
})
