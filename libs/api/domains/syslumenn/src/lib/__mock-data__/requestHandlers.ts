import { rest } from 'msw'
import {VHSUCCESS, VHFAIL }from './virkarHeimagistingar'

export const YEAR = 0


const url = (path: string) => {
  return new URL(path, 'http://localhost').toString()
}

export const requestHandlers = [
  rest.get(url('/v1/VirkarHeimagistingar/:audkenni'), (req, res, ctx) => {
    const success =
        req.params.audkenni === YEAR
    return res(ctx.status(200), ctx.json(success ? VHSUCCESS : VHFAIL))
  }),
  rest.get(url('/v1/api/okuskirteini/okukennarar'), (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(true))
  }),

]
