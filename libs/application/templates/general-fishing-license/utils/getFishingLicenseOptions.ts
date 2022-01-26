import { useQuery } from '@apollo/client'
import { FormValue, getValueViaPath } from '@island.is/application/core'
import { queryFishingLicense } from '../src/graphql/queries'
import { fishingLicense } from '../src/lib/messages'
import { FishingLicenseEnum } from '../src/types'

export const getFishingLicenseOptions = (answers: FormValue) => {
  const registrationNumber = getValueViaPath(
    answers,
    'shipSelection.registrationNumber',
  ) as string
  console.log(registrationNumber)
  /* const { data } = useQuery(queryFishingLicense, {
    variables: {
      registrationNumber
    }
  })
  
  console.log(data) */

  const options = [
    {
      value: FishingLicenseEnum.HOOKCATCHLIMIT,
      label: fishingLicense.labels.hookCatchLimit,
      tooltip: fishingLicense.labels.hookCatchLimitTooltip,
    },
    {
      value: FishingLicenseEnum.CATCHLIMIT,
      label: fishingLicense.labels.catchLimit,
      tooltip: fishingLicense.labels.catchLimitTooltip,
    },
  ]
  return options
}
