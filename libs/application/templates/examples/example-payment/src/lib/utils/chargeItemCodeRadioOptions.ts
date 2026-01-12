/* eslint-disable local-rules/disallow-kennitalas */
import { Application } from '@island.is/application/types'
import { PaymentCatalogItem } from '@island.is/application/types'

const orgIdToName = (orgId: string): string => {
  switch (orgId) {
    case '6509142520':
      return 'Sýslumaðurinn á höfuðborgarsvæðinu'
    case '5301694059':
      return 'Ferðamálastofa'
    case '6702696399':
      return 'Útlendingastofnun'
    case '6611913099':
      return 'Héraðsdómur Reykjavíkur'
    case '6702694779':
      return 'Utanríkisráðuneyti'
    case '6708140330':
      return 'Lögreglustjórinn á Norðurl vest'
  }

  return '?'
}

const formatPrice = (price: number) => `kr. ${price.toLocaleString('de-DE')}`

export const chargeItemCodeRadioOptions = ({
  externalData: {
    payment: { data },
  },
}: Application) => {
  return (data as PaymentCatalogItem[]).map(
    ({ chargeItemCode, chargeItemName, performingOrgID, priceAmount }) => {
      return {
        value: chargeItemCode,
        subLabel: `${orgIdToName(performingOrgID)} (${performingOrgID})`,
        label: `${chargeItemName} (${chargeItemCode}) - ${formatPrice(
          priceAmount,
        )}`,
      }
    },
  )
}
