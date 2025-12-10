import formatISO from 'date-fns/formatISO'
import isNil from 'lodash/isNil'
import isUndefined from 'lodash/isUndefined'
import omitBy from 'lodash/omitBy'

import {
  Case,
  UpdateCaseInput,
} from '@island.is/judicial-system-web/src/graphql/schema'

type ChildKeys = Pick<
  UpdateCaseInput,
  | 'courtId'
  | 'prosecutorId'
  | 'sharedWithProsecutorsOfficeId'
  | 'registrarId'
  | 'judgeId'
  | 'appealAssistantId'
  | 'appealJudge1Id'
  | 'appealJudge2Id'
  | 'appealJudge3Id'
  | 'indictmentReviewerId'
  | 'mergeCaseId'
>

export type UpdateCase = Omit<UpdateCaseInput, 'id'> & {
  force?: boolean
}

const isChildKey = (key: keyof UpdateCaseInput): key is keyof ChildKeys => {
  return [
    'courtId',
    'prosecutorId',
    'sharedWithProsecutorsOfficeId',
    'registrarId',
    'judgeId',
    'appealAssistantId',
    'appealJudge1Id',
    'appealJudge2Id',
    'appealJudge3Id',
    'indictmentReviewerId',
    'mergeCaseId',
  ].includes(key)
}

const childof: { [Property in keyof ChildKeys]-?: keyof Case } = {
  courtId: 'court',
  prosecutorId: 'prosecutor',
  sharedWithProsecutorsOfficeId: 'sharedWithProsecutorsOffice',
  registrarId: 'registrar',
  judgeId: 'judge',
  appealAssistantId: 'appealAssistant',
  appealJudge1Id: 'appealJudge1',
  appealJudge2Id: 'appealJudge2',
  appealJudge3Id: 'appealJudge3',
  indictmentReviewerId: 'indictmentReviewer',
  mergeCaseId: 'mergeCase',
}

const overwrite = (update: UpdateCase): UpdateCase => {
  const validUpdates = omitBy<UpdateCase>(update, isUndefined)

  return validUpdates
}

const fieldHasValue = (workingCase: Case) => (value: unknown, key: string) => {
  const theKey = key as keyof UpdateCaseInput

  if (
    isChildKey(theKey) // check if key is f.example `judgeId`
      ? isNil(workingCase[childof[theKey]])
      : isNil(workingCase[theKey])
  ) {
    return value === undefined
  }

  return true
}

export const update = (update: UpdateCase, workingCase: Case): UpdateCase => {
  const validUpdates = omitBy<UpdateCase>(update, fieldHasValue(workingCase))

  return validUpdates
}

export const formatUpdates = (updates: UpdateCase[], workingCase: Case) => {
  const changes: UpdateCase[] = updates.map((entry) => {
    if (entry.force) {
      return overwrite(entry)
    }

    return update(entry, workingCase)
  })

  const newWorkingCase = changes.reduce<UpdateCase>(
    (currentUpdates, nextUpdates) => {
      return { ...currentUpdates, ...nextUpdates }
    },
    {} as UpdateCase,
  )

  return newWorkingCase
}

export const formatDateForServer = (date: Date) => {
  return formatISO(date, { representation: 'complete' })
}
