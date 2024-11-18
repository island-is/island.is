import { ChargeItemCode } from '@island.is/shared/constants'
import {
  Application,
  ChargeCodeItem,
  StaticText,
} from '@island.is/application/types'
import { HealthcareWorkPermit } from '../lib/dataSchema'
import { PermitProgram } from '../lib'

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
