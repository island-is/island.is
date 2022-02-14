import { rest } from 'msw'

export const MOCK_NATIONAL_ID = '0101304929'
export const MOCK_NATIONAL_ID_NOT_EXISTS = '0000000000'

const url = (path: string) => {
  return new URL(path, 'http://localhost').toString()
}

export const requestHandlers = [
  rest.get(url('/v2/api/pdf/v1/Create/Personal/:personId'), (req, res, ctx) => {
    if (req.params.personId === MOCK_NATIONAL_ID) {
      return res(ctx.status(200), ctx.text('ok'))
    } else if (req.params.personId === MOCK_NATIONAL_ID_NOT_EXISTS) {
      return res(ctx.status(500), ctx.text('Internal Server Error'))
    } else {
      return res(ctx.status(200), ctx.text(''))
    }
  }),
]
