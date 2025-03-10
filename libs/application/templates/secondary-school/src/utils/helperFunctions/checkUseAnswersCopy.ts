import { Application } from '@island.is/application/types'
import { States } from '../enums'
import { getValueViaPath } from '@island.is/application/core'
import { SecondarySchoolAnswers } from '../..'

export const checkUseAnswersCopy = (application: Application): boolean => {
  // It is only relevant to look at copy answers in states IN_REVIEW and COMPLETED
  // (where we got the ping for state change while application was in EDIT state,
  // and resetting answers using copy was not done - action ABORT in EDIT state)
  const state = application.state
  if (state !== States.IN_REVIEW && state !== States.COMPLETED) return false

  // Picking any field in answers, that should not be empty in IN_REVIEW/COMPLETED state
  const applicant = getValueViaPath<SecondarySchoolAnswers['applicant']>(
    application.answers,
    'copy.applicant',
  )
  return !!applicant?.nationalId
}
