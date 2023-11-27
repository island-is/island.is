import { PropertyDetail } from '@island.is/api/schema'
import { Application, StaticText } from '@island.is/application/types'
import { ChargeItemCode } from '@island.is/shared/constants'

export const getChargeItemCodes = (application: Application): Array<string> => {
  return getChargeItemCodesAndExtraLabel(application).map(
    (x) => x.chargeItemCode,
  )
}

export const getChargeItemCodesAndExtraLabel = (
  application: Application,
): Array<{ chargeItemCode: string; extraLabel?: StaticText }> => {
  const { externalData } = application

  const { propertyDetails } = externalData.validateMortgageCertificate
    ?.data as {
    propertyDetails: PropertyDetail
  }

  const result: Array<{ chargeItemCode: string; extraLabel?: StaticText }> = []

  result.push({
    chargeItemCode: ChargeItemCode.MORTGAGE_CERTIFICATE.toString(),
    extraLabel: `${propertyDetails?.propertyNumber} - ${propertyDetails?.defaultAddress?.display}`,
  })

  return result
}
