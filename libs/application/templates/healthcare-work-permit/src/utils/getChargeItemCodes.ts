import { ChargeItemCode } from '@island.is/shared/constants'
import { Application, StaticText } from '@island.is/application/types'
import { HealthcareWorkPermit } from '../lib/dataSchema'

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
  const answers = application.answers as HealthcareWorkPermit

  // TODO Get Id instead of studyProgram string, fetch programme via id and display info.

  // const licenses = application?.externalData?.healthcareLicenses
  //   ?.data as HealthcareLicense[]

  const result = []
  result.push({
    chargeItemCode: ChargeItemCode.HEALTHCARE_WORK_PERMIT.toString(),
    extraLabel: answers.selectWorkPermit.studyProgram,
  })

  return result
}
