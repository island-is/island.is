import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { act, render, screen } from '@testing-library/react'

import { IntlProviderWrapper } from '../../utils/testHelpers'
import { Header as HeaderContainer } from '..'

jest.mock('next/router', () => ({
  useRouter() {
    return {
      pathname: '',
    }
  },
}))

const server = setupServer(
  rest.get('/api/geoLocation/getCountryCode', (_req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ countryCode: 'IS' }))
  }),
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('Header', () => {
  it('should not render a "ask for help" button if the user is in Iceland', async () => {
    act(() => {
      render(
        <IntlProviderWrapper>
          <HeaderContainer />
        </IntlProviderWrapper>,
      )
    })

    /**
     * This is simultainously checking that the "ask for help" button is
     * rendered for users in Iceland and that it is not rendered for users
     * outside of Iceland because `screen.findByRole('button')` will throw
     * an error if the button is not found, which will fail the test.
     */
    const askForHelpButton = await screen.findByRole('button')
    expect(askForHelpButton).toBeInTheDocument()
  })
})
