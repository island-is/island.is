import { Application } from '@island.is/application/types'
import { getValueViaPath } from '@island.is/application/core'
import { info } from 'kennitala'

export const checkForDiscount = (application: Application) => {
  const { answers } = application

  //so applicant is applying for a child
  if (application.applicant !== answers.chosenApplicants) {
    return true
  }

  const hasDisability = getValueViaPath<boolean>(
    answers,
    'applicantInformation.hasDisabilityLicense',
  ) as boolean | undefined

  if (!hasDisability) {
    const { age } = info(application.applicant)

    if (age < 18 || age >= 60) {
      return true
    }
  }

  return hasDisability
}
