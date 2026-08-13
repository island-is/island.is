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

  test('hides the decorative institution logo from assistive technology', async () => {
    // Act
    const { container } = render(
      <MockedProvider mocks={[...mockJudgeQuery]} addTypename={false}>
        <UserProvider authenticated={true}>
          <Logo />
        </UserProvider>
      </MockedProvider>,
    )

    // Assert - the institution name is already conveyed as adjacent text, so the
    // logo SVG is marked decorative to avoid a redundant announcement.
    await screen.findByText('Héraðsdómur')
    const svg = container.querySelector('svg')
    expect(svg).toHaveAttribute('aria-hidden', 'true')
    expect(svg).toHaveAttribute('focusable', 'false')
  })
})
