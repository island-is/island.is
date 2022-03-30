import { rest } from 'msw'
import {
  VHSUCCESS,
  VHFAIL,
  SYSLUMENN_AUCTION,
  DATA_UPLOAD,
  OPERATING_LICENSE_SERVICE_RES,
  OPERATING_LICENSE_PAGINATION_INFO_SERVICE_RES,
  MORTGAGE_CERTIFICATE_CONTENT_OK,
  MORTGAGE_CERTIFICATE_CONTENT_NO_KMARKING,
  MORTGAGE_CERTIFICATE_MESSAGE_NO_KMARKING,
} from './responses'

export const MOCK_PROPERTY_NUMBER_OK = 'F2003292'
export const MOCK_PROPERTY_NUMBER_NO_KMARKING = 'F2038390'
export const MOCK_PROPERTY_NUMBER_NOT_EXISTS = 'F12345678'

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
  rest.get(url('/v1/VirkarHeimagistingar/:id/:year'), (req, res, ctx) => {
    const success = req.params.id ? true : false
    if (success) {
      return res(ctx.status(200), ctx.json(VHSUCCESS))
    } else {
      return res(ctx.status(401), ctx.json(VHFAIL))
    }
  }),
  rest.get(url('/v1/VirkarHeimagistingar/:id'), (req, res, ctx) => {
    const success = req.params.id ? true : false
    if (success) {
      return res(ctx.status(200), ctx.json(VHSUCCESS))
    } else {
      return res(ctx.status(401), ctx.json(VHFAIL))
    }
  }),
  rest.get(url('/api/Uppbod/:id'), (req, res, ctx) => {
    const success = req.params.id ? true : false
    if (success) {
      return res(ctx.status(200), ctx.json(SYSLUMENN_AUCTION))
    } else {
      return res(ctx.status(401), ctx.json(VHFAIL))
    }
  }),
  rest.get(url('/api/VirkLeyfi/:id'), (req, res, ctx) => {
    const success = req.params.id ? true : false
    if (success) {
      return res(
        ctx.status(200),
        ctx.json(OPERATING_LICENSE_SERVICE_RES),
        ctx.set(
          'x-pagination',
          JSON.stringify(OPERATING_LICENSE_PAGINATION_INFO_SERVICE_RES),
        ),
      )
    } else {
      return res(ctx.status(401), ctx.json(VHFAIL))
    }
  }),
  rest.post(url('/api/v1/SyslMottakaGogn'), (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(DATA_UPLOAD))
  }),
  rest.post(url('/api/Vedbokarvottord'), (req, res, ctx) => {
    const { fastanumer } = req.body as {
      fastanumer?: string
    }
    if ('F' + fastanumer === MOCK_PROPERTY_NUMBER_OK) {
      return res(
        ctx.status(200),
        ctx.json({ vedbandayfirlitPDFSkra: MORTGAGE_CERTIFICATE_CONTENT_OK }),
      )
    } else if ('F' + fastanumer === MOCK_PROPERTY_NUMBER_NO_KMARKING) {
      return res(
        ctx.status(200),
        ctx.json({
          vedbandayfirlitPDFSkra: MORTGAGE_CERTIFICATE_CONTENT_NO_KMARKING,
          skilabod: MORTGAGE_CERTIFICATE_MESSAGE_NO_KMARKING,
        }),
      )
    } else if ('F' + fastanumer === MOCK_PROPERTY_NUMBER_NOT_EXISTS) {
      return res(ctx.status(500), ctx.text('Internal Server Error'))
    } else {
      return res(ctx.status(200), ctx.json({ vedbandayfirlitPDFSkra: '' }))
    }
  }),
]
