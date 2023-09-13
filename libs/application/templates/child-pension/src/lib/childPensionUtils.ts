import { getValueViaPath } from '@island.is/application/core'

import { Application } from '@island.is/application/types'

export function getApplicationAnswers(answers: Application['answers']) {
  const applicantEmail = getValueViaPath(
    answers,
    'applicantInfo.email',
  ) as string

  const applicantPhonenumber = getValueViaPath(
    answers,
    'applicantInfo.phonenumber',
  ) as string

  return {
    applicantEmail,
    applicantPhonenumber,
  }
}

export function getApplicationExternalData(
  externalData: Application['externalData'],
) {
  const applicantName = getValueViaPath(
    externalData,
    'nationalRegistry.data.fullName',
  ) as string

  const applicantNationalId = getValueViaPath(
    externalData,
    'nationalRegistry.data.nationalId',
  ) as string

  return {
    applicantName,
    applicantNationalId,
  }
}
