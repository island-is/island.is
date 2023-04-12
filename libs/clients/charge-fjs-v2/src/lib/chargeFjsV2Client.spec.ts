import type { Catalog } from './chargeFjsV2Client.types'
import { ChargeItemCode } from '@island.is/shared/constants'

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
          item: [
            {
              performingOrgID: '6509142520',
              chargeType: 'AY1',
              chargeItemCode: ChargeItemCode.CRIMINAL_RECORD,
              chargeItemName: 'Sakarvottorð',
              priceAmount: 2500,
            },
            {
              performingOrgID: '6509142520',
              chargeType: 'AY1',
              chargeItemCode: ChargeItemCode.MORTGAGE_CERTIFICATE,
              chargeItemName: 'Veðbókarvottorð',
              priceAmount: 2000,
            },
            {
              performingOrgID: '6509142520',
              chargeType: 'AY1',
              chargeItemCode: 'AY110',
              chargeItemName: 'Ökuskírteini',
              priceAmount: 8000,
            },
            {
              performingOrgID: '6509142520',
              chargeType: 'AY1',
              chargeItemCode: 'AY111',
              chargeItemName: 'Ökuskírteini fyrir flokka M&T',
              priceAmount: 4000,
            },
          ],
        },
      }
    }
    case expectedResult.EMPTY: {
      return {
        status: 200,
        body: {
          item: [],
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

describe('getCatalog', () => {
  it('should return success in the correct format', async () => {
    const successResults = {
      status: 200,
      body: {
        item: [
          {
            performingOrgID: '6509142520',
            chargeType: 'AY1',
            chargeItemCode: ChargeItemCode.CRIMINAL_RECORD,
            chargeItemName: 'Sakarvottorð',
            priceAmount: 2500,
          },
          {
            performingOrgID: '6509142520',
            chargeType: 'AY1',
            chargeItemCode: ChargeItemCode.MORTGAGE_CERTIFICATE,
            chargeItemName: 'Veðbókarvottorð',
            priceAmount: 2000,
          },
          {
            performingOrgID: '6509142520',
            chargeType: 'AY1',
            chargeItemCode: 'AY110',
            chargeItemName: 'Ökuskírteini',
            priceAmount: 8000,
          },
          {
            performingOrgID: '6509142520',
            chargeType: 'AY1',
            chargeItemCode: 'AY111',
            chargeItemName: 'Ökuskírteini fyrir flokka M&T',
            priceAmount: 4000,
          },
        ],
      },
    }

    const results = createCatalogResponse(expectedResult.SUCCESS)
    expect(results).toStrictEqual(successResults)
  })
})
