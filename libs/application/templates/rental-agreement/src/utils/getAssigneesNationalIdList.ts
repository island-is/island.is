import { Application } from '@island.is/application/types'
import { IS_REPRESENTATIVE } from '../utils/utils'
import { applicationAnswers } from '../shared'

export const getAssigneesNationalIdList = (application: Application) => {
  try {
    const assigneesNationalIdList: string[] = []

    const { landlords, tenants } = applicationAnswers(application.answers)

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
    return []
  }
}
