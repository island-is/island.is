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
  rest.post(url('/v1/Vedbokarvottord'), (req, res, ctx) => {
    var { fastanumer } = req.body as {
      fastanumer?: string
    }
    if (fastanumer === MOCK_REAL_ESTATE_NUMBER) {
      return res(
        ctx.status(200),
        ctx.json({ vedbandayfirlitPDFSkra: 'somecontent' }),
      )
    } else if (fastanumer === MOCK_REAL_ESTATE_NUMBER_NOT_EXISTS) {
      return res(ctx.status(500), ctx.text('Internal Server Error'))
    } else {
      return res(ctx.status(200), ctx.json({ vedbandayfirlitPDFSkra: '' }))
    }
  }),
]
