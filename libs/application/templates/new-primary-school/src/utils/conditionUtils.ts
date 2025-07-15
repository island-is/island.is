import { YES } from '@island.is/application/core'
import { ExternalData, FormValue } from '@island.is/application/types'
import {
  getApplicationExternalData,
  getApplicationAnswers,
} from '../lib/newPrimarySchoolUtils'

export const isCurrentSchoolRegistered = (externalData: ExternalData) => {
  const { primaryOrgId } = getApplicationExternalData(externalData)
  return !!primaryOrgId
}

export const isWelfareContactSelected = (answers: FormValue) => {
  const { hasDiagnoses, hasHadSupport, hasWelfareContact } =
    getApplicationAnswers(answers)

  return (
    (hasDiagnoses === YES || hasHadSupport === YES) && hasWelfareContact === YES
  )
}
