import { getValueViaPath } from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import { IS_REPRESENTATIVE } from './constants'

export const getAssigneesNationalIdList = (application: Application) => {
  try {
    const assigneesNationalIdList: string[] = []

    type IdAndRep = {
      nationalIdWithName: { nationalId: string }
      isRepresentative: string[]
    }

    const landlords = getValueViaPath<Array<IdAndRep>>(
      application.answers,
      'landlordInfo.table',
      [],
    )

    const tenants = getValueViaPath<Array<IdAndRep>>(
      application.answers,
      'tenantInfo.table',
      [],
    )

    const filterLandlords = landlords?.filter(
      ({ isRepresentative }) => !isRepresentative?.includes(IS_REPRESENTATIVE),
    )

    const filterTenants = tenants?.filter(
      ({ isRepresentative }) => !isRepresentative?.includes(IS_REPRESENTATIVE),
    )

    filterLandlords?.forEach(({ nationalIdWithName: { nationalId } }) => {
      if (!nationalId) return null
      assigneesNationalIdList.push(nationalId)
      return nationalId
    })

    filterTenants?.forEach(({ nationalIdWithName: { nationalId } }) => {
      if (!nationalId) return null

      assigneesNationalIdList.push(nationalId)
      return nationalId
    })

    return assigneesNationalIdList
  } catch (error) {
    console.error(error)
  }
}
