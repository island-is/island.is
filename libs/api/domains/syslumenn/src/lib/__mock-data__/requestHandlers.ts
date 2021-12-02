import { rest } from 'msw'
import {VHSUCCESS, VHFAIL }from './virkarHeimagistingar'

export const YEAR = '2021'


const url = (path: string) => {
  return new URL(path, 'http://localhost').toString()
}

export const requestHandlers = [
  rest.post(url('/v1/Innskraning'), (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ accessToken: '123', audkenni: '123'}))
  }),
  rest.get(url('/v1/VirkarHeimagistingar/:id/:year'), (req, res, ctx) => {
    const success =
        req.params.year === YEAR
    return res(ctx.status(200), ctx.json(success ? VHSUCCESS : VHFAIL))
  }),

]
