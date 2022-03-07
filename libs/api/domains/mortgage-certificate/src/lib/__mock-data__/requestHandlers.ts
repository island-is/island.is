import { rest } from 'msw'

export const MOCK_REAL_ESTATE_NUMBER = 'F2240968'
export const MOCK_REAL_ESTATE_NUMBER_NOT_EXISTS = 'F12345678'

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
    if (
      fastanumer ===
      MOCK_REAL_ESTATE_NUMBER.substring(1, MOCK_REAL_ESTATE_NUMBER.length)
    ) {
      return res(
        ctx.status(200),
        ctx.json({ vedbandayfirlitPDFSkra: 'c29tZWNvbnRlbnQ=' }), // btoa('somecontent')
      )
    } else if (
      fastanumer ===
      MOCK_REAL_ESTATE_NUMBER_NOT_EXISTS.substring(
        1,
        MOCK_REAL_ESTATE_NUMBER_NOT_EXISTS.length,
      )
    ) {
      return res(ctx.status(500), ctx.text('Internal Server Error'))
    } else {
      return res(ctx.status(200), ctx.json({ vedbandayfirlitPDFSkra: '' }))
    }
  }),
]
