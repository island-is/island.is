import { getValueViaPath } from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'
import { TrainingLicenseOnAWorkMachineAnswers } from '../lib/dataSchema'

export const getUserInfo = (answers: FormValue, userNationalId: string) => {
  const assigneeInformation = getValueViaPath<
    TrainingLicenseOnAWorkMachineAnswers['assigneeInformation']
  >(answers, 'assigneeInformation')
  const userInfo = assigneeInformation?.find(
    ({ assignee }) => assignee.nationalId === userNationalId,
  )
  return userInfo
}
