import { ChargeItemCode } from '@island.is/shared/constants'
import {
  Application,
  BasicChargeItem,
  StaticText,
} from '@island.is/application/types'
import { HealthcareWorkPermit } from '../lib/dataSchema'
import { PermitProgram } from '../lib'

export const getChargeItems = (
  application: Application,
): Array<BasicChargeItem> => {
  return getChargeItemsWithExtraLabel(application).map((item) => ({
    code: item.chargeItemCode,
    quantity: item.chargeItemQuantity,
  }))
}

export const getChargeItemsWithExtraLabel = (
  application: Application,
): Array<{
  chargeItemCode: string
  chargeItemQuantity?: number
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
