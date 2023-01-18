import { ApplicationContext } from '@island.is/application/types'

import {
  YES,
  NO,
  PARENTAL_LEAVE,
  PARENTAL_GRANT,
  PARENTAL_GRANT_STUDENTS,
} from '../constants'
import { requiresOtherParentApproval } from '../lib/parentalLeaveUtils'
import { EmployerRow } from '../types';
import { getValueViaPath } from '@island.is/application/core';

export function allEmployersHaveApproved(context: ApplicationContext) {
  const employers = getValueViaPath<EmployerRow[]>(context.application.answers, 'employers');
  if (!employers) { return false; }
  return employers.every(e => !!e.isApproved);
}

export function hasEmployer(context: ApplicationContext) {
  const currentApplicationAnswers = context.application.answers as {
    isReceivingUnemploymentBenefits: typeof YES | typeof NO
    applicationType: {
      option:
        | typeof PARENTAL_LEAVE
        | typeof PARENTAL_GRANT
        | typeof PARENTAL_GRANT_STUDENTS
    }
    isSelfEmployed: typeof YES | typeof NO
  }

  // Added this check for applications that is in the db already so they can go through to next state
  if (currentApplicationAnswers.applicationType === undefined) {
    if (
      currentApplicationAnswers.isReceivingUnemploymentBenefits !== undefined
    ) {
      return (
        currentApplicationAnswers.isSelfEmployed === NO &&
        currentApplicationAnswers.isReceivingUnemploymentBenefits === NO
      )
    }

    return currentApplicationAnswers.isSelfEmployed === NO
  } else
    return currentApplicationAnswers.applicationType.option === PARENTAL_LEAVE
      ? currentApplicationAnswers.isSelfEmployed === NO &&
          currentApplicationAnswers.isReceivingUnemploymentBenefits === NO
      : false
}

export function needsOtherParentApproval(context: ApplicationContext) {
  return requiresOtherParentApproval(
    context.application.answers,
    context.application.externalData,
  )
}

export function currentDateStartTime() {
  const date = new Date().toDateString()
  return new Date(date).getTime()
}
