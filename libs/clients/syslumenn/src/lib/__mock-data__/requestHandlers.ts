import { VedbandayfirlitSkeyti } from '../../../gen/fetch'
import { rest } from 'msw'
import { AssetType } from '../syslumennClient.types'
import {
  VHSUCCESS,
  VHFAIL,
  SYSLUMENN_AUCTION,
  DATA_UPLOAD,
  OPERATING_LICENSE_SERVICE_RES,
  OPERATING_LICENSE_PAGINATION_INFO_SERVICE_RES,
  VEDBANDAYFIRLIT_REGLUVERKI_RESPONSE,
  MORTGAGE_CERTIFICATE_CONTENT_OK,
  MORTGAGE_CERTIFICATE_CONTENT_NO_KMARKING,
  MORTGAGE_CERTIFICATE_MESSAGE_NO_KMARKING,
  REAL_ESTATE_ADDRESS_NAME,
  ESTATE_REGISTRANT_RESPONSE,
  MOCK_PROPERTY_NUMBER_NOT_EXISTS,
  MOCK_PROPERTY_NUMBER_NO_KMARKING,
  MOCK_PROPERTY_NUMBER_OK,
  MOCK_PROPERTY_DETAIL,
  MOCK_PROPERTY_NUMBER_INVALID,
} from './responses'

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
  rest.get(
    url('/api/SkraningaradiliDanarbus/:nationalid/:id'),
    (req, res, ctx) => {
      const success =
        req.params.nationalid && req.params.nationalid === '0101302399'

      if (success) {
        return res(ctx.status(200), ctx.json(ESTATE_REGISTRANT_RESPONSE))
      } else {
        // TODO: get confirmation from Syslumenn, currently returns 500
        return res(ctx.status(404))
      }
    },
  ),
  rest.post(url('/api/v1/SyslMottakaGogn'), (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(DATA_UPLOAD))
  }),
  rest.post(url('/api/VedbokavottordRegluverki'), (req, res, ctx) => {
    const body = req.body as VedbandayfirlitSkeyti
    const assetId = body.fastanumer ?? ''
    const response = VEDBANDAYFIRLIT_REGLUVERKI_RESPONSE
    console.log(`assetId: ${assetId}`)
    response[0].fastnum = assetId
    switch ((body.tegundAndlags as number) ?? -1) {
      case AssetType.RealEstate: {
        switch (assetId) {
          case MOCK_PROPERTY_NUMBER_OK: {
            response[0].heiti = REAL_ESTATE_ADDRESS_NAME
            return res(ctx.status(200), ctx.json(response))
          }
          case MOCK_PROPERTY_NUMBER_NOT_EXISTS: {
            return res(ctx.status(404), ctx.json([]))
          }
          default: {
            return res(ctx.status(500), ctx.json([]))
          }
        }
      }
      default: {
        response[0].heiti = 'INVALID'
        return res(ctx.status(200), ctx.json(response))
      }
    }
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
