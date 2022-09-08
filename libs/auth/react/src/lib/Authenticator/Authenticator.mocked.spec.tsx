import { render, screen } from '@testing-library/react'
import React, { FC } from 'react'
import { MemoryRouter } from 'react-router-dom'

import { configureMock } from '../userManager'
import { useAuth } from './AuthContext'
import { Authenticator } from './Authenticator'

const Wrapper: FC = ({ children }) => <MemoryRouter>{children}</MemoryRouter>
const Greeting = () => {
  const { userInfo } = useAuth()
  return <>Hello {userInfo?.profile.name}</>
}
const renderAuthenticator = () =>
  render(
    <Authenticator>
      <h2>
        <Greeting />
      </h2>
    </Authenticator>,
    { wrapper: Wrapper },
  )

describe('Authenticator', () => {
  const expectAuthenticated = (name: string) =>
    screen.findByText(`Hello ${name}`)

  it('authenticates with non-expired user', async () => {
    // Arrange
    configureMock({
      profile: {
        name: 'John Doe',
      },
    })

    // Act
    renderAuthenticator()

    // Assert
    await expectAuthenticated('John Doe')
  })
})
