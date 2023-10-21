import { FC } from 'react'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import { configureMock } from '../userManager'
import { useAuth } from './AuthContext'
import { AuthProvider } from './AuthProvider'

const Wrapper: FC<React.PropsWithChildren<unknown>> = ({ children }) => (
  <MemoryRouter>{children}</MemoryRouter>
)
const Greeting = () => {
  const { userInfo } = useAuth()
  return <>Hello {userInfo?.profile.name}</>
}
const renderAuthenticator = () =>
  render(
    <AuthProvider basePath="/basepath">
      <h2>
        <Greeting />
      </h2>
    </AuthProvider>,
    { wrapper: Wrapper },
  )

describe('AuthProvider', () => {
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
