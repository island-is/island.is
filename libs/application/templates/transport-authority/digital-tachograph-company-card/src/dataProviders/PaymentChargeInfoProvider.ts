import { PaymentCatalogItem } from '@island.is/api/schema'
import {
  SuccessfulDataProviderResult,
  FailedDataProviderResult,
} from '@island.is/application/types'
import { PaymentCatalogProvider } from '@island.is/application/data-providers'
import { m } from '../lib/messagesx'
import { ChargeItemCode } from '@island.is/shared/constants'

const CHARGE_ITEM_CODE = ChargeItemCode.TRANSPORT_AUTHORITY_XXX
const SYSLUMADUR_NATIONAL_ID = '6509142520'

export class PaymentChargeInfoProvider extends PaymentCatalogProvider {
  type = 'PaymentChargeInfoProvider'

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

  onProvideSuccess(
    result: Record<string, unknown>,
  ): SuccessfulDataProviderResult {
    return { date: new Date(), status: 'success', data: result }
  }
}
