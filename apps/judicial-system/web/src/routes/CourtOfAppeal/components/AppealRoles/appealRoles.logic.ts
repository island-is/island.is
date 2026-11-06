import {
  APPEAL_JUDGE_COUNT,
  getAppealJudges,
  getAppealJudgeUserIds,
  MAX_APPEAL_JUDGE_COUNT,
} from '@island.is/judicial-system/types'
import type {
  AppealCase,
  UpdateAppealCaseInput,
  User,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { UserRole } from '@island.is/judicial-system-web/src/graphql/schema'
import type { ReactSelectOption } from '@island.is/judicial-system-web/src/types'

// A judge select on a registration page: the judge chosen for it, or empty.
export type BenchSlot = User | null | undefined

type AppealRoles = {
  appealAssistant?: User | null
  judges: BenchSlot[]
}

export type AssistantSelectOption = ReactSelectOption & { assistant: User }
export type JudgeSelectOption = ReactSelectOption & { judge: User }

// The selects the page shows: the bench as stored, in order, padded to the
// default number of seats. A bench larger than the default keeps every seat.
export const getBenchSlots = (
  appealCase: Pick<AppealCase, 'appealJudges'> | null | undefined,
): BenchSlot[] => {
  const slots: BenchSlot[] = getAppealJudges(appealCase)

  while (slots.length < APPEAL_JUDGE_COUNT) {
    slots.push(null)
  }

  return slots
}

// Seats a judge, or empties the seat when the selection is cleared.
export const setBenchSeat = (
  judges: BenchSlot[],
  seat: number,
  judge: BenchSlot,
): BenchSlot[] => judges.map((slot, index) => (index === seat ? judge : slot))

// A seat as a page that lets seats come and go keeps it. The key stays with
// the seat while seats are added and removed around it, which is what lets
// the page animate the row that left rather than the last one.
export type BenchSeat = { key: string; judge: BenchSlot }

let seatKeySequence = 0

const nextSeatKey = (): string => `seat-${++seatKeySequence}`

// The seats for a bench. A seat that was already there keeps its key, so a
// bench read back after a save does not play its rows in again; a seat
// beyond what was there gets a new one.
export const getBenchSeats = (
  slots: BenchSlot[],
  previous: BenchSeat[] = [],
): BenchSeat[] =>
  slots.map((judge, seat) => ({
    key: previous[seat]?.key ?? nextSeatKey(),
    judge,
  }))

export const getBenchJudges = (seats: BenchSeat[]): BenchSlot[] =>
  seats.map(({ judge }) => judge)

export const setBenchSeatJudge = (
  seats: BenchSeat[],
  key: string,
  judge: BenchSlot,
): BenchSeat[] =>
  seats.map((seat) => (seat.key === key ? { key, judge } : seat))

export const canAddBenchSeat = (judges: BenchSlot[]): boolean =>
  judges.length < MAX_APPEAL_JUDGE_COUNT

// Adds an empty seat at the end of the bench, up to the most judges the court
// seats on one case.
export const addBenchSeat = (seats: BenchSeat[]): BenchSeat[] =>
  canAddBenchSeat(getBenchJudges(seats))
    ? [...seats, { key: nextSeatKey(), judge: null }]
    : seats

// A seat can be taken away while the bench has more than the default number
// of seats. The presiding seat always stays.
export const canRemoveBenchSeat = (
  judges: BenchSlot[],
  seat: number,
): boolean => judges.length > APPEAL_JUDGE_COUNT && seat > 0

// A key no longer on the bench, as from a row still playing out, changes
// nothing.
export const removeBenchSeat = (
  seats: BenchSeat[],
  key: string,
): BenchSeat[] => {
  const seat = seats.findIndex((candidate) => candidate.key === key)

  return seat >= 0 && canRemoveBenchSeat(getBenchJudges(seats), seat)
    ? seats.filter((candidate) => candidate.key !== key)
    : seats
}

// The ids of the chosen judges in seat order; empty seats are skipped.
export const getSelectedJudgeIds = (judges: BenchSlot[]): string[] =>
  judges.map((judge) => judge?.id).filter((id): id is string => Boolean(id))

// Whether a filled seat follows an empty one. The bench is saved without its
// empty seats, so a gap would move a later judge up, possibly into the
// presiding seat, without the court having chosen that.
export const hasBenchSeatGap = (judges: BenchSlot[]): boolean =>
  judges.some(
    (judge, seat) =>
      !judge?.id && judges.slice(seat + 1).some((later) => Boolean(later?.id)),
  )

export const getAssistantOptions = (
  users: User[] | null | undefined,
): AssistantSelectOption[] =>
  (users ?? [])
    .filter((user) => user.role === UserRole.COURT_OF_APPEALS_ASSISTANT)
    .map((assistant) => ({
      label: assistant.name ?? '',
      value: assistant.id,
      assistant,
    }))

// The judges that can still be seated: a judge already on the bench is not
// offered for another seat.
export const getJudgeOptions = (
  users: User[] | null | undefined,
  judges: BenchSlot[],
): JudgeSelectOption[] => {
  const selectedJudgeIds = getSelectedJudgeIds(judges)

  return (users ?? [])
    .filter(
      (user) =>
        user.role === UserRole.COURT_OF_APPEALS_JUDGE &&
        !selectedJudgeIds.includes(user.id),
    )
    .map((judge) => ({ label: judge.name ?? '', value: judge.id, judge }))
}

const isSameBench = (a: string[], b: string[]): boolean =>
  a.length === b.length && a.every((id, index) => id === b[index])

export const isAnyRoleUnfilled = ({
  appealAssistant,
  judges,
}: AppealRoles): boolean =>
  !appealAssistant?.id || judges.some((judge) => !judge?.id)

// Whether the selection differs from what is saved on the appeal case. The
// order of the bench matters: the first judge presides.
export const hasUnsavedRoleChanges = (
  appealCase: AppealCase | null | undefined,
  { appealAssistant, judges }: AppealRoles,
): boolean =>
  appealAssistant?.id !== appealCase?.appealAssistant?.id ||
  !isSameBench(getSelectedJudgeIds(judges), getAppealJudgeUserIds(appealCase))

// The update to send: only the roles that changed. The bench is sent whole,
// in order, whenever any seat changed.
export const buildAppealCaseUpdate = (
  appealCase: AppealCase | null | undefined,
  { appealAssistant, judges }: AppealRoles,
): Pick<UpdateAppealCaseInput, 'appealAssistantId' | 'appealJudgeIds'> => {
  const update: Pick<
    UpdateAppealCaseInput,
    'appealAssistantId' | 'appealJudgeIds'
  > = {}

  if (appealAssistant?.id !== appealCase?.appealAssistant?.id) {
    update.appealAssistantId = appealAssistant?.id
  }

  const judgeIds = getSelectedJudgeIds(judges)

  if (!isSameBench(judgeIds, getAppealJudgeUserIds(appealCase))) {
    update.appealJudgeIds = judgeIds
  }

  return update
}

// The users that were not assigned to any role before this change. This
// mirrors the backend logic that decides who gets the APPEAL_JUDGES_ASSIGNED
// notification.
export const getNewlyAssignedUserIds = (
  appealCase: AppealCase | null | undefined,
  { appealAssistant, judges }: AppealRoles,
): string[] => {
  const previouslyAssignedIds = [
    appealCase?.appealAssistant?.id,
    ...getAppealJudgeUserIds(appealCase),
  ].filter((id): id is string => Boolean(id))

  return [appealAssistant?.id, ...getSelectedJudgeIds(judges)]
    .filter((id): id is string => Boolean(id))
    .filter((id) => !previouslyAssignedIds.includes(id))
}

// The appeal case as it would be once the selection is saved, for validation
// and for the working case after a save.
export const toPreviewAppealCase = (
  appealCase: AppealCase,
  { appealAssistant, judges }: AppealRoles,
): AppealCase => ({
  ...appealCase,
  appealAssistant,
  appealJudges: judges
    .filter((judge): judge is User => Boolean(judge))
    .map((user, displayOrder) => ({
      id: user.id,
      displayOrder,
      userId: user.id,
      user,
    })),
})
