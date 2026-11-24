import { render, screen } from '@testing-library/react'

import type { OrganizationPage } from '@island.is/web/graphql/schema'

import { OrganizationExternalLinks } from './OrganizationWrapper'

jest.mock('next/router', () => ({
  useRouter: () => ({ query: {}, asPath: '/s/landsrettur', push: jest.fn() }),
}))

const renderLinks = (url: string) =>
  render(
    <OrganizationExternalLinks
      organizationPage={
        {
          slug: 'landsrettur',
          externalLinks: [{ text: 'Réttarvörslugáttin', url }],
        } as unknown as OrganizationPage
      }
    />,
  )

describe('OrganizationExternalLinks', () => {
  it.each([
    'https://rettarvorslugatt.island.is/',
    'https://vefgatt.domstolar.is/web/index.html',
    '/s/landsrettur/frettir',
  ])('wraps the button in an anchor pointing to %s', (url) => {
    renderLinks(url)

    const anchor = screen.getByText('Réttarvörslugáttin').closest('a')

    expect(anchor?.getAttribute('href')).toBe(url)
  })
})
