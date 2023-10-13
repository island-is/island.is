import { Application } from '@island.is/application/types'
import { buildValidationError } from '@island.is/application/core'
import { buildError, validateReason } from './utils'
import { validatorErrorMessages } from '../messages'
import { AnswerValidationConstants } from '../constants'
import { getApplicationAnswers, convertDate, monthNumberFromString } from '../childPensionUtils'
import * as kennitala from 'kennitala'


export const validateSelectedChildren = (
  newAnswer: unknown,
  application: Application,
) => {
  const period = newAnswer as Record<string, string>
  const { VALIDATE_SELECTED_CHILDREN } = AnswerValidationConstants
  const { registeredChildren, selectedCustodyKids, selectedMonth, selectedYear } = getApplicationAnswers(
    application.answers
  )
  const monthNumber = monthNumberFromString(period.month)
  const pensionPeriod = [period.year, monthNumber, '01'].join("-")
  const childBirthdays: string[] = new Array()

  for (const [i, custodyChild] of selectedCustodyKids.entries()) {
    childBirthdays.push(convertDate(kennitala.info(custodyChild).birthdayReadable))
  }

  for (const [i, child] of registeredChildren.entries()) {
    if (kennitala.isValid(child.nationalIdOrBirthDate)) {
      childBirthdays.push(convertDate(kennitala.info(child.nationalIdOrBirthDate).birthdayReadable))
    } else {
      childBirthdays.push(child.nationalIdOrBirthDate)
    } 
  }
  
  const isEligableForChildPension = (bday: string) => bday < pensionPeriod
  if (!childBirthdays.some(isEligableForChildPension)) {
    return buildError(
      validatorErrorMessages.childPensionNoRightsForPeriod,
      `${VALIDATE_SELECTED_CHILDREN}`,
    )
  }   

  return undefined
}