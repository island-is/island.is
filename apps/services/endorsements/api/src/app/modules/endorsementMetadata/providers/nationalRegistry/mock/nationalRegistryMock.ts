import * as faker from 'faker'
import { rest } from 'msw'
import { environment } from '../../../../../../environments'

const nationalRegistryDomain = 'http://localhost:8081'
const nationalRegistryPathPrefix =
  '/r1/IS-DEV/GOV/10001/SKRA-Protected/Einstaklingar-v1'
const nationalRegistryUrl = (path: string) =>
  new URL(
    `${nationalRegistryPathPrefix}${path}`,
    nationalRegistryDomain,
  ).toString()

const authUrl = (path: string) =>
  new URL(
    path,
    environment.metadataProvider.authMiddlewareOptions.tokenExchangeOptions.issuer,
  ).toString()

export const handlers = [
  rest.post(authUrl('/connect/token'), (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        issued_token_type: 'urn:ietf:params:oauth:token-type:access_token',
        token_type: 'Bearer',
        access_token: 'totalyALegitAuthToken',
      }),
    )
  }),

  rest.get(
    nationalRegistryUrl('/api/v1/einstaklingar/:nationalId'),
    (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({
          fulltNafn: 'Tester Testson',
          nafn: 'Tester',
          logheimili: {
            heiti: faker.address.streetAddress,
            stadur: faker.address.city,
            postnumer: faker.phone.phoneNumber('###'),
          },
        }),
      )
    },
  ),
]
