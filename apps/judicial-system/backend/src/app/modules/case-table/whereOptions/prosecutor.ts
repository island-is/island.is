import { Op } from 'sequelize'

import {
  CaseState,
  completedIndictmentCaseStates,
  indictmentCases,
  type User as TUser,
} from '@island.is/judicial-system/types'

// prosecutor

const indictmentSharedWhereOptions = {
  is_archived: false,
  type: indictmentCases,
}

const prosecutorIndictmentSharedWhereOptions = (user: TUser) => ({
  ...indictmentSharedWhereOptions,
  [Op.or]: [{ creating_prosecutor_id: user.id }, { prosecutor_id: user.id }],
})

const prosecutorIndictmentInProgressWhereOptions = {
  state: {
    [Op.notIn]: [
      ...completedIndictmentCaseStates,
      CaseState.DELETED,
      CaseState.WAITING_FOR_CANCELLATION,
      CaseState.WAITING_FOR_CONFIRMATION,
    ],
  },
}

const prosecutorIndictmentWaitingForConfirmationWhereOptions = {
  state: [CaseState.WAITING_FOR_CONFIRMATION],
}

const prosecutorIndictmentCompletedWhereOptions = {
  state: [CaseState.COMPLETED],
}

export const getProsecutorIndictmentWaitingForConfirmationWhereOptions = (
  user: TUser,
) => ({
  ...prosecutorIndictmentSharedWhereOptions(user),
  ...prosecutorIndictmentWaitingForConfirmationWhereOptions,
})

export const getProsecutorIndictmentInProgressWhereOptions = (user: TUser) => ({
  ...prosecutorIndictmentSharedWhereOptions(user),
  ...prosecutorIndictmentInProgressWhereOptions,
})

export const getProsecutorIndictmentCompletedWhereOptions = (user: TUser) => ({
  ...prosecutorIndictmentSharedWhereOptions(user),
  ...prosecutorIndictmentCompletedWhereOptions,
})
