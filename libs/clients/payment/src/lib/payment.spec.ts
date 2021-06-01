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
          "item": [
            {
              "performingOrgID": "6509142520",
              "chargeType": "AY1",
              "chargeItemCode": "AY101",
              "chargeItemName": "Sakarvottorð",
              "priceAmount": 2500
            },
            {
              "performingOrgID": "6509142520",
              "chargeType": "AY1",
              "chargeItemCode": "AY102",
              "chargeItemName": "Veðbókarvottorð",
              "priceAmount": 2000
            },
            {
              "performingOrgID": "6509142520",
              "chargeType": "AY1",
              "chargeItemCode": "AY110",
              "chargeItemName": "Ökuskírteini",
              "priceAmount": 8000
            },
            {
              "performingOrgID": "6509142520",
              "chargeType": "AY1",
              "chargeItemCode": "AY111",
              "chargeItemName": "Ökuskírteini fyrir flokka M&T",
              "priceAmount": 4000
            },
            {
              "performingOrgID": "6509142520",
              "chargeType": "AY1",
              "chargeItemCode": "AY112",
              "chargeItemName": "Alþjóðlegt ökuskírteini",
              "priceAmount": 1200
            },
            {
              "performingOrgID": "6509142520",
              "chargeType": "AY1",
              "chargeItemCode": "AY113",
              "chargeItemName": "Skírteini fyrir 65 ára & eldri",
              "priceAmount": 1650
            },
            {
              "performingOrgID": "6509142520",
              "chargeType": "AY1",
              "chargeItemCode": "AY114",
              "chargeItemName": "Bráðabirgðaökuskírteini",
              "priceAmount": 4000
            },
            {
              "performingOrgID": "6509142520",
              "chargeType": "AY1",
              "chargeItemCode": "AY120",
              "chargeItemName": "Heimagisting",
              "priceAmount": 8500
            },
            {
              "performingOrgID": "6509142520",
              "chargeType": "AY1",
              "chargeItemCode": "AY121",
              "chargeItemName": "Gististaður án veitinga",
              "priceAmount": 32000
            },
            {
              "performingOrgID": "6509142520",
              "chargeType": "AY1",
              "chargeItemCode": "AY122",
              "chargeItemName": "Gististaður með veitingum",
              "priceAmount": 40000
            },
            {
              "performingOrgID": "6509142520",
              "chargeType": "AY1",
              "chargeItemCode": "AY123",
              "chargeItemName": "Gististaður með áfengisveitingum",
              "priceAmount": 263000
            },
            {
              "performingOrgID": "5301694059",
              "chargeType": "FO1",
              "chargeItemCode": "FO141",
              "chargeItemName": "Ferðaskrifstofuleyfi",
              "priceAmount": 30000
            },
            {
              "performingOrgID": "5301694059",
              "chargeType": "FO1",
              "chargeItemCode": "FO142",
              "chargeItemName": "Yfirferðar bókhaldsgagna",
              "priceAmount": 28000
            },
            {
              "performingOrgID": "5301694059",
              "chargeType": "FO1",
              "chargeItemCode": "FO143",
              "chargeItemName": "Leyfi ferðasala - dagsferðir",
              "priceAmount": 20000
            },
            {
              "performingOrgID": "5301694059",
              "chargeType": "FO1",
              "chargeItemCode": "FO144",
              "chargeItemName": "Skráningargjald upplýsingam.",
              "priceAmount": 15000
            },
            {
              "performingOrgID": "5301694059",
              "chargeType": "FO1",
              "chargeItemCode": "FO145",
              "chargeItemName": "Þjónustugjöld",
              "priceAmount": 1000
            },
            {
              "performingOrgID": "5301694059",
              "chargeType": "FO1",
              "chargeItemCode": "FO146",
              "chargeItemName": "Endurmat tryggingarfjárhæðar",
              "priceAmount": 25000
            },
            {
              "performingOrgID": "6702696399",
              "chargeType": "L11",
              "chargeItemCode": "L1101",
              "chargeItemName": "Umsókn um ríkisborgararétt",
              "priceAmount": 25000
            },
            {
              "performingOrgID": "6611913099",
              "chargeType": "L21",
              "chargeItemCode": "L2101",
              "chargeItemName": "Búsforræðisvottorð",
              "priceAmount": 2500
            },
            {
              "performingOrgID": "6702694779",
              "chargeType": "L31",
              "chargeItemCode": "L3101",
              "chargeItemName": "Staðfesting áritana",
              "priceAmount": 2500
            }
          ]
        },
      }
    }
    case expectedResult.EMPTY: {
      return {
        status: 200,
        body: {
          item: []
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
      paymentService.getCatalog(),
    ).rejects.toThrow()
    await expect(
      paymentService.getCatalog(),
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
