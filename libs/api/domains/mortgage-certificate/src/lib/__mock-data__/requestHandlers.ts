import { rest } from 'msw'

export const MOCK_PROPERTY_NUMBER_OK = 'F2003292'

const url = (path: string) => {
  return new URL(path, 'http://localhost').toString()
}

export const requestHandlers = [
  rest.post(url('/v1/Innskraning'), (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({ accessToken: '123', audkenni: '123' }),
    )
  }),
  rest.post(url('/api/Vedbokarvottord'), (req, res, ctx) => {
    const { fastanumer } = req.body as {
      fastanumer?: string
    }
    if ('F' + fastanumer === MOCK_PROPERTY_NUMBER_OK) {
      return res(
        ctx.status(200),
        ctx.json({ vedbandayfirlitPDFSkra: 'c29tZWNvbnRlbnQ=' }),
      )
    } else {
      return res(ctx.status(200), ctx.json({ vedbandayfirlitPDFSkra: '' }))
    }
  }),
]
