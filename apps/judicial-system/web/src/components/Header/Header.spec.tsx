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
  // rest.get('https://api.ipify.org/', (req, res, ctx) => {
  //   req.url.searchParams.set('format', 'json')

  //   return res(ctx.json({ ip: '123.45.67.8' }))
  // }),

  rest.get('/api/geoLocation/getCountryCode', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ countryCode: 'IS' }))
  }),
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('Header', () => {
  it('should not render a "ask for help" button if the user is not in Iceland', async () => {
    act(() => {
      render(
        <IntlProviderWrapper>
          <HeaderContainer />
        </IntlProviderWrapper>,
      )
    })

    const askForHelpButton = await screen.findByRole('button')
    expect(askForHelpButton).not.toBeInTheDocument()
  })
})
