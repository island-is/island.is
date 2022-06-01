import { PaymentCatalogItem } from '@island.is/api/schema'
import {
  SuccessfulDataProviderResult,
  FailedDataProviderResult,
} from '@island.is/application/core'
import { PaymentCatalogProvider } from '@island.is/application/data-providers'
import { m } from '../lib/messages'

const CHARGE_ITEM_CODES = ['AY105', 'AY106', 'AY107', 'AY108']

const SYSLUMADUR_NATIONAL_ID = '6509142520'

export class FeeInfoProvider extends PaymentCatalogProvider {
  type = 'FeeInfoProvider'

  async provide(): Promise<PaymentCatalogItem[]> {
    const items =
      (await this.getCatalogForOrganization(SYSLUMADUR_NATIONAL_ID)) || []
    // return items.filter(({ chargeItemCode }) =>
    //   CHARGE_ITEM_CODES.includes(chargeItemCode),
    // )
    const mock = [
      {
        performingOrgID: '6509142520',
        chargeType: 'AY1',
        chargeItemCode: 'AY105',
        chargeItemName: 'Vegabréf, almennt gjald',
        priceAmount: 13000,
      },
      {
        performingOrgID: '6509142520',
        chargeType: 'AY1',
        chargeItemCode: 'AY106',
        chargeItemName: 'Vegabréf, skyndiútgáfa',
        priceAmount: 26000,
      },
      {
        performingOrgID: '6509142520',
        chargeType: 'AY1',
        chargeItemCode: 'AY107',
        chargeItemName: 'Vegabréf, aðrir almennt gjald',
        priceAmount: 5600,
      },
      {
        performingOrgID: '6509142520',
        chargeType: 'AY1',
        chargeItemCode: 'AY108',
        chargeItemName: 'Vegabréf, aðrir skyndiútgáfa',
        priceAmount: 11000,
      },
    ]
    return mock
  }

  onProvideError(result: string): FailedDataProviderResult {
    return {
      date: new Date(),
      reason: m.errorDataProvider,
      status: 'failure',
      data: result,
    }
  }

  onProvideSuccess(result: object): SuccessfulDataProviderResult {
    return { date: new Date(), status: 'success', data: result }
  }
}
