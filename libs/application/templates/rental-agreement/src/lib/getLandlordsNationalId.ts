import { getValueViaPath } from '@island.is/application/core'
import { Application } from '@island.is/application/types'

export const getNationalIdListOfAssignees = (application: Application) => {
  try {
    const assigneeNationalIdsList = [] as string[]

    const landlords = getValueViaPath(
      application.answers,
      'landlordInfo.table',
      [],
    ) as Array<{ nationalIdWithName: { nationalId: string } }>

    const tenants = getValueViaPath(
      application.answers,
      'tenantInfo.table',
      [],
    ) as Array<{ nationalIdWithName: { nationalId: string } }>

    landlords?.map(({ nationalIdWithName: { nationalId } }) => {
      if (nationalId) {
        assigneeNationalIdsList.push(nationalId)
        return nationalId
      }
    })

    tenants?.map(({ nationalIdWithName: { nationalId } }) => {
      if (nationalId) {
        assigneeNationalIdsList.push(nationalId)
        return nationalId
      }
    })

    return assigneeNationalIdsList
  } catch (error) {
    console.error(error)
  }
}
