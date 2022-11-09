import { PaymentCatalogItem } from '@island.is/api/schema'
import {
  SuccessfulDataProviderResult,
  FailedDataProviderResult,
} from '@island.is/application/types'
import { PaymentCatalogProvider } from '@island.is/application/data-providers'
import { m } from '../lib/messagesx'
import { ChargeItemCode } from '@island.is/shared/constants'

const CHARGE_ITEM_CODES = [
  ChargeItemCode.TRANSPORT_AUTHORITY_DIGITAL_TACHOGRAPH_DRIVERS_CARD.toString(),
  ChargeItemCode.TRANSPORT_AUTHORITY_DIGITAL_TACHOGRAPH_DRIVERS_CARD_WITH_SHIPPING.toString(),
]
const SYSLUMADUR_NATIONAL_ID = '6509142520'

export class PaymentChargeInfoProvider extends PaymentCatalogProvider {
  type = 'PaymentChargeInfoProvider'

  async provide(): Promise<PaymentCatalogItem[]> {
    const items =
      (await this.getCatalogForOrganization(SYSLUMADUR_NATIONAL_ID)) || []
    return items.filter(({ chargeItemCode }) =>
      CHARGE_ITEM_CODES.includes(chargeItemCode),
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
