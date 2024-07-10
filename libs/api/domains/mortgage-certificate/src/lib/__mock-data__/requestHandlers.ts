import { rest } from 'msw'
import { Identity, UserProfile } from '../mortgageCertificate.types'

export const MOCK_PROPERTY_NUMBER_OK = '2003292'

export const MockIdentityData: Identity = {
  nationalId: 'string',
  name: 'string',
  address: {
    streetAddress: 'string',
    city: 'string',
    postalCode: 'string',
  },
}

export const MockUserProfileData: UserProfile = {
  email: 'string',
  mobilePhoneNumber: 'string',
}

const DATA_UPLOAD: {
  skilabod: string
  audkenni: string
  malsnumer: string
} = {
  skilabod: 'Gögn móttekin',
  audkenni: 'string',
  malsnumer: 'string',
}

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
    }
    return res(
      ctx.status(200),
      ctx.json({
        skilabodOgSkra: [{ vedbandayfirlitPDFSkra: '' }],
      }),
    )
  }),
  rest.post(url('/api/v1/SyslMottakaGogn'), (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(DATA_UPLOAD))
  }),
]
