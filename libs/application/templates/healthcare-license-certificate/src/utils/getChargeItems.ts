import { ChargeItemCode } from '@island.is/shared/constants'
import {
  Application,
  ChargeCodeItem,
  StaticText,
} from '@island.is/application/types'
import { HealthcareLicenseCertificate } from '../lib/dataSchema'
import { HealthcareLicense } from '@island.is/clients/health-directorate'

export const getChargeCodeItems = (
  application: Application,
): Array<ChargeCodeItem> => {
  return getChargeCodeItemsWithExtraLabel(application).map((item) => ({
    code: item.chargeItemCode,
    quantity: item.chargeItemQuantity,
  }))
}

export const getChargeCodeItemsWithExtraLabel = (
  application: Application,
): Array<{
  chargeItemCode: string
  chargeItemQuantity?: number
  extraLabel?: StaticText
}> => {
  const answers = application.answers as HealthcareLicenseCertificate

  const licenses = application?.externalData?.healthcareLicenses
    ?.data as HealthcareLicense[]

  const result = []
  const professionIds = answers.selectLicence.professionIds || []
  for (let i = 0; i < professionIds.length; i++) {
    const selectedLicense = licenses.find(
      (x) => x.professionId === professionIds[i],
    )
    result.push({
      chargeItemCode: ChargeItemCode.HEALTHCARE_LICENSE_CERTIFICATE.toString(),
      extraLabel: selectedLicense?.professionNameIs,
    })
  }

  return result
}
