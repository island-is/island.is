import { ChargeItemCode } from '@island.is/shared/constants'
import { Application, StaticText } from '@island.is/application/types'
import { HealthcareWorkPermit } from '../lib/dataSchema'
import { PermitProgram } from '../lib'

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

  const permitPrograms = application.externalData.permitOptions
    .data as PermitProgram[]
  const chosenProgram = permitPrograms.find(
    (program) => program.programId === answers.selectWorkPermit.programId,
  )

  const result = []
  result.push({
    chargeItemCode: ChargeItemCode.HEALTHCARE_WORK_PERMIT.toString(),
    extraLabel: chosenProgram?.name,
  })

  return result
}
