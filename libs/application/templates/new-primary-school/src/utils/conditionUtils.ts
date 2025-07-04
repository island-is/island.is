import { YES } from '@island.is/application/core'
import { getApplicationAnswers } from '../lib/newPrimarySchoolUtils'
import { FormValue } from '@island.is/application/types'

export const isWelfareContactSelected = (answers: FormValue) => {
  const { hasDiagnoses, hasHadSupport, hasWelfareContact } =
    getApplicationAnswers(answers)

  return (
    (hasDiagnoses === YES || hasHadSupport === YES) && hasWelfareContact === YES
  )
}
