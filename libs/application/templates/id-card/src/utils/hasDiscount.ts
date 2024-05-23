import { Application } from '@island.is/application/types'
import { getValueViaPath } from '@island.is/application/core'
import { info } from 'kennitala'

export const checkForDiscount = (application: Application) => {
  const { externalData } = application

  const hasDisability = getValueViaPath<boolean>(
    externalData,
    'hasDisability.data',
  ) as boolean | undefined

  if (!hasDisability) {
    const { age } = info(application.applicant)

    if (age < 18 || age >= 60) {
      return true
    }
  }

  return hasDisability
}
