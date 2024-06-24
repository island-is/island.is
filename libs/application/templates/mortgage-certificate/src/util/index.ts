import { PropertyDetail } from '@island.is/api/schema'
import { getValueViaPath } from '@island.is/application/core'
import { Application, StaticText } from '@island.is/application/types'
import { ChargeItemCode } from '@island.is/shared/constants'
import { SelectedProperty } from '../shared'

export const getChargeItemCodes = (application: Application): Array<string> => {
  return getChargeItemCodesAndExtraLabel(application).map(
    (x) => x.chargeItemCode,
  )
}

export const getChargeItemCodesAndExtraLabel = (
  application: Application,
): Array<{ chargeItemCode: string; extraLabel?: StaticText }> => {
  const properties = getValueViaPath(
    application.answers,
    'selectedProperties.properties',
    [],
  ) as SelectedProperty[]

  const result: Array<{ chargeItemCode: string; extraLabel?: StaticText }> = []

  properties.map((property) => {
    result.push({
      chargeItemCode: ChargeItemCode.MORTGAGE_CERTIFICATE.toString(),
      extraLabel: `${property?.propertyName}`,
    })
  })

  console.log(result)

  return result
}
