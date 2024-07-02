import { rest } from 'msw'

export const MOCK_PROPERTY_NUMBER_OK = '2003292'

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
  rest.post(url('/api/Vedbokarvottord2'), (req, res, ctx) => {
    const { eignir } = req.body as {
      eignir: {
        fastanumer?: string
      }[]
    }
    if (eignir[0].fastanumer === MOCK_PROPERTY_NUMBER_OK) {
      return res(
        ctx.status(200),
        ctx.json({
          skilabodOgSkra: [{ vedbandayfirlitPDFSkra: 'c29tZWNvbnRlbnQ=' }],
        }),
      )
    } else {
      return res(
        ctx.status(200),
        ctx.json({
          skilabodOgSkra: [{ vedbandayfirlitPDFSkra: '' }],
        }),
      )
    }
  }),
]
