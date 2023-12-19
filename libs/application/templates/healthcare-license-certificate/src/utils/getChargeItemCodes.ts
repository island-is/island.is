import { ChargeItemCode } from '@island.is/shared/constants'
import { Application, StaticText } from '@island.is/application/types'
import { HealthcareLicenseCertificate } from '../lib/dataSchema'
import { HealthcareLicense } from '@island.is/clients/health-directorate'

export const getChargeItemCodes = (application: Application): Array<string> => {
  return getChargeItemCodesAndExtraLabel(application).map(
    (x) => x.chargeItemCode,
  )
}

export const getChargeItemCodesAndExtraLabel = (
  application: Application,
): Array<{
  chargeItemCode: string
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
