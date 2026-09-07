export const CONFIRM_PROSECUTOR_DECISION = 'CONFIRM_PROSECUTOR_DECISION'
export const REVIEWER_ASSIGNED = 'REVIEWER_ASSIGNED'
export const DUPLICATE_INDICTMENT = 'DUPLICATE_INDICTMENT'

export type ModalId =
  | typeof REVIEWER_ASSIGNED
  | typeof CONFIRM_PROSECUTOR_DECISION
  | typeof DUPLICATE_INDICTMENT

export const isReviewerAssignedModal = (modal?: ModalId) =>
  modal === REVIEWER_ASSIGNED
export const isConfirmProsecutorDecisionModal = (modal?: ModalId) =>
  modal === CONFIRM_PROSECUTOR_DECISION
export const isDuplicateIndictmentModal = (modal?: ModalId) =>
  modal === DUPLICATE_INDICTMENT
