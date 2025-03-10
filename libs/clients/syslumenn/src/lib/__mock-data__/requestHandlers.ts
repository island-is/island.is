import {
  ThjodskraSkeyti,
  VedbandayfirlitMargirSkeyti,
  VedbandayfirlitSkeyti,
} from '../../../gen/fetch'
import { rest } from 'msw'
import { AssetType } from '../syslumennClient.types'
import {
  VHSUCCESS,
  VHFAIL,
  SYSLUMENN_AUCTION,
  DATA_UPLOAD,
  OPERATING_LICENSE_SERVICE_RES,
  OPERATING_LICENSE_PAGINATION_INFO_SERVICE_RES,
  OPERATING_LICENSES_CSV,
  VEDBANDAYFIRLRIT_REGLUVERKI_RESPONSE,
  MORTGAGE_CERTIFICATE_CONTENT_OK,
  MORTGAGE_CERTIFICATE_CONTENT_NO_KMARKING,
  MORTGAGE_CERTIFICATE_MESSAGE_NO_KMARKING,
  REAL_ESTATE_ADDRESS_NAME,
  ESTATE_REGISTRANT_RESPONSE,
  REAL_ESTATE_AGENTS,
  LAWYERS,
  BROKERS,
  ALCOHOL_LICENCES,
  TEMPORARY_EVENT_LICENCES,
  DEPARTED_REGISTRY_PERSON_RESPONSE,
} from './responses'

export const MOCK_PROPERTY_NUMBER_OK = '2003292'
export const MOCK_PROPERTY_NUMBER_NO_KMARKING = '2038390'
export const MOCK_PROPERTY_NUMBER_NOT_EXISTS = '12345678'

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
  rest.get(url('/api/Fasteignasalar'), (req, res, ctx) => {
    const success = req.url.searchParams.get('audkenni') ? true : false
    if (success) {
      return res(ctx.status(200), ctx.json(REAL_ESTATE_AGENTS))
    } else {
      return res(ctx.status(401), ctx.json(VHFAIL))
    }
  }),
  rest.get(url('/api/Logmannalisti'), (req, res, ctx) => {
    const success = req.url.searchParams.get('audkenni') ? true : false
    if (success) {
      return res(ctx.status(200), ctx.json(LAWYERS))
    } else {
      return res(ctx.status(401), ctx.json(VHFAIL))
    }
  }),
  rest.get(url('/api/Verdbrefamidlarar/:id'), (req, res, ctx) => {
    const success = req.params.id ? true : false
    if (success) {
      return res(ctx.status(200), ctx.json(BROKERS))
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
  rest.get(url('/api/VirkLeyfiCsv/:id'), (req, res, ctx) => {
    const success = req.params.id ? true : false
    if (success) {
      return res(ctx.status(200), ctx.body(OPERATING_LICENSES_CSV))
    } else {
      return res(ctx.status(401), ctx.json(VHFAIL))
    }
  }),
  rest.get(url('/api/Afengisleyfi/:id'), (req, res, ctx) => {
    const success = req.params.id ? true : false
    if (success) {
      return res(ctx.status(200), ctx.json(ALCOHOL_LICENCES))
    } else {
      return res(ctx.status(401), ctx.json(VHFAIL))
    }
  }),
  rest.get(url('/api/Taekifaerisleyfi/:id'), (req, res, ctx) => {
    const success = req.params.id ? true : false
    if (success) {
      return res(ctx.status(200), ctx.json(TEMPORARY_EVENT_LICENCES))
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
  rest.post(url('/api/LeitaAdKennitoluIThjodskra'), (req, res, ctx) => {
    const body = req.body as ThjodskraSkeyti
    const success = body?.kennitala === '0101302399'

    if (success) {
      return res(ctx.status(200), ctx.json(DEPARTED_REGISTRY_PERSON_RESPONSE))
    } else {
      return res(ctx.status(404))
    }
  }),
  rest.post(url('/api/v1/SyslMottakaGogn'), (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(DATA_UPLOAD))
  }),
  rest.post(url('/api/VedbokavottordRegluverki'), (req, res, ctx) => {
    const body = req.body as VedbandayfirlitSkeyti
    const assetId = body.fastanumer ?? ''
    const response = VEDBANDAYFIRLRIT_REGLUVERKI_RESPONSE
    switch ((body.tegundAndlags as number) ?? -1) {
      case AssetType.RealEstate: {
        if (!/f?\d+/.test(assetId)) return res(ctx.status(404), ctx.json([]))
        if (response.fasteign)
          response.fasteign[0].heiti = REAL_ESTATE_ADDRESS_NAME
        return res(ctx.status(200), ctx.json(response))
      }
      default: {
        if (response.fasteign) response.fasteign[0].heiti = 'INVALIDE'
        return res(ctx.status(200), ctx.json(response))
      }
    }
  }),
  rest.post(url('/api/Vedbokarvottord2'), (req, res, ctx) => {
    const body = req.body as VedbandayfirlitMargirSkeyti
    const { eignir } = body as {
      eignir: {
        fastanumer?: string
      }[]
    }
    if (eignir[0].fastanumer === MOCK_PROPERTY_NUMBER_OK) {
      return res(
        ctx.status(200),
        ctx.json({
          skilabodOgSkra: [
            { vedbandayfirlitPDFSkra: MORTGAGE_CERTIFICATE_CONTENT_OK },
          ],
        }),
      )
    } else if (eignir[0].fastanumer === MOCK_PROPERTY_NUMBER_NO_KMARKING) {
      return res(
        ctx.status(200),
        ctx.json({
          skilabodOgSkra: [
            {
              vedbandayfirlitPDFSkra: MORTGAGE_CERTIFICATE_CONTENT_NO_KMARKING,
              skilabod: MORTGAGE_CERTIFICATE_MESSAGE_NO_KMARKING,
            },
          ],
        }),
      )
    } else if (eignir[0].fastanumer === MOCK_PROPERTY_NUMBER_NOT_EXISTS) {
      return res(ctx.status(500), ctx.text('Internal Server Error'))
    } else {
      return res(
        ctx.status(200),
        ctx.json({ skilabodOgSkra: [{ vedbandayfirlitPDFSkra: '' }] }),
      )
    }
  }),
]
