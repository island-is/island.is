import { Application } from '@island.is/application/types'
import { applicationAnswers } from '../shared'

export const getAssigneesNationalIdList = (application: Application) => {
  try {
    const assigneesNationalIdList: string[] = []

    const { landlords, tenants } = applicationAnswers(application.answers)

    landlords?.forEach(({ nationalIdWithName: { nationalId } }) => {
      if (!nationalId) return null
      assigneesNationalIdList.push(nationalId)
      return nationalId
    })

    tenants?.forEach(({ nationalIdWithName: { nationalId } }) => {
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
