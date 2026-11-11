import {
  APPEAL_JUDGE_COUNT,
  getAppealJudges,
  getAppealJudgeUserIds,
} from '@island.is/judicial-system/types'
import type {
  AppealCase,
  UpdateAppealCaseInput,
  User,
} from '@island.is/judicial-system-web/src/graphql/schema'

// A judge select on the registration page: the judge chosen for it, or empty.
export type BenchSlot = User | null | undefined

type AppealRoles = {
  appealAssistant?: User | null
  judges: BenchSlot[]
}

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

// The ids of the chosen judges in seat order; empty seats are skipped.
export const getSelectedJudgeIds = (judges: BenchSlot[]): string[] =>
  judges.map((judge) => judge?.id).filter((id): id is string => Boolean(id))

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
