import React from 'react'
import { MockedProvider } from '@apollo/client/testing'
import { render, screen } from '@testing-library/react'

import { mockJudgeQuery } from '../../utils/mocks'
import { UserProvider } from '../UserProvider/UserProvider'
import Logo from './Logo'

describe('Logo', () => {
  test('should display the current users institution', async () => {
    // Act
    render(
      <MockedProvider mocks={[...mockJudgeQuery]} addTypename={false}>
        <UserProvider authenticated={true}>
          <Logo />
        </UserProvider>
      </MockedProvider>,
    )

    // Assert
    expect(await screen.findByText('Héraðsdómur')).toBeInTheDocument()
    expect(await screen.findByText('Reykjavíkur')).toBeInTheDocument()
  })
})
