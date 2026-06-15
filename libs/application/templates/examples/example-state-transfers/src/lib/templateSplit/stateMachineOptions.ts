import { getValueViaPath } from '@island.is/application/core'
import {
  ApplicationContext,
  ApplicationStatus,
} from '@island.is/application/types'
import set from 'lodash/set'
import { ActionFunction, ActionObject, assign } from 'xstate'
import { Events } from '../../utils/types'

type StateMachineAction =
  | ActionObject<ApplicationContext, Events>
  | ActionFunction<ApplicationContext, Events>

export const approveApplication: StateMachineAction = assign(
  (context: ApplicationContext) => {
    const { application } = context
    const { answers } = application

    set(answers, 'reviewApproval', ApplicationStatus.APPROVED)

    return context
  },
)

export const rejectApplication: StateMachineAction = assign(
  (context: ApplicationContext) => {
    const { application } = context
    const { answers } = application

    set(answers, 'reviewApproval', ApplicationStatus.REJECTED)

    return context
  },
)

export const assignUser: StateMachineAction = assign(
  (context: ApplicationContext) => {
    const { application } = context
    const assigneeId = getValueViaPath<string>(
      application.answers,
      'assigneeNationalIdWithName.nationalId',
    )

    if (assigneeId) {
      set(application, 'assignees', [assigneeId])
    }

    return context
  },
)

export const unAssignUser: StateMachineAction = assign(
  (context: ApplicationContext) => {
    const { application } = context
    set(application, 'assignees', [])

    return context
  },
)
