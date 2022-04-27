import { rest } from 'msw'
import {AssetType} from '../syslumennClient.types'
import {
  VHSUCCESS,
  VHFAIL,
  SYSLUMENN_AUCTION,
  DATA_UPLOAD,
  OPERATING_LICENSE_SERVICE_RES,
  OPERATING_LICENSE_PAGINATION_INFO_SERVICE_RES,
  VEDBANDAYFIRLRIT_REGLUVERKI_RESPONSE,
  MORTGAGE_CERTIFICATE_CONTENT_OK,
  MORTGAGE_CERTIFICATE_CONTENT_NO_KMARKING,
  MORTGAGE_CERTIFICATE_MESSAGE_NO_KMARKING,
  VEHICLE_TYPE_NAME,
  REAL_ESTATE_ADDRESS_NAME,
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
  rest.post(url('/api/VedbokavottordRegluverki'), (req, res, ctx) => {
<<<<<<< HEAD
    const realEstateId = (req.body as any).fastanumer ?? ''
    const validRealEstateId = /f?\d+/.test(realEstateId)
    if (!validRealEstateId) return res(ctx.status(404), ctx.json([]))
    return res(ctx.status(200), ctx.json(VEDBANDAYFIRLRIT_REGLUVERKI_RESPONSE))
=======
    const assetId = (req.body as any).fastanumer ?? ""
    const response = VEDBANDAYFIRLRIT_REGLUVERKI_RESPONSE
    const t = (req.body as any).tegundAndlags ?? -1
    switch (t) {
      case AssetType.RealEstate: {
        if (!/f?\d+/.test(assetId))
          return res(ctx.status(404), ctx.json([]))
        response[0].heiti = REAL_ESTATE_ADDRESS_NAME
        return res(ctx.status(200), ctx.json(response))
      }
      case AssetType.Vehicle: {
        // This test will break if tested with Icelandic private license plates, even though they are legal
        if (!/^[A-Z0-9]{2,6}$/.test(assetId.toUpperCase()))
          return res(ctx.status(404), ctx.json([]))
        response[0].heiti = VEHICLE_TYPE_NAME
        return res(ctx.status(200), ctx.json(response))
      }
      default: {
        response[0].heiti = "INVALIDE"
        return res(ctx.status(200), ctx.json(response))
      }
    }
>>>>>>> b7974bf3d8 (Add getVehicleType)
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
