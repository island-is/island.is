import { getValueViaPath } from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import { IS_REPRESENTATIVE } from './constants'

// TODO: Add here function for extracting tenant wihtout representative, email name etc

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

    filterLandlords?.forEach(({ nationalIdWithName: { nationalId } }) => {
      if (nationalId) {
        assigneesNationalIdList.push(nationalId)
        return nationalId
      } else return null
    })

    filterTenants?.forEach(({ nationalIdWithName: { nationalId } }) => {
      if (nationalId) {
        assigneesNationalIdList.push(nationalId)
        return nationalId
      } else return null
    })

    return assigneesNationalIdList
  } catch (error) {
    console.error(error)
  }
}
