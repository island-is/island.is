import { Application } from '@island.is/application/types'
import { differenceInDays } from 'date-fns'
import { errorMessages } from '../messages'
import {
  getApplicationAnswers,
  residentGrantIsOpenForApplication,
} from '../parentalLeaveUtils'
import { buildError } from './utils'

interface ResidenceGrantObject {
  fileUpload: any
  dateTo: string
  dateFrom: string
}

export const residenceGrantValidationSection = (
  newAnswer: unknown,
  application: Application,
) => {
  const { dateOfBirth } = application.answers
  const { hasMultipleBirths } = getApplicationAnswers(application.answers)

  const inputAnswer = newAnswer as ResidenceGrantObject
  if (inputAnswer.fileUpload) return undefined

  if (
    validatePeriodResidenceGrant(
      `${dateOfBirth}`,
      hasMultipleBirths,
      inputAnswer.dateFrom,
      inputAnswer.dateTo,
    )
  )
    return undefined

  return buildError(errorMessages.residenceGrantPeriodError, 'residenceGrant')
}

export const validatePeriodResidenceGrant = (
  childBirthDay: string,
  multipleBirths: string,
  dateFrom: string,
  dateTo: string,
) => {
  if (!residentGrantIsOpenForApplication(childBirthDay)) return false
  const from = dateFrom.split('-').map((item) => Number(item))
  const to = dateTo.split('-').map((item) => Number(item))

  if (from.length !== 3 && to.length !== 3) return false
  const toDate = new Date(to[0], to[1], to[2])
  const fromDate = new Date(from[0], from[1], from[2])

  const result = differenceInDays(toDate, fromDate)
  if (result < 15) return true
  if (result < 29 && multipleBirths === 'yes') return true
  return false
}
