import { getValueViaPath } from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'

// Recorded by the state machine from the authenticated user on APPROVE. No role
// has write access to it, so unlike the approved flags it cannot be set by the client.
const APPROVED_BY = 'approvedBy'

type ReviewerAnswer = {
  key: string
  isList?: boolean
  skipRemoved?: boolean
  // The role depends on the row's type, so changing it requires a new approval
  roleByType?: boolean
}

// Must select the same reviewers as getReviewers
const REVIEWER_ANSWERS: ReviewerAnswer[] = [
  { key: 'ownerCoOwner', isList: true },
  { key: 'operators', isList: true, skipRemoved: true },
]

type Reviewer = {
  nationalId?: string
  type?: string
  wasRemoved?: string
  approved?: boolean
}

export type Approval = { nationalId: string; role: string }

const getRole = (answer: ReviewerAnswer, reviewer: Reviewer): string =>
  answer.roleByType ? `${answer.key}.${reviewer.type}` : answer.key

const getAnswerReviewers = (
  answers: FormValue,
  answer: ReviewerAnswer,
): Reviewer[] => {
  const value = getValueViaPath<Reviewer | Reviewer[]>(answers, answer.key)
  if (answer.isList) return Array.isArray(value) ? value : []
  return value && typeof value === 'object' && !Array.isArray(value)
    ? [value]
    : []
}

const getReviewerSlots = (
  answers: FormValue,
): (Approval & { approved: boolean })[] =>
  REVIEWER_ANSWERS.flatMap((answer) =>
    getAnswerReviewers(answers, answer)
      .filter(
        (reviewer) =>
          !!reviewer?.nationalId &&
          !(answer.skipRemoved && reviewer.wasRemoved === 'true'),
      )
      .map((reviewer) => ({
        nationalId: reviewer.nationalId as string,
        role: getRole(answer, reviewer),
        approved: !!reviewer.approved,
      })),
  )

const isSameApproval = (a: Approval) => (b: Approval) =>
  a.nationalId === b.nationalId && a.role === b.role

export const getApprovedBy = (answers: FormValue): Approval[] => {
  const approvedBy = getValueViaPath<Approval[]>(answers, APPROVED_BY)
  if (Array.isArray(approvedBy)) return approvedBy

  // Applications that entered review before approvedBy was recorded
  return getReviewerSlots(answers)
    .filter(({ approved }) => approved)
    .map(({ nationalId, role }) => ({ nationalId, role }))
}

const withApprovedBy = (
  answers: FormValue,
  approvedBy: Approval[],
): FormValue => {
  const result: FormValue = { ...answers, [APPROVED_BY]: approvedBy }

  // Keep the approved flags, which the UI and template API read, in sync with approvedBy
  REVIEWER_ANSWERS.forEach((answer) => {
    const withFlag = (reviewer: Reviewer) => ({
      ...reviewer,
      approved:
        !!reviewer?.nationalId &&
        approvedBy.some(
          isSameApproval({
            nationalId: reviewer.nationalId,
            role: getRole(answer, reviewer),
          }),
        ),
    })
    const reviewers = getAnswerReviewers(answers, answer)
    if (answer.isList && reviewers.length > 0) {
      result[answer.key] = reviewers.map(withFlag)
    } else if (!answer.isList && reviewers[0]) {
      result[answer.key] = withFlag(reviewers[0])
    }
  })

  return result
}

export const resetApprovals = (answers: FormValue): FormValue =>
  withApprovedBy(answers, [])

// Approves every reviewer slot the user currently holds, e.g. both buyer and seller co-owner
export const recordApproval = (
  answers: FormValue,
  nationalId: string | undefined,
): FormValue => {
  const approvedBy = getApprovedBy(answers)
  const newApprovals = getReviewerSlots(answers)
    .filter(
      (slot) =>
        !!nationalId &&
        slot.nationalId === nationalId &&
        !approvedBy.some(isSameApproval(slot)),
    )
    .map(({ role }) => ({ nationalId: nationalId as string, role }))

  return withApprovedBy(answers, [...approvedBy, ...newApprovals])
}

export const isApprovedByAllReviewers = (answers: FormValue): boolean => {
  const approvedBy = getApprovedBy(answers)
  return getReviewerSlots(answers).every((slot) =>
    approvedBy.some(isSameApproval(slot)),
  )
}
