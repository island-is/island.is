import { getValueViaPath, NO } from '@island.is/application/core'
import { Application, FormValue } from '@island.is/application/types'
import * as kennitala from 'kennitala'

const ASSIGNee_DECLINED_HOUSEHOLD_RADIO = 'approveBeingAHousholdMemberRadio'

const normalizeNationalId = (id: string): string =>
  kennitala.isValid(id) ? kennitala.sanitize(id) : id

const normalizeNationalIdList = (ids: string[]): string[] =>
  ids.map((id) => normalizeNationalId(id))

/**
 * Assignees who declined household membership (`approveBeingAHousholdMemberRadio` = no).
 * Merges `rejectedAssignees` with per-assignee answers so rejections survive re-approval prep.
 */
export const getRejectedAssigneeNationalIdsFromAnswers = (
  answers: FormValue,
): string[] => {
  const fromList = normalizeNationalIdList(
    getValueViaPath<string[]>(answers, 'rejectedAssignees') ?? [],
  )
  const fromRadio: string[] = []
  const record = answers as Record<string, unknown>
  for (const topKey of Object.keys(record)) {
    if (!kennitala.isValid(topKey)) continue
    const bucket = record[topKey]
    if (!bucket || typeof bucket !== 'object') continue
    const radio = (bucket as Record<string, unknown>)[
      ASSIGNee_DECLINED_HOUSEHOLD_RADIO
    ]
    if (radio === NO) {
      fromRadio.push(kennitala.sanitize(topKey))
    }
  }
  return [
    ...new Set(
      [...fromList, ...fromRadio].map((id) => normalizeNationalId(id)),
    ),
  ]
}

export const getRejectedAssigneeNationalIds = (
  application: Application,
): string[] => getRejectedAssigneeNationalIdsFromAnswers(application.answers)

export const hasRejectedAssigneesInAnswers = (answers: FormValue): boolean =>
  getRejectedAssigneeNationalIdsFromAnswers(answers).length > 0

export const hasRejectedAssignees = (application: Application): boolean =>
  getRejectedAssigneeNationalIds(application).length > 0
