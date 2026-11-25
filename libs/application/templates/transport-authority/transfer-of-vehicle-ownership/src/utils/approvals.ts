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
  // The buyer can change these rows in review, so an approval is tied to its row
  // and isAllowedReviewerRowsChange keeps the row from being restored or changed
  trackRow?: boolean
}

// Must select the same reviewers as getReviewers
const REVIEWER_ANSWERS: ReviewerAnswer[] = [
  { key: 'buyer' },
  {
    key: 'buyerCoOwnerAndOperator',
    isList: true,
    skipRemoved: true,
    roleByType: true,
    trackRow: true,
  },
  { key: 'sellerCoOwner', isList: true },
]

type Reviewer = {
  nationalId?: string
  type?: string
  wasRemoved?: string
  approved?: boolean
}

export type Approval = { nationalId: string; role: string; row?: number }

const getRole = (answer: ReviewerAnswer, reviewer: Reviewer): string =>
  answer.roleByType ? `${answer.key}.${reviewer.type}` : answer.key

const getApproval = (
  answer: ReviewerAnswer,
  reviewer: Reviewer,
  row: number,
): Approval => ({
  nationalId: reviewer.nationalId as string,
  role: getRole(answer, reviewer),
  ...(answer.trackRow && { row }),
})

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

const isRemoved = (reviewer: Reviewer | undefined) =>
  reviewer?.wasRemoved === 'true'

const getReviewerSlots = (
  answers: FormValue,
): (Approval & { approved: boolean })[] =>
  REVIEWER_ANSWERS.flatMap((answer) =>
    getAnswerReviewers(answers, answer).flatMap((reviewer, row) =>
      !reviewer?.nationalId || (answer.skipRemoved && isRemoved(reviewer))
        ? []
        : [
            {
              ...getApproval(answer, reviewer, row),
              approved: !!reviewer.approved,
            },
          ],
    ),
  )

const isSameApproval = (a: Approval) => (b: Approval) =>
  a.nationalId === b.nationalId && a.role === b.role && a.row === b.row

export const getApprovedBy = (answers: FormValue): Approval[] => {
  const approvedBy = getValueViaPath<Approval[]>(answers, APPROVED_BY)
  if (Array.isArray(approvedBy)) return approvedBy

  // Applications that entered review before approvedBy was recorded
  return getReviewerSlots(answers)
    .filter(({ approved }) => approved)
    .map(({ approved, ...approval }) => approval)
}

const withApprovedBy = (
  answers: FormValue,
  approvedBy: Approval[],
): FormValue => {
  const result: FormValue = { ...answers, [APPROVED_BY]: approvedBy }

  // Keep the approved flags, which the UI and template API read, in sync with approvedBy
  REVIEWER_ANSWERS.forEach((answer) => {
    const withFlag = (reviewer: Reviewer, row: number) => ({
      ...reviewer,
      approved:
        !!reviewer?.nationalId &&
        approvedBy.some(isSameApproval(getApproval(answer, reviewer, row))),
    })
    const reviewers = getAnswerReviewers(answers, answer)
    if (answer.isList && reviewers.length > 0) {
      result[answer.key] = reviewers.map(withFlag)
    } else if (!answer.isList && reviewers[0]) {
      result[answer.key] = withFlag(reviewers[0], 0)
    }
  })

  return result
}

// Drops approvals whose reviewer slot was removed or replaced, so they cannot
// count again if the buyer later restores that slot
const getValidApprovals = (answers: FormValue): Approval[] => {
  const slots = getReviewerSlots(answers)
  return getApprovedBy(answers).filter((approval) =>
    slots.some(isSameApproval(approval)),
  )
}

export const resetApprovals = (answers: FormValue): FormValue =>
  withApprovedBy(answers, [])

// Approves every reviewer slot the user currently holds, e.g. both buyer and seller co-owner
export const recordApproval = (
  answers: FormValue,
  nationalId: string | undefined,
): FormValue => {
  const approvedBy = getValidApprovals(answers)
  const newApprovals = getReviewerSlots(answers)
    .filter(
      (slot) =>
        !!nationalId &&
        slot.nationalId === nationalId &&
        !approvedBy.some(isSameApproval(slot)),
    )
    .map(({ approved, ...approval }) => approval)

  return withApprovedBy(answers, [...approvedBy, ...newApprovals])
}

export const isApprovedByAllReviewers = (answers: FormValue): boolean => {
  const approvedBy = getValidApprovals(answers)
  return getReviewerSlots(answers).every((slot) =>
    approvedBy.some(isSameApproval(slot)),
  )
}

// Answer saves do not go through the state machine, so a row's approval would count
// again if the row could be restored or changed back. In review, rows can therefore
// only be added or removed: they cannot be dropped or restored, and an approved row
// keeps its person and role. Re-adding someone creates a new row that needs a new approval.
// A row also cannot claim an approval the server has not recorded, since the approved
// flags are shown to users, read by the template API and trusted by legacy applications.
export const isAllowedReviewerRowsChange = (
  answers: FormValue,
  key: string,
  newValue: unknown,
): boolean => {
  const answer = REVIEWER_ANSWERS.find((a) => a.key === key && a.trackRow)
  if (!answer) return true

  const rows = getAnswerReviewers(answers, answer)
  if (!Array.isArray(newValue) || newValue.length < rows.length) return false

  const approvedBy = getApprovedBy(answers)
  const isRecorded = (reviewer: Reviewer, index: number) =>
    !!reviewer.nationalId &&
    approvedBy.some(isSameApproval(getApproval(answer, reviewer, index)))

  const claimsUnrecordedApproval = newValue.some((value, index) => {
    const newRow = value as Reviewer | undefined
    return (
      !!newRow?.approved && !isRemoved(newRow) && !isRecorded(newRow, index)
    )
  })
  if (claimsUnrecordedApproval) return false

  return rows.every((row, index) => {
    const newRow = newValue[index] as Reviewer | undefined
    if (isRemoved(row)) return isRemoved(newRow)
    if (!row || !isRecorded(row, index)) return true
    return (
      !!newRow &&
      newRow.nationalId === row.nationalId &&
      getRole(answer, newRow) === getRole(answer, row)
    )
  })
}
