import { getValueViaPath } from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import { IS_REPRESENTATIVE } from './constants'

export const getAssigneesNationalIdList = (application: Application) => {
  try {
    const assigneesNationalIdList = [] as string[]

    const landlords = getValueViaPath(
      application.answers,
      'landlordInfo.table',
      [],
    ) as Array<{
      nationalIdWithName: { nationalId: string }
      isRepresentative: string[]
    }>

    const tenants = getValueViaPath(
      application.answers,
      'tenantInfo.table',
      [],
    ) as Array<{
      nationalIdWithName: { nationalId: string }
      isRepresentative: string[]
    }>

    const filterLandlords = landlords.filter(
      ({ isRepresentative }) => !isRepresentative?.includes(IS_REPRESENTATIVE),
    )

    const filterTenants = tenants.filter(
      ({ isRepresentative }) => !isRepresentative?.includes(IS_REPRESENTATIVE),
    )

    filterLandlords?.map(({ nationalIdWithName: { nationalId } }) => {
      if (nationalId) {
        assigneesNationalIdList.push(nationalId)
        return nationalId
      }
    })

    filterTenants?.map(({ nationalIdWithName: { nationalId } }) => {
      if (nationalId) {
        assigneesNationalIdList.push(nationalId)
        return nationalId
      }
    })

    console.log('Assignees National Id List: ', assigneesNationalIdList)

    return assigneesNationalIdList
  } catch (error) {
    console.error(error)
  }
}
