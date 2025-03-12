import { getValueViaPath } from '@island.is/application/core'
import { Application, BasicChargeItem } from '@island.is/application/types'

export const getChargeItems = (
  application: Application,
): Array<BasicChargeItem> => {
  const codeFromVer = getValueViaPath<string>(
    application.externalData,
    'seminar.data.feeCodeDirectPayment',
  )
  return [{ code: codeFromVer || '' }]
}
