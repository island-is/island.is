export const CONFIRM_PROSECUTOR_DECISION = 'CONFIRM_PROSECUTOR_DECISION'
export const REVIEWER_ASSIGNED = 'REVIEWER_ASSIGNED'

export type ConfirmationModal =
  | typeof REVIEWER_ASSIGNED
  | typeof CONFIRM_PROSECUTOR_DECISION

export const isReviewerAssignedModal = (modal?: ConfirmationModal) =>
  modal === REVIEWER_ASSIGNED
export const isConfirmProsecutorDecisionModal = (modal?: ConfirmationModal) =>
  modal === CONFIRM_PROSECUTOR_DECISION
