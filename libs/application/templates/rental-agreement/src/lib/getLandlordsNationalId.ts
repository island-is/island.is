import { getValueViaPath } from '@island.is/application/core'
import { Application } from '@island.is/application/types'

export const getLandlordsNationalId = (application: Application) => {
  try {
    const landlords = getValueViaPath(
      application.answers,
      'landlordInfo.table',
      [],
    ) as Array<{ nationalIdWithName: { nationalId: string } }>
    const landlordsNationalIds = landlords.map(
      (landlord) => landlord.nationalIdWithName.nationalId,
    )
    console.log(landlordsNationalIds)
    return landlordsNationalIds
  } catch (error) {
    console.error(error)
  }
}
