import { rest } from 'msw'
import { Test } from '@nestjs/testing'
import { startMocking } from '@island.is/shared/mocking'
import {
  PaymentService,
  PAYMENT_OPTIONS,
} from './payment'
import { Catalog, Item, Charge, ChargeResponse } from './payment.type'
import { Base64 } from 'js-base64'

// MOCK START
enum expectedResult {
  SUCCESS = 'success',
  NOT_FOUND = 'notFound',
  EMPTY = 'empty',
  SERVER_ERROR = 'serverError',
}
interface CatalogRestResponse {
  status: 200 | 404 | 500
  body?: Catalog
}

// we use ssn param to define success or error case here
const createCatalogResponse = (
  condition: expectedResult,
): CatalogRestResponse => {
  switch (condition) {
    case expectedResult.SUCCESS: {
      return {
        status: 200,
        body: {
          items: [
            {
              performingOrgID: '6509142520',
              chargeType: 'AY1',
              chargeItemCode: 'AY101',
              chargeItemName: 'Sakarvottorð',
              priceAmount: 2500.0
            },
            {
              performingOrgID: '6509142520',
              chargeType: 'AY1',
              chargeItemCode: 'AY120',
              chargeItemName: 'Heimagisting',
              priceAmount: 8500.0
            },
            {
              performingOrgID: '5301694059',
              chargeType: 'FO1',
              chargeItemCode: 'FO141',
              chargeItemName: 'Ferðaskrifstofuleyfi',
              priceAmount: 30000.0
            },
            {
              performingOrgID: '6702694779',
              chargeType: 'L31',
              chargeItemCode: 'L3101',
              chargeItemName: 'Staðfesting áritana',
              priceAmount: 2500.0
            },
          ],
        },
      }
    }
    case expectedResult.EMPTY: {
      return {
        status: 200,
        body: {
          items: []
        },
      }
    }
    case expectedResult.SERVER_ERROR: {
      return {
        status: 500,
      }
    }
    case expectedResult.NOT_FOUND:
    default: {
      return {
        status: 404,
      }
    }
  }
}

// we just check username to return fail. or success case
const hasAuth = (authHeader: string) => {
  const [username] = Base64.decode(authHeader.substring(6)).split(':')
  return username === expectedResult.SUCCESS
}

const domain = 'https://tbrws-s.hysing.is'
const paymentUrl = (path: string) => new URL(path, domain).toString()

const handlers = [
  // serve as an auth middleware
  rest.get('*', (req, res, ctx) => {
    if (!hasAuth(req.headers.get('Authorization') ?? '')) {
      return res(ctx.status(403), ctx.json(''))
    }
  }),
  rest.get(
    paymentUrl('/catalog'),
    (req, res, ctx) => {
      const { params } = req
      const response = createCatalogResponse(params.condition)
      return res(ctx.status(response.status), ctx.json(response?.body ?? ''))
    },
  ),
]

startMocking(handlers)
// MOCK END

const getNestModule = async (condition: expectedResult) => {
  const moduleRef = await Test.createTestingModule({
    providers: [
      PaymentService,
      {
        provide: PAYMENT_OPTIONS,
        useValue: {
          username: condition === 'empty' ? '' : condition, // this condition defines success or failure
          password: condition === 'empty' ? '' : 'pass123',
          url: domain,
        },
      },
    ],
  }).compile()

  return moduleRef.get<PaymentService>(PaymentService)
}

describe('getCatalog', () => {
  let paymentService: PaymentService

  beforeEach(async () => {
    paymentService = await getNestModule(expectedResult.SUCCESS)
  })

  it('should return success in the correct format', async () => {
    const successResults: Item[] = [
      {
        performingOrgID: '6509142520',
        chargeType: 'AY1',
        chargeItemCode: 'AY101',
        chargeItemName: 'Sakarvottorð',
        priceAmount: 2500.0
      },
      {
        performingOrgID: '6509142520',
        chargeType: 'AY1',
        chargeItemCode: 'AY120',
        chargeItemName: 'Heimagisting',
        priceAmount: 8500.0
      },
    ]
    const results = await paymentService.getCatalog()
    expect(results).toStrictEqual(successResults)
  })

  it('should throw on error', async () => {
    await expect(
      paymentService.getCatalog(expectedResult.NOT_FOUND),
    ).rejects.toThrow()
    await expect(
      paymentService.getCatalog(expectedResult.SERVER_ERROR),
    ).rejects.toThrow()
  })
})

describe('rsk auth', () => {
  it('should return error on failed auth', async () => {
    const paymentService = await getNestModule(expectedResult.SERVER_ERROR)
    await expect(
      paymentService.getCatalog(),
    ).rejects.toThrow()
  })

  it('should return error on empty auth', async () => {
    const paymentService = await getNestModule(expectedResult.EMPTY)
    await expect(
      paymentService.getCatalog(),
    ).rejects.toThrow()
  })
})
