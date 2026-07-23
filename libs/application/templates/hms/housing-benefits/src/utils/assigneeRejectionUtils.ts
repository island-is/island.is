import { getValueViaPath, NO } from '@island.is/application/core'
import {
  Application,
  ExternalData,
  FormValue,
} from '@island.is/application/types'
import * as kennitala from 'kennitala'
import { getAssigneeNationalIds } from './assigneeUtils'

export const normalizeNationalId = (id: string): string =>
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
      'approveBeingAHousholdMemberRadio'
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

export const hasAllAssigneesRejectedInAnswers = (
  answers: FormValue,
  externalData: ExternalData,
): boolean => {
  const application = { answers, externalData } as Application
  const applicantId = normalizeNationalId(
    getValueViaPath<string>(externalData, 'nationalRegistry.data.nationalId') ??
      application.applicant,
  )

  const assigneeIds = getAssigneeNationalIds(application)
    .map(normalizeNationalId)
    .filter((id) => id !== applicantId)

  if (assigneeIds.length === 0) return false

  const signed = (getValueViaPath<string[]>(answers, 'signedAssignees') ?? [])
    .map(normalizeNationalId)
    .filter((id) => id !== applicantId)

  return signed.length === 0
}
