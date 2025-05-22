import { Application } from '@island.is/application/types'
import { BasicChargeItem } from '@island.is/application/types'
import { getValueViaPath } from '@island.is/application/core'
import { CatalogItem } from '@island.is/clients/charge-fjs-v2'

export const getCodes = (application: Application): Array<BasicChargeItem> => {
  const paymentCode = getValueViaPath<CatalogItem['chargeItemCode']>(
    application.externalData,
    'paymentCode',
  )

  if (!paymentCode) {
    throw new Error('No payment code found')
  }

  return [{ code: paymentCode }]
}
