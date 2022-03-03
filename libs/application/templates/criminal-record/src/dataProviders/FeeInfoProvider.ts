import { PaymentCatalogItem } from '@island.is/api/schema'
import {
  FailedDataProviderResult,
  SuccessfulDataProviderResult,
} from '@island.is/application/core'
import { PaymentCatalogProvider } from '@island.is/application/data-providers'
import { ChargeItemCode } from '@island.is/shared/constants'

import { m } from '../lib/messages'

const CHARGE_ITEM_CODE = ChargeItemCode.CRIMINAL_RECORD
const SYSLUMADUR_NATIONAL_ID = '6509142520'

export class FeeInfoProvider extends PaymentCatalogProvider {
  type = 'FeeInfoProvider'

  async provide(): Promise<PaymentCatalogItem | undefined> {
    const items =
      (await this.getCatalogForOrganization(SYSLUMADUR_NATIONAL_ID)) || []
    return items.find(
      ({ chargeItemCode }) => chargeItemCode === CHARGE_ITEM_CODE,
    )
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
