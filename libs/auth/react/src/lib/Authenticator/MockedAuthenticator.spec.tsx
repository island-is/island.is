import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
import { useAuth } from './AuthContext'
import { MockedAuthenticator } from './MockedAuthenticator'

const TestConsumer = () => {
  const { userInfo } = useAuth()
  return <span>User: {userInfo ? userInfo.profile.name : 'Not logged in'}</span>
}

describe('MockedAuthenticator', () => {
  it('defaults to unauthenticated', () => {
    const { getByText } = render(
      <MockedAuthenticator>
        <TestConsumer />
      </MockedAuthenticator>,
    )
    expect(getByText(/^User:/)).toHaveTextContent('User: Not logged in')
  })

  it('provides good default values for user', () => {
    const { getByText } = render(
      <MockedAuthenticator user={{}}>
        <TestConsumer />
      </MockedAuthenticator>,
    )
    expect(getByText(/^User:/)).toHaveTextContent('User: Mock')
  })

  it('supports overriding user details', () => {
    const { getByText } = render(
      <MockedAuthenticator user={{ profile: { name: 'Peter' } }}>
        <TestConsumer />
      </MockedAuthenticator>,
    )
    expect(getByText(/^User:/)).toHaveTextContent('User: Peter')
  })
})
