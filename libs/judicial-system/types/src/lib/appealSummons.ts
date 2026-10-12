import type { InstitutionUser } from './user'
import { isPublicProsecutionOfficeUser } from './user'

export enum AppealSummonsAppellantSide {
  DEFENCE = 'DEFENCE',
  PROSECUTION = 'PROSECUTION',
}

export enum AppealSummonsAction {
  ISSUE = 'ISSUE',
  EDIT = 'EDIT',
  DELETE = 'DELETE',
  OPEN = 'OPEN',
}

export type AppealSummonsStatus = 'draft' | 'confirmed' | 'inService' | 'sent'

export interface AppealSummonsStatusFields {
  confirmedDate?: Date | string | null
  sentToCourtOfAppealsDate?: Date | string | null
  services?: unknown[] | null
}

export const getAppealSummonsStatus = (
  summons: AppealSummonsStatusFields,
): AppealSummonsStatus => {
  if (summons.sentToCourtOfAppealsDate) {
    return 'sent'
  }

  if (
    summons.services !== undefined &&
    summons.services !== null &&
    summons.services.length > 0
  ) {
    return 'inService'
  }

  if (summons.confirmedDate) {
    return 'confirmed'
  }

  return 'draft'
}

export const canIssueAppealSummons = (
  user: InstitutionUser | undefined,
  hasVerdictAppealCase: boolean,
): boolean => isPublicProsecutionOfficeUser(user) && hasVerdictAppealCase

export const canPerformAppealSummonsAction = (
  action: AppealSummonsAction,
  summons: AppealSummonsStatusFields,
  user: InstitutionUser | undefined,
): boolean => {
  if (!isPublicProsecutionOfficeUser(user)) {
    return false
  }

  if (action === AppealSummonsAction.OPEN) {
    return true
  }

  if (
    action === AppealSummonsAction.EDIT ||
    action === AppealSummonsAction.DELETE
  ) {
    const status = getAppealSummonsStatus(summons)

    return status === 'draft' || status === 'confirmed'
  }

  return false
}
