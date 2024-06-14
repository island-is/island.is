import { Application } from '@island.is/application/types'
import { getValueViaPath } from '@island.is/application/core'
import { info } from 'kennitala'

export const checkForDiscount = (application: Application) => {
  const { answers } = application

  const hasDisability = getValueViaPath<boolean>(
    answers,
    'applicantInformation.hasDisabilityLicense',
  ) as boolean | undefined

  console.log('hasDisability', hasDisability)

  if (!hasDisability) {
    const { age } = info(application.applicant)

    if (age < 18 || age >= 60) {
      return true
    }
  }

  return hasDisability
}
