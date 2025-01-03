import { getValueViaPath } from '@island.is/application/core'
import { ExternalData } from '@island.is/application/types'

export const isProcure = (externalData: ExternalData) => {
  const applicantType = getValueViaPath<string>(
    externalData,
    'identity.data.type',
  )

  return applicantType !== 'person'
}
